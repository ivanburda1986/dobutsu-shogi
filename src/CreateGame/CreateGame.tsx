import React, { useContext, useRef } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";

import { AppContext } from "../context/AppContext";
import { ProvidedContextInterface } from "../App";
import { useCreateGame, gameType } from "../api/firestore";

export const CreateGame: React.FC = () => {
  const [newGameNameInput, setNewGameNameInput] = React.useState<string | undefined>("");
  const [newGameType, setNewGameType] = React.useState<gameType>("DOBUTSU");
  const [formValid, setFormValid] = React.useState<boolean>(false);

  const appContext: ProvidedContextInterface = useContext(AppContext);
  const gameNameRef = useRef<HTMLInputElement>(null);
  const createGame = useCreateGame;
  const navigate = useNavigate();

  const navigateToLaunchScreen = () => {
    navigate("../", { replace: false });
  };

  React.useEffect(() => {
    if (newGameNameInput && newGameType) {
      return setFormValid(true);
    }
    return setFormValid(false);
  }, [newGameNameInput, newGameType]);

  return (
    <Container>
      <h2>Create Game</h2>
      <Container fluid className={`py-3 my-1 border-rounded-lightblue transparentContainer`}>
        <Row>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>
                <h4>Game name</h4>
              </Form.Label>
              <Form.Control
                type="text"
                ref={gameNameRef}
                value={newGameNameInput}
                placeholder="Give your game a name"
                onChange={() => {
                  setNewGameNameInput(gameNameRef.current!.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAvatarSelection">
              <Form.Label>
                <h4>Game type</h4>
              </Form.Label>
              {["radio"].map(() => (
                <div key={`inline-radio`} className="mb-3">
                  <Form.Check inline defaultChecked label="Dobutsu Shogi" name="group1" type="radio" id="DOBUTSU" onChange={(e) => setNewGameType(e.target.id as gameType)} />
                  <Form.Check inline label="Goro Goro Dobutsu Shogi" name="group1" type="radio" id="GOROGORO" onChange={(e) => setNewGameType(e.target.id as gameType)} />
                  <Form.Check inline label="Dobutsu Shogi in the Green Wood" name="group1" type="radio" id="GREENWOOD" onChange={(e) => setNewGameType(e.target.id as gameType)} />
                </div>
              ))}
            </Form.Group>

            <Button
              variant="primary"
              disabled={!formValid}
              type="button"
              onClick={() => createGame({ creatorId: appContext.loggedInUserUserId, creatorName: appContext.loggedInUserDisplayName!, name: gameNameRef.current!.value, type: newGameType, createGameCb: { redirect: navigateToLaunchScreen } })}
            >
              Create Game
            </Button>
          </Form>
        </Row>
      </Container>
    </Container>
  );
};
