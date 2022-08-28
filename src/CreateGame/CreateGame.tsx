import {FC, useContext, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useCreateGame, joinGame} from "../api/firestore";
import {Button, Container, Form, Row} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";

import {AppContext} from "../context/AppContext";
import {AppContextInterface} from "../App";

export const CreateGame: FC = () => {
    const navigate = useNavigate();
    const createGame = useCreateGame;

    const {
        loggedInUserUserId,
        loggedInUserDisplayName,
        loggedInUserPhotoURL
    }: AppContextInterface = useContext(AppContext);

    const gameNameRef = useRef<HTMLInputElement>(null);
    const [newGameNameInput, setNewGameNameInput] = useState<string | undefined>("");

    const navigateToLaunchScreen = (createdGameId: string) => {
        navigate(`../session/${createdGameId}`, {replace: false});
    };

    const joinGameUponCreation = (createdGameId: string) => {
        joinGame({
            gameId: createdGameId,
            joiningPlayerType: "CREATOR",
            joiningPlayerId: loggedInUserUserId,
            joiningPlayerName: loggedInUserDisplayName,
            joiningPlayerPhotoURL: loggedInUserPhotoURL,
        });
    };

    return (
        <Container className="text-success">
            <h2>Create Game</h2>
            <Container fluid className={`py-3 my-1 border-rounded-lightblue transparentContainer`}>
                <Row>
                    <Form>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>
                                <h4>New game name</h4>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                ref={gameNameRef}
                                value={newGameNameInput}
                                placeholder="My new game"
                                autoComplete="off"
                                onChange={() => {
                                    setNewGameNameInput(gameNameRef.current?.value);
                                }}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            disabled={!newGameNameInput}
                            type="button"
                            onClick={() => createGame({
                                gameId: uuidv4(),
                                creatorId: loggedInUserUserId,
                                creatorName: loggedInUserDisplayName ?? "Username",
                                name: gameNameRef.current?.value ?? "My new game",
                                createGameCb: {join: joinGameUponCreation, redirect: navigateToLaunchScreen}
                            })}
                        >
                            Create Game
                        </Button>
                    </Form>
                </Row>
            </Container>
        </Container>
    );
};
