import bg from "../../images/bg-clean.png";
import bgRotated from "../../images/bg-clean-rotated.png";
import { FC, useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { db, gameType, StoneInterface } from "../../api/firestore";
import { getBoardSize } from "./BoardService";
import { BoardRow } from "./BoardRow/BoardRow";
import { v4 as uuidv4 } from "uuid";

import styles from "./Board.module.css";
import { Stone } from "./Stones/Stone";
import { useParams } from "react-router";
import { collection, onSnapshot } from "firebase/firestore";

interface BoardInterface {
  type: gameType;
}

export const Board: FC<BoardInterface> = ({ type }) => {
  const { gameId } = useParams();
  const [stones, setStones] = useState<StoneInterface[]>([]);
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
  }, []);

  let rowNumbers = getBoardSize({ type }).rowNumbers;
  let columnLetters = getBoardSize({ type }).columnLetters;

  return (
    <Container fluid className={`d-flex justify-content-center ${styles.Board}`}>
      <div style={{ backgroundImage: `url(${bgRotated})` }} className={`${styles.BoardBg}`}>
        {stones.map((stone) => (
          <Stone key={stone.id} id={stone.id} type={stone.type} empowered={stone.empowered} originalOwner={stone.originalOwner} currentOwner={stone.currentOwner} stashed={stone.stashed} positionLetter={stone.positionLetter} positionNumber={stone.positionNumber} />
        ))}
        {rowNumbers.map((item) => (
          <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} />
        ))}
      </div>
    </Container>
  );
};

// transform: `rotate(${rotateByDeg}deg)`
// style={{ transform: `rotate(${180}deg)` }}
