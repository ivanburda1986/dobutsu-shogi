import {FC} from "react";
import {Container, Row} from "react-bootstrap";

import {Game, ReturnedGameInterface} from "../Game/Game";

interface GamesInProgressListInterface {
    games: ReturnedGameInterface[];
}

export const GamesInProgressList: FC<GamesInProgressListInterface> = ({games}) => {
    return (
        <Container>
            <h2 className="text-success">Your Games In Progress</h2>
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
