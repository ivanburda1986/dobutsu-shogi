import React, {FunctionComponent} from "react";
import styles from "./RecentMoves.module.css";
import {MoveInterface} from "../../api/firestore";
import {RiSwordFill} from 'react-icons/ri';
import {GiOpenChest} from 'react-icons/gi';
import {evaluateBeingOpponent} from "../SessionService";
import {RecentMoveStone} from "./RecentMoveStone";

interface RecentMovesInterface {
    moves: MoveInterface[];
    creatorId: string;
}

export const RecentMoves: FunctionComponent<RecentMovesInterface> = ({moves = [], creatorId}) => {
    let lastMove: MoveInterface | undefined;
    let lastButOneMove: MoveInterface | undefined;

    if (moves.length > 0) {
        lastMove = moves[moves.length - 1];
    }
    if (moves.length > 1) {
        lastButOneMove = moves[moves.length - 2];
    }


    if (!lastMove) {
        return (<div className={`d-flex justify-content-center align-items-center`}>
            <h6 className="d-none d-sm-inline-block"><strong>Latest move:</strong></h6>
        </div>);
    } else {
        return (
            <div className={`d-flex justify-content-center align-items-center me-2`}>
                <h6 className="d-none d-sm-inline-block me-3"><strong>Latest move:</strong></h6>
                <div className={`${evaluateBeingOpponent(creatorId,
                    lastMove.movingPlayerId
                ) ? styles.OpponentBg : styles.CreatorBg} d-flex justify-content-center align-items-center`}>
                    {
                        lastMove.isTakeOver && <div className="d-flex justify-content-center align-items-center">
                            {(<RecentMoveStone name={lastButOneMove!.type.toLowerCase()}
                            />)}
                            {lastButOneMove?.fromCoordinates}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                      d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                            </svg>
                            {lastButOneMove?.targetCoordinates}
                            {<RiSwordFill/>}
                        </div>
                    }
                    <div className="d-flex justify-content-center align-items-center ms-1">
                        <RecentMoveStone name={lastMove.type.toLowerCase()}
                        />
                        {lastMove.fromCoordinates.length <= 2 ? lastMove.fromCoordinates : <GiOpenChest/>}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                        </svg>
                        {lastMove.targetCoordinates.length <= 2 ? lastMove.targetCoordinates : <GiOpenChest/>}
                    </div>
                </div>
            </div>
        );
    }
};




