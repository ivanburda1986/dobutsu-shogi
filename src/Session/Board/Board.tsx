import {FC, useContext, useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {Container} from "react-bootstrap";
import {collection, doc, DocumentData, onSnapshot} from "firebase/firestore";
import {db} from "../../api/firestore";
import {v4 as uuidv4} from "uuid";
import bg from "../../images/bg-clean.png";
import bgRotated from "../../images/bg-clean-rotated.png";

import {BoardRow} from "./BoardRow/BoardRow";
import {PlayerInterface} from "../PlayerInterface/PlayerInterface";
import {Stone, StoneInterface} from "./Stones/Stone";
import styles from "./Board.module.css";
import {isLoggedInUserOpponent} from "../SessionService";
import {AppContext} from "../../context/AppContext";


export type VictoryType =
    "LION_CAUGHT_SUCCESS"
    | "HOMEBASE_CONQUERED_SUCCESS"
    | "HOMEBASE_CONQUERED_FAILURE"
    | undefined
    | null;

export const Board: FC<DocumentData | undefined> = (gameData) => {
    const {gameId} = useParams();
    const {loggedInUserUserId} = useContext(AppContext);

    const [stones, setStones] = useState<StoneInterface[]>([]);
    const [rowNumbers, setRowNumbers] = useState<number[]>([1, 2, 3, 4]);
    const [columnLetters, setColumnLetters] = useState<string[]>(["A", "B", "C"]);
    const [draggedStone, setDraggedStone] = useState<StoneInterface | undefined>();
    const [lyingStone, setLyingStone] = useState<StoneInterface | undefined>();
    const [canTakeStone, setCanTakeStone] = useState<boolean>(false);
    const [winner, setWinner] = useState<string>();
    const [victoryType, setVictoryType] = useState<VictoryType>();
    const amIOpponent = isLoggedInUserOpponent(gameData.creator, loggedInUserUserId);
    const isComponentMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isComponentMountedRef.current = false;
        };
    }, []);


    useEffect(() => {
        //Listening to change of stone positions
        const stonesCollectionRef = collection(db, `games/${gameId}/stones`);
        onSnapshot(stonesCollectionRef, (snapshot) => {
            if (isComponentMountedRef.current) {
                let returnedStones: StoneInterface[] = [];
                snapshot.docs.forEach((doc) => {
                    returnedStones.push({...doc.data()} as StoneInterface);
                });
                setTimeout(() => setStones(returnedStones), 100);
            }
        });
        //Listening to change of the game state (victory/defeat)
        const docRef = doc(db, "games", gameId!);
        onSnapshot(docRef, (doc) => {
            // console.log("Updated data");
            setWinner(doc.data()?.winner);
            setVictoryType(doc.data()?.victoryType);
        });

    }, [gameId]);

    useEffect(() => {
        if (amIOpponent === true) {
            setRowNumbers(rowNumbers.reverse());
            setColumnLetters(columnLetters.reverse());
        }
    }, [amIOpponent, columnLetters, rowNumbers]);

    return (
        <Container id="board"
                   className={`mb-4 ${styles.Board}  ${amIOpponent ? styles.OpponentLayout : styles.CreatorLayout}`}>

            <div
                className={`${styles.Interface1}`}
                style={{transform: `rotate(${amIOpponent === true ? 180 : 0}deg)`}}>
                <PlayerInterface amIOpponent={amIOpponent} creatorInterface={false} gameData={gameData}

                />
            </div>
            <div
                className={`my-3 my-md-0 ${styles.Brett}`}>
                <div style={{backgroundImage: `url(${amIOpponent === true ? bgRotated : bg})`}}
                     className={`${styles.BoardBg}`}>
                    {rowNumbers.map((item) => (
                        <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters}
                                  amIOpponent={amIOpponent}
                                  gameData={gameData} stones={stones}
                        />
                    ))}
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
                            rowNumbers={rowNumbers}
                            columnLetters={columnLetters}
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
                 style={{transform: `rotate(${amIOpponent === true ? 180 : 0}deg)`}}>
                <PlayerInterface amIOpponent={amIOpponent} creatorInterface={true} gameData={gameData}
                />
            </div>
        </Container>

    );
};
