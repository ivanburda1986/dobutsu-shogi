import React, {FC, useContext, useState} from "react";
import {AppContextInterface} from "../../App";
import {AppContext} from "../../context/AppContext";
import {Avatar} from "../../Avatar/Avatar";
import styles from "./PlayerInterface.module.css";
import {getStashSize, isOnTurn, whatNameToDisplay} from "./PlayerInterfaceService";
import {v4 as uuidv4} from "uuid";
import {DocumentData} from "firebase/firestore";
import {StashRow} from "../Board/StashRow/StashRow";

interface PlayerInterfaceInterface {
    amIOpponent: boolean;
    creatorInterface: boolean;
    gameData: DocumentData | undefined;
}

export const PlayerInterface: FC<PlayerInterfaceInterface> = ({

                                                                  amIOpponent,
                                                                  creatorInterface,
                                                                  gameData
                                                              }) => {
    const appContext: AppContextInterface = useContext(AppContext);
    const [rowNumbers, setRowNumbers] = useState<number[]>(getStashSize(creatorInterface).rowNumbers);
    const [columnLetters, setColumnLetters] = useState<string[]>(getStashSize(creatorInterface).columnLetters);

    return (
        <div
            className={`${styles.PlayerInterface} ${isOnTurn({
                creatorInterface,
                gameData
            }) ? styles.PlayerInterfaceCurrentTurn : styles.PlayerInterfaceNotOnTurn}  mx-3 my-1`}
            style={{transform: `rotate(${creatorInterface === true ? 0 : 180}deg)`}}>
            <div
                className={`${creatorInterface ? styles.CreatorHeader : styles.OpponentHeader} d-flex justify-content-between align-items-center rounded ps-1 pe-3 mb-1 p-1`}>
                <Avatar
                    name={creatorInterface ? gameData?.creatorPhotoURL : gameData?.opponentPhotoURL}/>
                <span className={`${styles.PlayerName} text-primary`}>{whatNameToDisplay({
                    creatorInterface,
                    gameData
                })}</span>
            </div>
            <div>
                {rowNumbers.map((item) => (
                    <StashRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} amIOpponent={amIOpponent}/>
                ))}
            </div>
        </div>
    );
};
