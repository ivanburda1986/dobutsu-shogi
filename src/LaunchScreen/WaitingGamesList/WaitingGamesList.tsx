import {FC} from "react";
import {Container, Row} from "react-bootstrap";

import {Game, ReturnedGameInterface} from "../Game/Game";

interface WaitingGamesListInterface {
    games: ReturnedGameInterface[];
}

export const WaitingGamesList: FC<WaitingGamesListInterface> = ({games}) => {
    return (
        <Container className="mb-4">
            <h2 className="text-success">Games waiting for an opponent</h2>
            <Container fluid>
                <Row>
                    {games.map((game) => (
                        <Game key={game.gameId} gameData={game}/>))}
                </Row>
            </Container>
        </Container>
    );
};
