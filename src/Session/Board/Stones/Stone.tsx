import React, { FC, useContext, useEffect, useState } from "react";

import {
  getSingleUserStats,
  updateGame,
  updateStonePosition,
  updateUserStats,
  empowerStone,
  handicapStone,
  highlightStone,
  updateStoneInvisibility,
  updateStoneOnTakeOver,
  statusType,
} from "../../../api/firestore";
import {
  amIStoneOwner,
  canDraggedStoneMoveToThisPosition,
  getStashedStonePillCount,
  getStashTargetPosition,
  isItMyTurn,
  nextTurnPlayerId,
  rotateOponentStones,
  shouldChickenTurnIntoHen,
  setStonePosition,
} from "./StoneService";
import { AppContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";
import { useParams } from "react-router";
import { DocumentData } from "firebase/firestore";
import { StoneStashCountPill } from "./StoneStashCountPill/StoneStashCountPill";
import { getImgReference } from "../../../images/imageRelatedService";
import { lionConquerAttemptEvaluation } from "./LionStoneService";

import styles from "./Stone.module.css";
import { switchMoveToOtherPlayer } from "../../SessionService";
import { trackStoneMove } from "../BoardField/FieldServiceMoveTracking";

export type stoneType = "CHICKEN" | "ELEPHANT" | "GIRAFFE" | "LION" | "HEN";

//STONES
export interface StoneInterface {
  allStones: StoneInterface[];
  amIOpponent?: boolean;
  canTakeStone?: boolean;
  columnLetters?: string[];
  currentOwner: string;
  draggedStone?: StoneInterface;
  gameData?: DocumentData | undefined;
  highlighted: boolean;
  id: string;
  invisible: boolean;
  lyingStone?: StoneInterface;
  originalOwner: string;
  positionColumnLetter: string;
  positionRowNumber: number;
  rowNumbers?: number[];
  setCanTakeStone?: Function;
  setDraggedStone?: Function;
  setLyingStone?: Function;
  stashed: boolean;
  type: stoneType;
}

function shouldShowStoneStashCountPill(
  allStones: StoneInterface[],
  currentOwner: string,
  stashed: boolean,
  type: stoneType,
  hideStoneStashCountPill: boolean
) {
  return (
    getStashedStonePillCount({
      allStones: allStones,
      currentOwnerId: currentOwner,
      stashed: stashed,
      type: type,
    }) > 1 && !hideStoneStashCountPill
  );
}

export function canStoneBeDragged(
  status: statusType,
  currentOwner: string,
  loggedInUserUserId: string
) {
  return (
    status === "INPROGRESS" &&
    amIStoneOwner({
      currentOwner: currentOwner,
      loggedInUserUserId: loggedInUserUserId,
    })
  );
}

function getDragStartAction(
  loggedInUserUserId: string,
  currentPlayerTurn: string,
  onDragStartHandler: (event: React.DragEvent<HTMLDivElement>) => void,
  onDragStartHandlerDisallowed: (event: React.DragEvent<HTMLDivElement>) => void
) {
  if (
    isItMyTurn({
      myId: loggedInUserUserId,
      currentTurnPlayerId: currentPlayerTurn,
    })
  ) {
    return onDragStartHandler;
  } else {
    return onDragStartHandlerDisallowed;
  }
}

function shouldHighlightStone(stone: StoneInterface[]) {
  return stone[0] && stone[0].highlighted;
}

function shouldMakeStoneInvisible(stone: StoneInterface[]) {
  return stone[0] && stone[0].invisible;
}

function getStone(allStones: StoneInterface[], id: string) {
  return allStones.filter((stone) => stone.id === id);
}

function isDraggedStoneStillAboveItself(
  lyingStone: StoneInterface,
  draggedStone: StoneInterface
) {
  return lyingStone.id === draggedStone.id;
}

function isDraggedStoneComingFromStash(draggedStone: StoneInterface) {
  return draggedStone.stashed;
}

function isDraggedStoneHoveringAboveOwnStone(
  lyingStone: StoneInterface,
  draggedStone: StoneInterface
) {
  return lyingStone.currentOwner === draggedStone.currentOwner;
}

export const Stone: FC<StoneInterface> = ({
  allStones,
  amIOpponent,
  currentOwner,
  columnLetters,
  canTakeStone,
  draggedStone,
  gameData,
  highlighted,
  id,
  invisible,
  lyingStone,
  originalOwner,
  positionColumnLetter,
  positionRowNumber,
  rowNumbers,
  setCanTakeStone,
  setDraggedStone,
  setLyingStone,
  stashed,
  type,
}) => {
  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);
  const { gameId } = useParams();
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [hideStoneStashCountPill, setHideStoneStashCountPill] =
    useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>();
  const [screenHeight, setScreenHeight] = useState<number>();
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isInvisible, setIsInvisible] = useState<boolean>(false);
  const stashedPillCount = getStashedStonePillCount({
    allStones: allStones ?? [],
    currentOwnerId: currentOwner,
    stashed,
    type,
  });

  // Make sure stones are in place even after change of the UI size and appearance of new elements
  const onResizeHandler = ({
    newHeight,
    newWidth,
  }: {
    newHeight: number;
    newWidth: number;
  }) => {
    setScreenHeight(newHeight);
    setScreenWidth(newWidth);
  };
  window.addEventListener("resize", () =>
    onResizeHandler({
      newHeight: window.innerHeight,
      newWidth: window.innerWidth,
    })
  );

  useEffect(() => {
    const stone: StoneInterface[] = getStone(allStones, id);
    shouldHighlightStone(stone) && setIsHighlighted(true);
    shouldMakeStoneInvisible(stone) && setIsInvisible(true);
  }, [allStones, id]);

  useEffect(() => {
    setStonePosition({
      stoneId: id,
      targetPositionColumnLetter: positionColumnLetter,
      targetPositionRowNumber: positionRowNumber,
      positionX,
      positionY,
      setPositionX,
      setPositionY,
    });
  }, [
    id,
    positionColumnLetter,
    positionRowNumber,
    positionX,
    positionY,
    screenHeight,
    screenWidth,
    setStonePosition,
  ]);

  useEffect(() => {
    setStonePosition({
      stoneId: id,
      targetPositionColumnLetter: positionColumnLetter,
      targetPositionRowNumber: positionRowNumber,
      positionX,
      positionY,
      setPositionX,
      setPositionY,
    });
    rotateOponentStones({
      currentOwner: currentOwner,
      loggedInUserUserId: loggedInUserUserId,
      setRotateDegrees,
    });
  }, [
    id,
    positionColumnLetter,
    positionRowNumber,
    positionX,
    positionY,
    amIOpponent,
    rowNumbers,
    columnLetters,
  ]);

  const onDragStartHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("placedStoneId", id);
    event.dataTransfer.setData("placedStoneType", type);
    event.dataTransfer.setData("movedFromColumnLetter", positionColumnLetter);
    event.dataTransfer.setData("movedFromRowNumber", String(positionRowNumber));
    setDraggedStone &&
      setDraggedStone({
        amIOpponent,
        columnLetters,
        currentOwner,
        id,
        originalOwner,
        positionColumnLetter,
        positionRowNumber,
        rowNumbers,
        stashed,
        type,
      });
    setHideStoneStashCountPill(true);
  };

  const onDragStartHandlerDisallowed = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
  };

  const onDragEnterHandler = () => {
    setLyingStone &&
      setLyingStone({
        amIOpponent,
        id,
        type,
        originalOwner,
        currentOwner,
        stashed,
        positionColumnLetter,
        positionRowNumber,
        rowNumbers,
        columnLetters,
      });
  };

  const onTakeOverAttemptHandler = (event: React.DragEvent<HTMLDivElement>) => {
    if (!lyingStone || !draggedStone || !setCanTakeStone) {
      return;
    }

    if (isDraggedStoneStillAboveItself(lyingStone, draggedStone)) {
      setCanTakeStone(false);
      return;
    }

    if (isDraggedStoneComingFromStash(draggedStone)) {
      return;
    }

    if (isDraggedStoneHoveringAboveOwnStone(lyingStone, draggedStone)) {
      setCanTakeStone(false);
      return;
    }

    if (
      !canDraggedStoneMoveToThisPosition({
        stoneType: draggedStone.type,
        movedFromColumnLetter: draggedStone.positionColumnLetter,
        movedFromRowNumber: draggedStone.positionRowNumber,
        movingToLetter: lyingStone.positionColumnLetter,
        movingToNumber: lyingStone.positionRowNumber,
        amIOpponent: !!draggedStone.amIOpponent,
        stashed: draggedStone.stashed,
      })
    ) {
      setCanTakeStone(false);
      return;
    }

    setCanTakeStone(true);
    return;
  };

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    const updateStats = updateUserStats;
    setHideStoneStashCountPill(false);

    if (!lyingStone || !draggedStone || !canTakeStone) {
      return;
    }

    if (canTakeStone) {
      // Prepare data for stone move tracking
      let updatedMoves = gameData?.moves;
      let draggedStoneCoordinates = `${draggedStone.positionColumnLetter}${draggedStone.positionRowNumber}`;
      let targetStoneCoordinates = `${lyingStone.positionColumnLetter}${lyingStone.positionRowNumber}`;
      updatedMoves.push({
        moveNumber:
          updatedMoves.length > 0
            ? updatedMoves[updatedMoves.length - 1].moveNumber + 1
            : 0,
        id: draggedStone.id,
        type: draggedStone.type,
        movingPlayerId: loggedInUserUserId,
        fromCoordinates: draggedStoneCoordinates,
        targetCoordinates: targetStoneCoordinates,
        isTakeOver: false,
        isVictory: false,
      });
      // Send data for stone move tracking
      updateGame({
        id: gameId!,
        updatedDetails: {
          moves: updatedMoves,
        },
      });

      // trackStoneMove(
      //   gameData!,
      //   draggedStone.id,
      //   draggedStone.type,
      //   loggedInUserUserId,
      //   draggedStone.positionColumnLetter,
      //   draggedStone.positionRowNumber,
      //   lyingStone.positionColumnLetter,
      //   lyingStone.positionRowNumber
      // );

      //Victory handling for taking a LION
      if (lyingStone.type === "LION") {
        updateGame({
          id: gameId!,
          updatedDetails: {
            status: "COMPLETED",
            winner: draggedStone.currentOwner,
            victoryType: "LION_CAUGHT_SUCCESS",
            finishedTimeStamp: Date.now(),
            currentPlayerTurn: lyingStone.currentOwner,
          },
        });
        //Update dragged stone
        updateStonePosition({
          gameId: gameId!,
          stoneId: draggedStone.id,
          positionColumnLetter: lyingStone.positionColumnLetter,
          positionRowNumber: lyingStone.positionRowNumber,
        });
        //Highlight the taking stone to make it clear it has taken the opponents lion
        highlightStone({ gameId: gameId!, stoneId: id, highlighted: true });

        //Set the lion stone to invisible after it has been taken
        updateStoneInvisibility({
          gameId: gameId!,
          stoneId: lyingStone.id,
          invisible: true,
        });

        getSingleUserStats({ userId: lyingStone.originalOwner }).then(
          (serverStats) =>
            updateStats({
              userId: lyingStone.originalOwner,
              updatedDetails: { loss: serverStats.data()?.loss + 1 },
            })
        );
        getSingleUserStats({ userId: draggedStone.currentOwner }).then(
          (serverStats) =>
            updateStats({
              userId: draggedStone.currentOwner,
              updatedDetails: { win: serverStats.data()?.win + 1 },
            })
        );
        return;
      }

      //Evaluate whether a lion-move is a homebase-conquer attempt and leads to a game end
      const lionConquerAttemptResult = lionConquerAttemptEvaluation({
        stoneData: draggedStone,
        amIOpponent: amIOpponent!,
        movingToLetter: lyingStone.positionColumnLetter,
        movingToNumber: lyingStone.positionRowNumber,
        stones: allStones!,
      });
      if (lionConquerAttemptResult.success !== undefined) {
        const { success, conqueringPlayerId, conqueredPlayerId } =
          lionConquerAttemptResult;
        // console.log('success', success);
        // console.log('conqueringPlayerId', conqueringPlayerId);
        // console.log('conqueredPlayerId', conqueredPlayerId);
        if (success === true) {
          updateGame({
            id: gameId!,
            updatedDetails: {
              status: "COMPLETED",
              winner: conqueringPlayerId,
              victoryType: "HOMEBASE_CONQUERED_SUCCESS",
            },
          });
          getSingleUserStats({ userId: conqueredPlayerId! }).then(
            (serverStats) =>
              updateStats({
                userId: conqueredPlayerId!,
                updatedDetails: { loss: serverStats.data()?.loss + 1 },
              })
          );
          getSingleUserStats({ userId: conqueringPlayerId! }).then(
            (serverStats) =>
              updateStats({
                userId: conqueringPlayerId!,
                updatedDetails: { win: serverStats.data()?.win + 1 },
              })
          );
        } else {
          lionConquerAttemptResult.endangeringOpponentStones.forEach((id) => {
            highlightStone({ gameId: gameId!, stoneId: id, highlighted: true });
          });
          updateGame({
            id: gameId!,
            updatedDetails: {
              status: "COMPLETED",
              winner: conqueredPlayerId,
              victoryType: "HOMEBASE_CONQUERED_FAILURE",
            },
          });
          getSingleUserStats({ userId: conqueringPlayerId! }).then(
            (serverStats) =>
              updateStats({
                userId: conqueringPlayerId!,
                updatedDetails: { loss: serverStats.data()?.loss + 1 },
              })
          );
          getSingleUserStats({ userId: conqueredPlayerId! }).then(
            (serverStats) =>
              updateStats({
                userId: conqueredPlayerId!,
                updatedDetails: { win: serverStats.data()?.win + 1 },
              })
          );
        }

        // console.log('The stone can move here');
        // console.log('lionConquerAttemptSuccessful', lionConquerAttempt.success);
      }

      //Special handling to handicap a HEN getting stashed
      if (lyingStone.type === "HEN") {
        // console.log('dis-empowering!');
        handicapStone({
          gameId: gameId!,
          stoneId: lyingStone.id,
          type: "CHICKEN",
        });
      }

      //Update taken stone
      updateStoneOnTakeOver({
        gameId: gameId!,
        stone: {
          id: lyingStone.id,
          currentOwner: draggedStone.currentOwner,
          stashed: true,
          positionColumnLetter: getStashTargetPosition({
            type: lyingStone.type,
            amIOpponent: amIOpponent!,
          }),
          positionRowNumber: 1,
        },
      });

      // Prepare data for stone move tracking
      updatedMoves = gameData?.moves;
      draggedStoneCoordinates = `${lyingStone.positionColumnLetter}${lyingStone.positionRowNumber}`;
      targetStoneCoordinates = `${getStashTargetPosition({
        type: lyingStone.type,
        amIOpponent: amIOpponent!,
      })}${lyingStone.positionRowNumber}`;
      updatedMoves.push({
        moveNumber:
          updatedMoves.length > 0
            ? updatedMoves[updatedMoves.length - 1].moveNumber + 1
            : 0,
        id: lyingStone.id,
        type: lyingStone.type,
        movingPlayerId: loggedInUserUserId,
        fromCoordinates: draggedStoneCoordinates,
        targetCoordinates: targetStoneCoordinates,
        isTakeOver: true,
        isVictory: false,
      });
      // Send data for stone move tracking
      updateGame({
        id: gameId!,
        updatedDetails: {
          moves: updatedMoves,
        },
      });
      // trackStoneMove(
      //   gameData!,
      //   lyingStone.id,
      //   lyingStone.type,
      //   loggedInUserUserId,
      //   lyingStone.positionColumnLetter,
      //   lyingStone.positionRowNumber,
      //   getStashTargetPosition({
      //     type: lyingStone.type,
      //     amIOpponent: amIOpponent!,
      //   }),
      //   lyingStone.positionRowNumber
      // );

      //Special handling to empower a CHICKEN when it should become a HEN
      if (draggedStone.type === "CHICKEN") {
        // this turnChickenToHen could be ensapsulated in shouldChickenTurnIntoHen() which would also trigger the empowerStone()
        let turnChickenToHen = shouldChickenTurnIntoHen({
          amIOpponent: amIOpponent!,
          type: draggedStone!.type,
          stashed: draggedStone!.stashed,
          movingToLetter: lyingStone.positionColumnLetter,
          movingToNumber: lyingStone.positionRowNumber,
        });
        // console.log('turnChickenToHen', turnChickenToHen);
        if (turnChickenToHen) {
          // console.log('empowering!');
          empowerStone({
            gameId: gameId!,
            stoneId: draggedStone.id,
            type: "HEN",
          });
        }
      }

      updateStonePosition({
        gameId: gameId!,
        stoneId: draggedStone.id,
        positionColumnLetter: lyingStone.positionColumnLetter,
        positionRowNumber: lyingStone.positionRowNumber,
      });

      switchMoveToOtherPlayer(gameData!, loggedInUserUserId);
    }

    // console.log('Cannot drop');
    return;
  };

  return (
    <div
      id={id}
      draggable={canStoneBeDragged(
        gameData?.status,
        currentOwner,
        loggedInUserUserId
      )}
      onDragStart={getDragStartAction(
        loggedInUserUserId,
        gameData?.currentPlayerTurn,
        onDragStartHandler,
        onDragStartHandlerDisallowed
      )}
      onDragEnter={onDragEnterHandler}
      onDragOver={onTakeOverAttemptHandler}
      onDragEnd={onDropHandler}
      style={{
        backgroundImage: `url(${getImgReference(type)})`,
        transform: `rotate(${rotateDegrees}deg)`,
      }}
      className={`${styles.Stone} ${isHighlighted && styles.Highlighted} ${
        isInvisible && styles.Invisible
      } noselect`}
      // onClick={() => setStonePosition({
      //     stoneId: id,
      //     targetPositionColumnLetter: positionColumnLetter,
      //     targetPositionRowNumber: positionRowNumber,
      //     positionX,
      //     positionY,
      //     setPositionX,
      //     setPositionY
      // })}
    >
      {shouldShowStoneStashCountPill(
        allStones,
        currentOwner,
        stashed,
        type,
        hideStoneStashCountPill
      ) && <StoneStashCountPill count={stashedPillCount} />}
    </div>
  );
};
