import React, { FC, useContext, useEffect, useState } from "react";

import {
  updateGame,
  updateStoneOnTakeOver,
  updateStonePosition,
} from "../../../api/firestore";
import {
  canDraggedStoneMoveToThisPosition,
  canStoneBeDragged,
  getDragStartAction,
  getStashedStonePillCount,
  getStone,
  isDraggedStoneComingFromStash,
  isDraggedStoneHoveringAboveOwnStone,
  isDraggedStoneStillAboveItself,
  rotateOpponentStones,
  setStonePosition,
  shouldHighlightStone,
  shouldMakeStoneInvisible,
  shouldShowStoneStashCountPill,
} from "./StoneService";
import { AppContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";
import { useParams } from "react-router";
import { DocumentData } from "firebase/firestore";
import { StoneStashCountPill } from "./StoneStashCountPill/StoneStashCountPill";
import { getImgReference } from "../../../images/imageRelatedService";
import {
  evaluateLionConquerAttempt,
  highlightLionTakeoverStone,
  isLionGettingTaken,
  makeTakenLionInvisible,
} from "./LionStoneService";

import {
  increaseUserLossStats,
  increaseUserWinStats,
  setGameToComplete,
  switchMoveToOtherPlayer,
} from "../../SessionService";
import { getStashTargetPosition } from "../StashField/StashFieldService";
import {
  isChickenTakingOver,
  isHenGettingTaken,
  shouldChickenTurnIntoHen,
  transformChickenToHen,
  transformHenToChicken,
} from "./ChickenStoneService";
import styles from "./Stone.module.css";

export type stoneType = "CHICKEN" | "ELEPHANT" | "GIRAFFE" | "LION" | "HEN";

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
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>();
  const [screenHeight, setScreenHeight] = useState<number>();
  const [hideStoneStashCountPill, setHideStoneStashCountPill] =
    useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isInvisible, setIsInvisible] = useState<boolean>(false);
  const stashedPillCount = getStashedStonePillCount({
    allStones: allStones ?? [],
    currentOwnerId: currentOwner,
    stashed,
    type,
  });

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
    return () => {
      console.log("Stone cleanup");
    };
  }, [
    id,
    positionColumnLetter,
    positionRowNumber,
    positionX,
    positionY,
    screenHeight,
    screenWidth,
  ]);

  useEffect(() => {
    const stone: StoneInterface[] = getStone(allStones, id);
    shouldHighlightStone(stone) && setIsHighlighted(true);
    shouldMakeStoneInvisible(stone) && setIsInvisible(true);
    return () => {
      console.log("Stone cleanup");
    };
  }, [allStones, id]);

  // Make sure stones are in place even after change of the UI size and appearance of new elements
  function onResizeHandler({
    newHeight,
    newWidth,
  }: {
    newHeight: number;
    newWidth: number;
  }) {
    setScreenHeight(newHeight);
    setScreenWidth(newWidth);
  }

  window.addEventListener("resize", () =>
    onResizeHandler({
      newHeight: window.innerHeight,
      newWidth: window.innerWidth,
    })
  );

  function onDragStartHandler(event: React.DragEvent<HTMLDivElement>) {
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
  }

  function onDragStartHandlerDisallowed(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
  }

  function onDragEnterHandler() {
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
  }

  function onTakeOverAttemptHandler(event: React.DragEvent<HTMLDivElement>) {
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
  }

  function onDropHandler(event: React.DragEvent<HTMLDivElement>) {
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

      if (isLionGettingTaken(lyingStone)) {
        setGameToComplete({
          gameId: gameData?.gameId,
          winner: draggedStone.currentOwner,
          victoryType: "LION_CAUGHT_SUCCESS",
          nextTurnPlayerId: lyingStone.currentOwner,
        });

        updateStonePosition({
          gameId: gameId!,
          stoneId: draggedStone.id,
          targetPositionColumnLetter: lyingStone.positionColumnLetter,
          targetPositionRowNumber: lyingStone.positionRowNumber,
        });

        highlightLionTakeoverStone(gameId, id);
        makeTakenLionInvisible(gameId, lyingStone);
        increaseUserLossStats(lyingStone.originalOwner);
        increaseUserWinStats(draggedStone.currentOwner);

        return;
      }

      evaluateLionConquerAttempt(
        draggedStone,
        amIOpponent,
        lyingStone,
        allStones,
        gameData,
        setGameToComplete
      );

      if (isHenGettingTaken(lyingStone)) {
        transformHenToChicken(gameData!, lyingStone.id);
      }

      switchMoveToOtherPlayer(gameData!, loggedInUserUserId);

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

      if (
        isChickenTakingOver(draggedStone) &&
        shouldChickenTurnIntoHen({
          amIOpponent: amIOpponent!,
          type: draggedStone!.type,
          stashed: draggedStone!.stashed,
          movingToLetter: lyingStone.positionColumnLetter,
          movingToNumber: lyingStone.positionRowNumber,
        })
      ) {
        transformChickenToHen(gameData!, draggedStone.id);
      }

      updateStonePosition({
        gameId: gameId!,
        stoneId: draggedStone.id,
        targetPositionColumnLetter: lyingStone.positionColumnLetter,
        targetPositionRowNumber: lyingStone.positionRowNumber,
      });

      switchMoveToOtherPlayer(gameData!, loggedInUserUserId);
    } else {
      console.log("The stone cannot be dropped here");
    }
  }

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
        transform: `rotate(${rotateOpponentStones({
          currentOwner: currentOwner,
          loggedInUserUserId: loggedInUserUserId,
        })}deg)`,
      }}
      className={`${styles.Stone} ${isHighlighted && styles.Highlighted} ${
        isInvisible && styles.Invisible
      } noselect`}
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
