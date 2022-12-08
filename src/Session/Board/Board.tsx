import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container } from "react-bootstrap";
import { DocumentData } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { AppContextInterface } from "../../App";
import { AppContext } from "../../context/AppContext";
import { PlayerInterface } from "../PlayerInterface/PlayerInterface";
import { StoneInterface } from "./Stones/Stone";
import { getBackground } from "../../images/imageRelatedService";
import { isThisPlayerOpponent } from "../SessionService";
import {
  getColumnLetters,
  getRowNumbers,
  listenToStonePositionChange,
} from "./BoardService";
import { Field } from "./BoardField/Field";
import styles from "./Board.module.css";

interface BoardInterface {
  gameData: DocumentData | undefined;
}

export const Board: FC<BoardInterface> = ({ gameData }) => {
  const { gameId } = useParams();
  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);
  const amIOpponent = isThisPlayerOpponent(
    gameData?.creatorId,
    loggedInUserUserId
  );

  const [stones, setStones] = useState<StoneInterface[]>([]);
  const [positionColumnLetterGlobal, setPositionColumnLetterGlobal] = useState<
    string | undefined
  >();
  const [positionRowNumberGlobal, setPositionRowNumberGlobal] = useState<
    number | undefined
  >();
  const [canTakeStone, setCanTakeStone] = useState<boolean>(false);

  useEffect(() => {
    listenToStonePositionChange({ updateState: setStones, gameId: gameId });
    return () => {
      console.log("Board cleanup");
    };
  }, [gameId]);

  return (
    <Container
      id="board"
      className={`mb-4 ${styles.Board}  ${
        amIOpponent ? styles.OpponentLayout : styles.CreatorLayout
      }`}
    >
      <div
        className={`${styles.Interface1}`}
        style={{ transform: `rotate(${amIOpponent ? 180 : 0}deg)` }}
      >
        <PlayerInterface
          amIOpponent={amIOpponent}
          creatorInterface={false}
          gameData={gameData}
          stones={stones}
        />
      </div>
      <div className={`my-3 my-md-0 ${styles.Board}`}>
        <div
          style={{
            backgroundImage: `url(${
              amIOpponent
                ? getBackground({ rotated: true })
                : getBackground({ rotated: false })
            })`,
          }}
          className={`${styles.BoardBg}`}
        >
          {getRowNumbers(amIOpponent).map((rowNumber) => {
            return getColumnLetters(amIOpponent).map((letter) => (
              <Field
                key={uuidv4()}
                rowNumber={rowNumber}
                columnLetter={letter}
                gameData={gameData}
                stones={stones}
                setPositionColumnLetterGlobal={setPositionColumnLetterGlobal}
                setPositionRowNumberGlobal={setPositionRowNumberGlobal}
                positionColumnLetterGlobal={positionColumnLetterGlobal}
                positionRowNumberGlobal={positionRowNumberGlobal}
                canTakeStone={canTakeStone}
                setCanTakeStone={setCanTakeStone}
              />
            ));
          })}
        </div>
      </div>

      <div
        className={`${styles.Interface2}`}
        style={{ transform: `rotate(${amIOpponent ? 180 : 0}deg)` }}
      >
        <PlayerInterface
          amIOpponent={amIOpponent}
          creatorInterface={true}
          gameData={gameData}
          stones={stones}
        />
      </div>
    </Container>
  );
};
