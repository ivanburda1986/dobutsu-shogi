import React, { useContext, useRef } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Game, gameType } from "./newGameClass";
import { AppContext } from "../context/AppContext";
import { useCreateGame, CreateGameInterface } from "../api/firestore";
import styles from "./CreateGame.module.css";
import { useNavigate } from "react-router";

export const CreateGame: React.FC = () => {
  const gameNameRef = useRef<HTMLInputElement>(null);
  const [gameNameInput, setGameNameInput] = React.useState<string>("");
  const [gameType, setGameType] = React.useState<gameType>("DOBUTSU");

  const appContext = useContext(AppContext);
  const createGame = useCreateGame;
  const navigate = useNavigate();

  const navigateToLaunchScreen = () => {
    navigate("../", { replace: false });
  };

  let game: CreateGameInterface;

  return (
    <Container>
      <h2>Create Game</h2>
      <Container fluid className={`rounded py-1 my-1 ${styles.transparentContainer}`}>
        <Row>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Game name</Form.Label>
              <Form.Control
                type="text"
                ref={gameNameRef}
                value={gameNameInput}
                placeholder="Give your game a name"
                onChange={() => {
                  setGameNameInput(gameNameRef.current!.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAvatarSelection">
              <Form.Label>Game type</Form.Label>
              {["radio"].map(() => (
                <div key={`inline-radio`} className="mb-3">
                  <Form.Check inline label="Dobutsu shogi" name="group1" type="radio" id="DOBUTSU" onChange={(e) => setGameType(e.target.id as gameType)} />
                  <Form.Check inline label="Goro Goro" name="group1" type="radio" id="GOROGORO" onChange={(e) => setGameType(e.target.id as gameType)} />
                  <Form.Check inline label="Shogi" name="group1" type="radio" id="SHOGI" onChange={(e) => setGameType(e.target.id as gameType)} />
                </div>
              ))}
            </Form.Group>

            <Button variant="primary" type="button" onClick={() => createGame({ creatorId: appContext.loggedInUserUserId, creatorName: appContext.loggedInUserUsername, name: gameNameRef.current!.value, type: gameType, createGameCb: { redirect: navigateToLaunchScreen } })}>
              Create
            </Button>
          </Form>
        </Row>
      </Container>
    </Container>
  );
};
