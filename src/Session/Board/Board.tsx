import bg from "../../images/bg-clean.png";

import bgRotated from "../../images/bg-clean-rotated.png";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { db, gameType, getSingleGameDetails, StoneInterface } from "../../api/firestore";
import { getBoardSize, shouldRotateOpponentUI } from "./BoardService";
import { BoardRow } from "./BoardRow/BoardRow";
import { v4 as uuidv4 } from "uuid";

import styles from "./Board.module.css";
import { Stone } from "./Stones/Stone";
import { useParams } from "react-router";
import { collection, onSnapshot } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import { ProvidedContextInterface } from "../../App";

interface BoardInterface {
  type: gameType;
}

export const Board: FC<BoardInterface> = ({ type }) => {
  const params = useParams();
  const [gameId, setGameId] = useState(params.gameId);
  const appContext: ProvidedContextInterface = useContext(AppContext);
  const [stones, setStones] = useState<StoneInterface[]>([]);
  const [rowNumbers, setRowNumbers] = useState(getBoardSize({ type }).rowNumbers);
  const [columnLetters, setColumnLetters] = useState(getBoardSize({ type }).columnLetters);
  const [amIOpponent, setAmIOpponent] = useState(false);

  useEffect(() => {
    setGameId(params.gameId);
    getSingleGameDetails({ gameId: gameId! }).then((doc) => {
      let data = doc.data();
      if (shouldRotateOpponentUI({ creatorId: data!.creatorId, loggedInUserUserId: appContext.loggedInUserUserId })) {
        setAmIOpponent(true);
        setRowNumbers(getBoardSize({ type }).rowNumbers.reverse());
        setColumnLetters(getBoardSize({ type }).columnLetters.reverse());
      }
    });
  }, [gameId]);

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

  return (
    <Container fluid className={`d-flex justify-content-center ${styles.Board}`}>
      <div style={{ backgroundImage: `url(${amIOpponent ? bgRotated : bg})` }} className={`${styles.BoardBg}`}>
        {stones.map((stone) => (
          <Stone key={stone.id} id={stone.id} type={stone.type} empowered={stone.empowered} originalOwner={stone.originalOwner} currentOwner={stone.currentOwner} stashed={stone.stashed} positionLetter={stone.positionLetter} positionNumber={stone.positionNumber} />
        ))}
        {rowNumbers.map((item) => (
          <BoardRow key={uuidv4()} rowNumber={item} columnLetters={columnLetters} amIOpponent={amIOpponent} />
        ))}
      </div>
    </Container>
  );
};

// transform: `rotate(${rotateByDeg}deg)`
// style={{ transform: `rotate(${180}deg)` }}
