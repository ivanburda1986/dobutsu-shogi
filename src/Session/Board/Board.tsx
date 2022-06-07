import bg from "../../images/bg-clean.png";
import bgRotated from "../../images/bg-clean-rotated.png";
import {FC, useContext, useEffect, useRef, useState} from "react";
import {Container, Row} from "react-bootstrap";
import {db, gameType, getSingleGameDetails} from "../../api/firestore";
import {getBoardSize} from "./BoardService";
import {BoardRow} from "./BoardRow/BoardRow";
import {v4 as uuidv4} from "uuid";

import styles from "./Board.module.css";
import {Stone, StoneInterface} from "./Stones/Stone";
import {useParams} from "react-router";
import {collection, doc, DocumentData, onSnapshot} from "firebase/firestore";
import {AppContext} from "../../context/AppContext";
import {ProvidedContextInterface} from "../../App";
import {PlayerInterface} from "../PlayerInterface/PlayerInterface";


interface BoardInterface {
    type: gameType;
    amIOpponent: boolean;
    gameData: DocumentData | undefined;
}

export const Board: FC<BoardInterface> = ({type, amIOpponent, gameData}) => {
    const params = useParams();
    const gameId = params.gameId;
    const appContext: ProvidedContextInterface = useContext(AppContext);
    const [stones, setStones] = useState<StoneInterface[]>([]);
    const [rowNumbers, setRowNumbers] = useState<number[]>(getBoardSize({type}).rowNumbers);
    const [columnLetters, setColumnLetters] = useState<string[]>(getBoardSize({type}).columnLetters);
    const [draggedStone, setDraggedStone] = useState<StoneInterface | undefined>();
    const [lyingStone, setLyingStone] = useState<StoneInterface | undefined>();
    const [canTakeStone, setCanTakeStone] = useState<boolean>(false);
    const [winner, setWinner] = useState<string>();


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
                setStones(returnedStones);
            }
        });
        //Listening to change of the game state (victory/defeat)
        const docRef = doc(db, "games", gameId!);
        onSnapshot(docRef, (doc) => {
            console.log("Updated data");
            setWinner(doc.data()!.winner);
        });

    }, [gameId]);

    useEffect(() => {
        if (amIOpponent === true) {
            setRowNumbers(getBoardSize({type}).rowNumbers.reverse());
            setColumnLetters(getBoardSize({type}).columnLetters.reverse());
        }
    }, [amIOpponent]);

    return (
        <Container fluid className={`d-flex justify-content-center ${styles.Board}`}>

            <div style={{backgroundImage: `url(${amIOpponent === true ? bgRotated : bg})`}}
                 className={`${styles.BoardBg}`}>
                {rowNumbers.map((item) => (
                    <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} amIOpponent={amIOpponent}
                              gameData={gameData}
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
                        stashed={stone.stashed}
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
            <div className="d-flex justify-content-between flex-column align-items-center"
                 style={{transform: `rotate(${amIOpponent === true ? 180 : 0}deg)`}}>
                <PlayerInterface type={type} amIOpponent={amIOpponent} creatorInterface={false} gameData={gameData}
                />
                <PlayerInterface type={type} amIOpponent={amIOpponent} creatorInterface={true} gameData={gameData}
                />
            </div>
        </Container>
    );
};
