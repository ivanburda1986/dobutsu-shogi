import React, {FC, useContext} from "react";
import {useParams} from "react-router";
import {
    useUpdateStonePosition,
    useEmpowerStone,
    useUpdateGame,
    useHighlightStone,
    getSingleUserStats, useUpdateUserStats
} from "../../../api/firestore";
import {
    evaluateStoneMove,
    isLetterLabelVisible,
    isNumberLabelVisible,
    lionConquerAttemptInterface
} from "./FieldService";
import styles from "./Field.module.css";
import {nextTurnPlayerId} from "../Stones/StoneService";
import {ProvidedContextInterface} from "../../../App";
import {AppContext} from "../../../context/AppContext";
import {DocumentData} from "firebase/firestore";
import {StoneInterface} from "../Stones/Stone";
import {update} from "lodash";


interface FieldInterface {
    rowNumber: number;
    columnLetter: string;
    amIOpponent: boolean;
    gameData: DocumentData | undefined;
    stones: StoneInterface[];
}

export const Field: FC<FieldInterface> = ({rowNumber, columnLetter, amIOpponent, gameData, stones}) => {
    const {gameId} = useParams();
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const updateStonePosition = useUpdateStonePosition;
    const empowerStone = useEmpowerStone;
    const highlightStone = useHighlightStone;
    const updateGame = useUpdateGame;

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    const updatedMoves = gameData?.moves;

    const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
        let placedStoneType = event.dataTransfer!.getData("placedStoneType");
        let placedStoneId = event.dataTransfer!.getData("placedStoneId");
        let movedFromLetter = event.dataTransfer!.getData("movedFromLetter");
        let movedFromNumber = event.dataTransfer!.getData("movedFromNumber");
        const updateStats = useUpdateUserStats;

        const callbackFc = (stoneMoveAllowed: boolean, shouldChickenTransformToHen: boolean, lionConquerAttempt: lionConquerAttemptInterface) => {
            // console.log('shouldChickenTransformToHen', shouldChickenTransformToHen);
            if (shouldChickenTransformToHen) {
                // console.log('empowering!');
                empowerStone({gameId: gameId!, stoneId: placedStoneId, type: "HEN"});
            }
            if (stoneMoveAllowed!) {
                // Update stone position
                updateStonePosition({
                    gameId: gameId!,
                    stoneId: placedStoneId,
                    positionLetter: columnLetter,
                    positionNumber: rowNumber,
                });
                // Prepare data for stone move tracking
                updatedMoves.push({
                    moveNumber: updatedMoves.length > 0 ? updatedMoves[updatedMoves.length - 1].moveNumber + 1 : 0,
                    id: placedStoneId,
                    type: placedStoneType,
                    movingPlayerId: appContext.loggedInUserUserId,
                    fromCoordinates: `${movedFromLetter}${movedFromNumber}`,
                    targetCoordinates: `${columnLetter}${rowNumber}`,
                    isTakeOver: false,
                    isVictory: false
                });

                updateGame({
                    id: gameId!,
                    updatedDetails: {
                        moves: updatedMoves
                    }
                });

                //Evaluate whether a lion-move is a homebase-conquer attempt and leads to a game end
                if (lionConquerAttempt.success !== undefined) {
                    const {success, conqueringPlayerId, conqueredPlayerId} = lionConquerAttempt;
                    console.log('success', success);
                    console.log('conqueringPlayerId', conqueringPlayerId);
                    console.log('conqueredPlayerId', conqueredPlayerId);
                    if (success === true) {
                        updateGame({
                            id: gameId!,
                            updatedDetails: {
                                status: "COMPLETED",
                                winner: conqueringPlayerId,
                                victoryType: "HOMEBASE_CONQUERED_SUCCESS"
                            }
                        });
                        getSingleUserStats({userId: conqueredPlayerId!}).then((serverStats) => updateStats({
                            userId: conqueredPlayerId!,
                            updatedDetails: {loss: serverStats.data()?.loss + 1}
                        }));
                        getSingleUserStats({userId: conqueringPlayerId!}).then((serverStats) => updateStats({
                            userId: conqueringPlayerId!,
                            updatedDetails: {win: serverStats.data()?.win + 1}
                        }));
                    } else {
                        lionConquerAttempt.endangeringOpponentStones.forEach((id) => {
                            highlightStone({gameId: gameId!, stoneId: id, highlighted: true});
                        });
                        updateGame({
                            id: gameId!,
                            updatedDetails: {
                                status: "COMPLETED",
                                winner: conqueredPlayerId,
                                victoryType: "HOMEBASE_CONQUERED_FAILURE"
                            }
                        });
                        getSingleUserStats({userId: conqueringPlayerId!}).then((serverStats) => updateStats({
                            userId: conqueringPlayerId!,
                            updatedDetails: {loss: serverStats.data()?.loss + 1}
                        }));
                        getSingleUserStats({userId: conqueredPlayerId!}).then((serverStats) => updateStats({
                            userId: conqueredPlayerId!,
                            updatedDetails: {win: serverStats.data()?.win + 1}
                        }));
                    }

                    // console.log('The stone can move here');
                    console.log('lionConquerAttemptSuccessful', lionConquerAttempt.success);
                }

                // Set turn to the other player
                console.log(updatedMoves);
                updateGame({
                    id: gameId!,
                    updatedDetails: {
                        currentPlayerTurn: nextTurnPlayerId({
                            myId: appContext.loggedInUserUserId,
                            gameData: gameData
                        })
                    }
                });


            } else {
                console.log('The stone cannot move here');
            }
        };

        evaluateStoneMove({
            placedStoneId: placedStoneId,
            gameId: gameId!,
            movedFromLetter,
            movedFromNumber: parseInt(movedFromNumber),
            movingToLetter: columnLetter,
            movingToNumber: rowNumber,
            amIOpponent: amIOpponent,
            stones: stones,
            gameData,
            cb: callbackFc
        });

    };


    return (
        <div
            onDragOver={enableDropping}
            onDrop={onDropHandler}
            style={{transform: `rotate(${amIOpponent === true ? 180 : 0}deg)`}}
            data-number={rowNumber}
            data-letter={columnLetter}
            className={`${styles.Field} noselect`}
        >
            {isLetterLabelVisible({rowNumber, columnLetter}) &&
                <span className={styles.columnLetter}>{columnLetter}</span>}
            {isNumberLabelVisible({rowNumber, columnLetter}) && <span className={styles.rowNumber}>{rowNumber}</span>}
        </div>
    );
};
