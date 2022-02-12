import bg from "../../images/bg-clean.png";
import { FC, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { gameType, StoneInterface } from "../../api/firestore";
import { getBoardSize, getStones } from "./BoardService";
import { BoardRow } from "./BoardRow/BoardRow";
import { v4 as uuidv4 } from "uuid";

import styles from "./Board.module.css";
import { Stone } from "./Stones/Stone";

interface BoardInterface {
  type: gameType;
}

export const Board: FC<BoardInterface> = ({ type }) => {
  const [stones, setStones] = useState<StoneInterface[]>([]);

  useEffect(() => {
    setStones(getStones({ creatorId: "player1", opponentId: "player2", type: "DOBUTSU" }));
  }, []);

  let rowNumbers = getBoardSize({ type }).rowNumbers;
  let columnLetters = getBoardSize({ type }).columnLetters;

  return (
    <Container className={`d-grid justify-content-center ${styles.Board}`}>
      <div style={{ backgroundImage: `url(${bg})` }} className={`${styles.BoardBg}`}>
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
