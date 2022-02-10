import bg from "../../images/bg-clean.png";
import { FC, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { gameType } from "../../api/firestore";
import { getBoardSize } from "./BoardService";
import { BoardRow } from "./BoardRow/BoardRow";
import { Field } from "./Field/Field";
import styles from "./Board.module.css";

interface BoardInterface {
  type: gameType;
}

export const Board: FC<BoardInterface> = ({ type }) => {
  let rowNumbers = getBoardSize({ type }).rowNumbers;
  let columnLetters = getBoardSize({ type }).columnLetters;

  return (
    <Container className={`d-grid justify-content-center ${styles.Board}`}>
      <div style={{ backgroundImage: `url(${bg})` }} className={`${styles.BoardBg}`}>
        {rowNumbers.map((item) => (
          <BoardRow rowNumber={item} columnLetters={columnLetters} />
        ))}
      </div>
    </Container>
  );
};
