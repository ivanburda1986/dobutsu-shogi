import {FC, useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useCreateGame, gameType, useJoinGame} from "../api/firestore";
import {Button, Container, Form, Row} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";

import {AppContext} from "../context/AppContext";
import {AppContextInterface} from "../App";

export const CreateGame: FC = () => {
    const [newGameNameInput, setNewGameNameInput] = useState<string | undefined>("");
    const [formValid, setFormValid] = useState<boolean>(false);

    const appContext: AppContextInterface = useContext(AppContext);
    const gameNameRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const createGame = useCreateGame;
    const joinGame = useJoinGame;

    const navigateToLaunchScreen = (createdGameId: string) => {
        navigate(`../session/${createdGameId}`, {replace: false});
    };

    const joinGameUponCreation = ({createdGameId, type}: { createdGameId: string, type: gameType }) => {
        joinGame({
            gameId: createdGameId,
            joiningPlayerType: "CREATOR",
            joiningPlayerId: appContext.loggedInUserUserId,
            joiningPlayerName: appContext.loggedInUserDisplayName,
            joiningPlayerPhotoURL: appContext.loggedInUserPhotoURL,
            type: type
        });
    };

    useEffect(() => {
        if (newGameNameInput) {
            return setFormValid(true);
        }
        return setFormValid(false);
    }, [newGameNameInput]);

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
                                placeholder="New game name"
                                onChange={() => {
                                    setNewGameNameInput(gameNameRef.current?.value);
                                }}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            disabled={!formValid}
                            type="button"
                            onClick={() => createGame({
                                gameId: uuidv4(),
                                creatorId: appContext.loggedInUserUserId,
                                creatorName: appContext.loggedInUserDisplayName!,
                                name: gameNameRef.current!.value,
                                type: "DOBUTSU",
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
