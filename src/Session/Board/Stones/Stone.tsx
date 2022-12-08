import React, { FC, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveDraggedStone,
  selectDraggedStone,
} from "../../../DraggedStoneSlice";
import { saveLyingStone, selectLyingStone } from "../../../LyingStoneSlice";
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
  isDraggedStoneComingFromStash,
  isDraggedStoneHoveringAboveOwnStone,
  isDraggedStoneStillAboveItself,
  rotateOpponentStones,
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
  gameData?: DocumentData | undefined;
  highlighted: boolean;
  id: string;
  invisible: boolean;
  originalOwner: string;
  setPositionColumnLetterGlobal?: Function;
  setPositionRowNumberGlobal?: Function;
  positionColumnLetter: string;
  positionRowNumber: number;
  rowNumbers?: number[];
  setCanTakeStone?: Function;
  stashed: boolean;
  type: stoneType;
}

export const Stone: FC<StoneInterface> = ({
  allStones,
  amIOpponent,
  currentOwner,
  columnLetters,
  canTakeStone,
  gameData,
  id,
  originalOwner,
  setPositionColumnLetterGlobal,
  setPositionRowNumberGlobal,
  positionColumnLetter,
  positionRowNumber,
  rowNumbers,
  setCanTakeStone,
  stashed,
  type,
  invisible,
  highlighted,
}) => {
  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const [hideStoneStashCountPill, setHideStoneStashCountPill] =
    useState<boolean>(false);
  const stashedPillCount = getStashedStonePillCount({
    allStones: allStones ?? [],
    currentOwnerId: currentOwner,
    stashed,
    type,
  });
  const draggedStoneFromRedux = useSelector(selectDraggedStone);
  const lyingStoneFromRedux = useSelector(selectLyingStone);

  function onDragStartHandler(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("placedStoneId", id);
    event.dataTransfer.setData("placedStoneType", type);
    event.dataTransfer.setData("movedFromColumnLetter", positionColumnLetter);
    event.dataTransfer.setData("movedFromRowNumber", String(positionRowNumber));

    dispatch(
      saveDraggedStone({
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
        allStones,
        highlighted,
        invisible,
      })
    );
    setHideStoneStashCountPill(true);
  }

  function onDragStartHandlerDisallowed(
    event: React.DragEvent<HTMLDivElement>
  ) {
    console.log("Prevent default from Stone: onDragStartHandlerDisallowed");
    event.preventDefault();
  }

  function onDragEnterHandler() {
    if (setPositionColumnLetterGlobal && setPositionRowNumberGlobal) {
      setPositionColumnLetterGlobal(positionColumnLetter);
      setPositionRowNumberGlobal(positionRowNumber);
      dispatch(
        saveLyingStone({
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
          invisible,
          highlighted,
        })
      );
    }
  }

  function onTakeOverAttemptHandler() {
    if (
      !lyingStoneFromRedux.lyingStone ||
      !draggedStoneFromRedux.draggedStone ||
      !setCanTakeStone
    ) {
      return;
    }

    if (
      isDraggedStoneStillAboveItself(
        lyingStoneFromRedux.lyingStone,
        draggedStoneFromRedux.draggedStone
      )
    ) {
      setCanTakeStone(false);
      return;
    }

    if (isDraggedStoneComingFromStash(draggedStoneFromRedux.draggedStone)) {
      setCanTakeStone(false);
      return;
    }

    if (
      isDraggedStoneHoveringAboveOwnStone(
        lyingStoneFromRedux.lyingStone,
        draggedStoneFromRedux.draggedStone
      )
    ) {
      setCanTakeStone(false);
      return;
    }

    if (
      !canDraggedStoneMoveToThisPosition({
        stoneType: draggedStoneFromRedux.draggedStone.type,
        movedFromColumnLetter:
          draggedStoneFromRedux.draggedStone.positionColumnLetter,
        movedFromRowNumber:
          draggedStoneFromRedux.draggedStone.positionRowNumber,
        movingToLetter: lyingStoneFromRedux.lyingStone.positionColumnLetter,
        movingToNumber: lyingStoneFromRedux.lyingStone.positionRowNumber,
        amIOpponent: !!draggedStoneFromRedux.draggedStone.amIOpponent,
        stashed: draggedStoneFromRedux.draggedStone.stashed,
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

    if (
      !lyingStoneFromRedux.lyingStone ||
      !draggedStoneFromRedux.draggedStone ||
      !canTakeStone
    ) {
      return;
    }

    if (canTakeStone) {
      // Prepare data for stone move tracking
      let updatedMoves = gameData?.moves;
      let draggedStoneCoordinates = `${draggedStoneFromRedux.draggedStone.positionColumnLetter}${draggedStoneFromRedux.draggedStone.positionRowNumber}`;
      let targetStoneCoordinates = `${lyingStoneFromRedux.lyingStone.positionColumnLetter}${lyingStoneFromRedux.lyingStone.positionRowNumber}`;
      updatedMoves.push({
        moveNumber:
          updatedMoves.length > 0
            ? updatedMoves[updatedMoves.length - 1].moveNumber + 1
            : 0,
        id: draggedStoneFromRedux.draggedStone.id,
        type: draggedStoneFromRedux.draggedStone.type,
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

      if (isLionGettingTaken(lyingStoneFromRedux.lyingStone)) {
        setGameToComplete({
          gameId: gameData?.gameId,
          winner: draggedStoneFromRedux.draggedStone.currentOwner,
          victoryType: "LION_CAUGHT_SUCCESS",
          nextTurnPlayerId: lyingStoneFromRedux.lyingStone.currentOwner,
        });

        updateStonePosition({
          gameId: gameId!,
          stoneId: draggedStoneFromRedux.draggedStone.id,
          targetPositionColumnLetter:
            lyingStoneFromRedux.lyingStone.positionColumnLetter,
          targetPositionRowNumber:
            lyingStoneFromRedux.lyingStone.positionRowNumber,
        });

        highlightLionTakeoverStone(
          gameId,
          draggedStoneFromRedux.draggedStone.id
        );
        makeTakenLionInvisible(gameId, lyingStoneFromRedux.lyingStone);
        increaseUserLossStats(lyingStoneFromRedux.lyingStone.originalOwner);
        increaseUserWinStats(draggedStoneFromRedux.draggedStone.currentOwner);

        return;
      }

      evaluateLionConquerAttempt(
        draggedStoneFromRedux.draggedStone,
        amIOpponent,
        lyingStoneFromRedux.lyingStone,
        allStones,
        gameData,
        setGameToComplete
      );

      if (isHenGettingTaken(lyingStoneFromRedux.lyingStone)) {
        transformHenToChicken(gameData!, lyingStoneFromRedux.lyingStone.id);
      }

      switchMoveToOtherPlayer(gameData!, loggedInUserUserId);

      updateStoneOnTakeOver({
        gameId: gameId!,
        stone: {
          id: lyingStoneFromRedux.lyingStone.id,
          currentOwner: draggedStoneFromRedux.draggedStone.currentOwner,
          stashed: true,
          positionColumnLetter: getStashTargetPosition({
            type: lyingStoneFromRedux.lyingStone.type,
            amIOpponent: amIOpponent!,
          }),
          positionRowNumber: 1,
        },
      });

      // Prepare data for stone move tracking
      updatedMoves = gameData?.moves;
      draggedStoneCoordinates = `${lyingStoneFromRedux.lyingStone.positionColumnLetter}${lyingStoneFromRedux.lyingStone.positionRowNumber}`;
      targetStoneCoordinates = `${getStashTargetPosition({
        type: lyingStoneFromRedux.lyingStone.type,
        amIOpponent: amIOpponent!,
      })}${lyingStoneFromRedux.lyingStone.positionRowNumber}`;
      updatedMoves.push({
        moveNumber:
          updatedMoves.length > 0
            ? updatedMoves[updatedMoves.length - 1].moveNumber + 1
            : 0,
        id: lyingStoneFromRedux.lyingStone.id,
        type: lyingStoneFromRedux.lyingStone.type,
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
        isChickenTakingOver(draggedStoneFromRedux.draggedStone) &&
        shouldChickenTurnIntoHen({
          amIOpponent: amIOpponent!,
          type: draggedStoneFromRedux.draggedStone!.type,
          stashed: draggedStoneFromRedux.draggedStone!.stashed,
          movingToLetter: lyingStoneFromRedux.lyingStone.positionColumnLetter,
          movingToNumber: lyingStoneFromRedux.lyingStone.positionRowNumber,
        })
      ) {
        transformChickenToHen(gameData!, draggedStoneFromRedux.draggedStone.id);
      }

      updateStonePosition({
        gameId: gameId!,
        stoneId: draggedStoneFromRedux.draggedStone.id,
        targetPositionColumnLetter:
          lyingStoneFromRedux.lyingStone.positionColumnLetter,
        targetPositionRowNumber:
          lyingStoneFromRedux.lyingStone.positionRowNumber,
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
        loggedInUserUserId,
        id
      )}
      onDragStart={getDragStartAction(
        loggedInUserUserId,
        gameData?.currentPlayerTurn,
        onDragStartHandler,
        onDragStartHandlerDisallowed
      )}
      onDragEnter={onDragEnterHandler}
      onDragOver={onTakeOverAttemptHandler}
      onDrop={onDropHandler}
      style={{
        backgroundImage: `url(${getImgReference(type)})`,
        transform: `rotate(${rotateOpponentStones({
          currentOwner: currentOwner,
          loggedInUserUserId: loggedInUserUserId,
          amIOpponent,
          stashed,
        })}deg)`,
      }}
      className={`${styles.Stone} ${highlighted && styles.Highlighted} ${
        invisible && styles.Invisible
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
