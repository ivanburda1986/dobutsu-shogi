import {FC} from "react";
import {Container, Row} from "react-bootstrap";

import {Game, ReturnedGameInterface} from "../Game/Game";

interface CompletedGamesListInterface {
    games: ReturnedGameInterface[];
}

export const CompletedGamesList: FC<CompletedGamesListInterface> = ({games}) => {
    return (
        <Container>
            <h2 className="text-success">Your Completed Games</h2>
            <Container fluid>
                <Row>
                    {games.map((game) => (
                        <Game key={game.gameId} gameData={game}/>
                    ))}
                </Row>
            </Container>
        </Container>
    );
};
