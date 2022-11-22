import React, {FC} from "react";
import {DocumentData} from "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {Avatar} from "../../Avatar/Avatar";
import {
    getInterfaceAvatarImageName,
    getInterfaceHeaderColour,
    getInterfacePlayerName,
    getInterfaceRotation,
    getInterfaceTurnBasedBorderStyle
} from "./PlayerInterfaceService";
import {StashRow} from "../Board/StashRow/StashRow";
import styles from "./PlayerInterface.module.css";

interface PlayerInterfaceProps {
    amIOpponent: boolean;
    creatorInterface: boolean;
    gameData: DocumentData | undefined;
}

export const PlayerInterface: FC<PlayerInterfaceProps> = ({
                                                                  amIOpponent,
                                                                  creatorInterface,
                                                                  gameData
                                                              }) => {
    return (
        <div
            className={`${getInterfaceTurnBasedBorderStyle(creatorInterface,gameData)} mx-3 my-1`}
            style={{transform: getInterfaceRotation(creatorInterface)}}>
            <div
                className={`${getInterfaceHeaderColour(creatorInterface)} d-flex justify-content-between align-items-center rounded ps-1 pe-3 mb-1 p-1`}>
                <Avatar
                    name={getInterfaceAvatarImageName(creatorInterface, gameData)}
                    playerInterface/>
                <span className={`${styles.PlayerName} text-primary`}>{getInterfacePlayerName(creatorInterface, gameData)}</span>
            </div>
            <div>
                <StashRow key={uuidv4()} creatorInterface={creatorInterface} amIOpponent={amIOpponent}/>
            </div>
        </div>
    );
};
