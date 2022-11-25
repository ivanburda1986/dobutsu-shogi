import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container } from "react-bootstrap";
import { DocumentData } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { AppContextInterface } from "../../App";
import { AppContext } from "../../context/AppContext";
import { BoardRow } from "./BoardRow/BoardRow";
import { PlayerInterface } from "../PlayerInterface/PlayerInterface";
import { Stone, StoneInterface } from "./Stones/Stone";
import { getBackground } from "../../images/imageRelatedService";
import { isThisPlayerOpponent } from "../SessionService";
import { getColumnLetters, getRowNumbers, listenToStonePositionChange } from "./BoardService";
import styles from "./Board.module.css";
import {Field} from "./BoardField/Field";

interface BoardInterface {
    gameData: DocumentData | undefined;
}

export type VictoryType =
    "LION_CAUGHT_SUCCESS"
    | "HOMEBASE_CONQUERED_SUCCESS"
    | "HOMEBASE_CONQUERED_FAILURE"
    | undefined
    | null;

export const Board: FC<BoardInterface> = ({gameData}) => {
    const {gameId} = useParams();
    const {loggedInUserUserId}: AppContextInterface = useContext(AppContext);
    const amIOpponent = isThisPlayerOpponent(gameData?.creatorId, loggedInUserUserId);

    const [stones, setStones] = useState<StoneInterface[]>([]);
    const [draggedStone, setDraggedStone] = useState<StoneInterface | undefined>();
    const [lyingStone, setLyingStone] = useState<StoneInterface | undefined>();
    const [canTakeStone, setCanTakeStone] = useState<boolean>(false);

    useEffect(() => {
        //Listening to change of stone positions
        listenToStonePositionChange({updateState:setStones, gameId:gameId})
    }, [gameId]);

    return (
        <Container id="board" className={`mb-4 ${styles.Board}  ${amIOpponent ? styles.OpponentLayout : styles.CreatorLayout}`}>
            <div
                className={`${styles.Interface1}`}
                style={{transform: `rotate(${amIOpponent ? 180 : 0}deg)`}}>
                <PlayerInterface amIOpponent={amIOpponent} creatorInterface={false} gameData={gameData}/>
            </div>
            <div
                className={`my-3 my-md-0 ${styles.Board}`}>
                <div style={{backgroundImage: `url(${amIOpponent ? getBackground({rotated:true}) : getBackground({rotated:false})})`}}
                     className={`${styles.BoardBg}`}>
                    {getRowNumbers(amIOpponent).map((rowNumber) => {
                        return (
                            getColumnLetters(amIOpponent).map((letter) =>
                                <Field key={uuidv4()}
                                       rowNumber={rowNumber}
                                       columnLetter={letter}
                                       amIOpponent={amIOpponent}
                                       gameData={gameData}
                                       stones={stones}
                                />)


                            // <BoardRow key={uuidv4()} rowNumber={item} columnLetters={getColumnLetters(amIOpponent)}
                            //           amIOpponent={amIOpponent}
                            //           gameData={gameData} stones={stones}
                            // />
                        );
                    })}
                    {stones.map((stone) => (
                        <Stone
                            amIOpponent={amIOpponent}
                            key={stone.id}
                            id={stone.id}
                            type={stone.type}
                            originalOwner={stone.originalOwner}
                            currentOwner={stone.currentOwner}
                            highlighted={stone.highlighted}
                            stashed={stone.stashed}
                            invisible={stone.invisible}
                            positionLetter={stone.positionLetter}
                            positionNumber={stone.positionNumber}
                            rowNumbers={getRowNumbers(amIOpponent)}
                            columnLetters={getColumnLetters(amIOpponent)}
                            draggedStone={draggedStone}
                            lyingStone={lyingStone}
                            setDraggedStone={setDraggedStone}
                            setLyingStone={setLyingStone}
                            canTakeStone={canTakeStone}
                            setCanTakeStone={setCanTakeStone}
                            gameData={gameData}
                            allStones={stones}
                        />
                    ))}
                </div>
            </div>

            <div className={`${styles.Interface2}`}
                 style={{transform: `rotate(${amIOpponent ? 180 : 0}deg)`}}>
                <PlayerInterface amIOpponent={amIOpponent} creatorInterface={true} gameData={gameData}
                />
            </div>
        </Container>

    );
};
