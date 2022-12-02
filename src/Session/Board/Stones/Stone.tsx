import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./Stone.module.css";

import {
  getSingleUserStats,
  updateGame,
  updateStonePosition,
  updateUserStats,
  empowerStone,
  useHandicapStone,
  highlightStone,
  useInvisibleStone,
  useUpdateStoneOnTakeOver,
} from "../../../api/firestore";
import {
  amIStoneOwner,
  canStoneMoveThisWay,
  getStashedStonePillCount,
  getStashTargetPosition,
  isItMyTurn,
  nextTurnPlayerId,
  rotateOponentStones,
  shouldChickenTurnIntoHen,
  useSetStonePosition,
} from "./StoneService";
import { AppContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";
import { useParams } from "react-router";
import { DocumentData } from "firebase/firestore";
import { StoneStashCount } from "./StoneStashCount/StoneStashCount";
import { getImgReference } from "../../../images/imageRelatedService";
import { lionConquerAttemptEvaluation } from "./LionStoneService";

export type stoneType = "CHICKEN" | "ELEPHANT" | "GIRAFFE" | "LION" | "HEN";

//STONES
export interface StoneInterface {
  id: string;
  type: stoneType;
  originalOwner: string;
  currentOwner: string;
  highlighted: boolean;
  stashed: boolean;
  invisible: boolean;
  positionColumnLetter: string;
  positionRowNumber: number;
  amIOpponent?: boolean;
  rowNumbers?: number[];
  columnLetters?: string[];
  draggedStone?: StoneInterface;
  lyingStone?: StoneInterface;
  setDraggedStone?: Function;
  setLyingStone?: Function;
  canTakeStone?: boolean;
  setCanTakeStone?: Function;
  gameData?: DocumentData | undefined;
  allStones?: StoneInterface[];
}

export const Stone: FC<StoneInterface> = ({
  amIOpponent,
  id,
  type,
  originalOwner,
  currentOwner,
  highlighted,
  stashed,
  positionColumnLetter,
  positionRowNumber,
  rowNumbers,
  columnLetters,
  draggedStone,
  lyingStone,
  setDraggedStone,
  setLyingStone,
  canTakeStone,
  setCanTakeStone,
  gameData,
  allStones,
}) => {
  const appContext: AppContextInterface = useContext(AppContext);
  const { gameId } = useParams();
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [hideStoneStashCount, setHideStoneStashCount] =
    useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>();
  const [screenHeight, setScreenHeight] = useState<number>();
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isInvisible, setIsInvisible] = useState<boolean>(false);
  const [scroll, setScrollUpdate] = useState(0);

  const setStonePosition = useSetStonePosition;
  const updateStoneOnTakeOver = useUpdateStoneOnTakeOver;
  const makeStoneInvisible = useInvisibleStone;
  const updateStoneType = empowerStone;
  const stashedPillCount = getStashedStonePillCount({
    allStones: allStones ?? [],
    currentOwnerId: currentOwner,
    stashed: stashed,
    type: type,
  });

  //Change stone endangering status
  useEffect(() => {
    let stone: StoneInterface[] | undefined = [];
    stone = allStones?.filter((stone) => stone.id === id);
    if (stone && stone[0] && stone[0].highlighted) {
      setIsHighlighted(true);
    }
    if (stone && stone[0] && stone[0].invisible) {
      setIsInvisible(true);
    }
  }, [allStones, id]);

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

  (function refreshPositions() {})();

  //Position and rotate stones after game starts
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
      loggedInUserUserId: appContext.loggedInUserUserId,
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
    setHideStoneStashCount(true);
  };

  const onDragStartHandlerDisallowed = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    // console.log('it is not your turn');
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

  const onStoneTakeOverAttemptHandler = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    //Make sure details of a lying stone and dragged stone are available
    if (!lyingStone || !draggedStone || !setCanTakeStone) {
      return;
    }

    //Do not do anything if the stone I am dragging is still above itself
    if (lyingStone.id === draggedStone.id) {
      // console.log('Ignoring dragging above the stone which is being moved');
      setCanTakeStone(false);
      return;
    }

    // Prevent takeover if the stone I am dragging is going from the stash
    if (draggedStone.stashed) {
      // console.log('A stone you are dragging from the stash cannot be place on top of another stone');
      return;
    }

    // Is the lying stone an opponents stone?
    //no do not allow dropping
    //yes: continue
    if (lyingStone.currentOwner === draggedStone.currentOwner) {
      // console.log('You cannot take your own stone');
      setCanTakeStone(false);
      return;
    }

    // Can the dragged stone move to the coordinates of the lying stone?
    if (
      !canStoneMoveThisWay({
        stoneType: draggedStone.type,
        movedFromColumnLetter: draggedStone.positionColumnLetter,
        movedFromRowNumber: draggedStone.positionRowNumber,
        movingToLetter: lyingStone.positionColumnLetter,
        movingToNumber: lyingStone.positionRowNumber,
        amIOpponent: !!draggedStone.amIOpponent,
        stashed: draggedStone.stashed,
      })
    ) {
      // console.log('Your stone cannot move to this position');
      setCanTakeStone(false);
      return;
    }
    // console.log('Your stone can take this stone.');
    setCanTakeStone(true);
    return;
    event.preventDefault();
  };

  const onStoneDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    const handicapStone = useHandicapStone;
    const updateStats = updateUserStats;

    setHideStoneStashCount(false);
    if (!lyingStone || !draggedStone || !canTakeStone) {
      return;
    }

    // Set turn to the other player
    updateGame({
      id: gameId!,
      updatedDetails: {
        currentPlayerTurn: nextTurnPlayerId({
          myId: appContext.loggedInUserUserId,
          gameData: gameData,
        }),
      },
    });

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
        movingPlayerId: appContext.loggedInUserUserId,
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
        makeStoneInvisible({
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
        movingPlayerId: appContext.loggedInUserUserId,
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

      //Update dragged stone
      updateStonePosition({
        gameId: gameId!,
        stoneId: draggedStone.id,
        positionColumnLetter: lyingStone.positionColumnLetter,
        positionRowNumber: lyingStone.positionRowNumber,
      });
    }
    // console.log('Cannot drop');
    return;
  };

  return (
    <div
      id={id}
      draggable={
        gameData?.status === "INPROGRESS" &&
        amIStoneOwner({
          currentOwner: currentOwner,
          loggedInUserUserId: appContext.loggedInUserUserId,
        })
      }
      onDragStart={
        isItMyTurn({
          myId: appContext.loggedInUserUserId,
          currentTurnPlayerId: gameData?.currentPlayerTurn,
        })
          ? onDragStartHandler
          : onDragStartHandlerDisallowed
      }
      onDragEnter={onDragEnterHandler}
      onDragOver={onStoneTakeOverAttemptHandler}
      onDragEnd={onStoneDropHandler}
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
      {/*{currentOwner.substr(0, 2)}*/}
      {stashedPillCount > 1 && !hideStoneStashCount ? (
        <StoneStashCount count={stashedPillCount} />
      ) : null}
    </div>
  );
};
