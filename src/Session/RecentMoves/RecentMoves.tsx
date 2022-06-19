import React, {FunctionComponent} from "react";
import styles from "./RecentMoves.module.css";
import {MoveInterface} from "../../api/firestore";
import {Avatar} from "../../Header/Avatar/Avatar";
import {RiSwordFill} from 'react-icons/ri';

interface RecentMovesInterface {
    moves: MoveInterface[];
}

export const RecentMoves: FunctionComponent<RecentMovesInterface> = ({moves = []}) => {
    let lastMove: MoveInterface | undefined;
    let lastButOneMove: MoveInterface | undefined;

    if (moves.length > 0) {
        lastMove = moves[moves.length - 1];
    }
    if (moves.length > 1) {
        lastButOneMove = moves[moves.length - 2];
    }


    if (!lastMove) {
        return (<div className={`${styles.RecentMoves}  d-flex justify-content-center align-items-center m`}>
            <h6><strong>Latest move:</strong></h6>
        </div>);
    } else {
        return (
            <div className={`${styles.RecentMoves}  d-flex justify-content-center align-items-center m`}>
                <h6 className="me-3"><strong>Latest move:</strong></h6>
                {lastMove.isTakeOver && (<Avatar name={lastButOneMove!.type.toLowerCase()}
                                                 square={true}/>)}
                {lastMove.isTakeOver && lastButOneMove?.fromCoordinates}
                {lastMove.isTakeOver &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd"
                              d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                    </svg>}
                {lastMove.isTakeOver && lastButOneMove?.targetCoordinates}
                {lastMove.isTakeOver && <RiSwordFill/>}
                <Avatar name={lastMove.type.toLowerCase()}
                        square={true}/>
                {lastMove.fromCoordinates}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                </svg>
                {lastMove.targetCoordinates}


            </div>
        );
    }
};

