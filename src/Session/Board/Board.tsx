import bg from "../../images/bg-clean.png";

import bgRotated from "../../images/bg-clean-rotated.png";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { db, gameType, getSingleGameDetails, StoneInterface } from "../../api/firestore";
import { getBoardSize } from "./BoardService";
import { BoardRow } from "./BoardRow/BoardRow";
import { v4 as uuidv4 } from "uuid";

import styles from "./Board.module.css";
import { Stone } from "./Stones/Stone";
import { useParams } from "react-router";
import { collection, onSnapshot } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import { ProvidedContextInterface } from "../../App";
import { PlayerInterface } from "../PlayerInterface/PlayerInterface";

interface BoardInterface {
  type: gameType;
  amIOpponent: boolean;
}

export const Board: FC<BoardInterface> = ({ type, amIOpponent }) => {
  const params = useParams();
  const gameId = params.gameId;
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [stones, setStones] = useState<StoneInterface[]>([]);
  const [rowNumbers, setRowNumbers] = useState<number[]>(getBoardSize({ type }).rowNumbers);
  const [columnLetters, setColumnLetters] = useState<string[]>(getBoardSize({ type }).columnLetters);

  const isComponentMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const stonesCollectionRef = collection(db, `games/${gameId}/stones`);
    onSnapshot(stonesCollectionRef, (snapshot) => {
      if (isComponentMountedRef.current) {
        let returnedStones: StoneInterface[] = [];
        snapshot.docs.forEach((doc) => {
          returnedStones.push({ ...doc.data() } as StoneInterface);
        });
        setStones(returnedStones);
      }
    });
  }, [gameId]);

  useEffect(() => {
    if (amIOpponent === true) {
      setRowNumbers(getBoardSize({ type }).rowNumbers.reverse());
      setColumnLetters(getBoardSize({ type }).columnLetters.reverse());
    }
  }, [amIOpponent]);

  return (
    <Container fluid className={`d-flex justify-content-center ${styles.Board}`}>
      <div style={{ backgroundImage: `url(${amIOpponent === true ? bgRotated : bg})` }} className={`${styles.BoardBg}`}>
        {rowNumbers.map((item) => (
          <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} amIOpponent={amIOpponent} />
        ))}
        {stones.map((stone) => (
          <Stone
            key={stone.id}
            id={stone.id}
            type={stone.type}
            empowered={stone.empowered}
            originalOwner={stone.originalOwner}
            currentOwner={stone.currentOwner}
            stashed={stone.stashed}
            positionLetter={stone.positionLetter}
            positionNumber={stone.positionNumber}
            rowNumbers={rowNumbers}
            columnLetters={columnLetters}
          />
        ))}
      </div>
      <div className="d-flex justify-content-between flex-column align-items-center">
        <PlayerInterface type={type} amIOpponent={amIOpponent} />
        <PlayerInterface type={type} amIOpponent={amIOpponent} />
      </div>
    </Container>
  );
};

// transform: `rotate(${rotateByDeg}deg)`
// style={{ transform: `rotate(${180}deg)` }}
