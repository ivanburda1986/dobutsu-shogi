import {FC} from "react";
import {Container, Row} from "react-bootstrap";

import {Game, ReturnedGameInterface} from "../Game/Game";

interface WaitingGamesListInterface {
    games: ReturnedGameInterface[];
}

export const WaitingGamesList: FC<WaitingGamesListInterface> = ({games}) => {
    return (
        <Container className="mb-4">
            {games.length > 0 && <h2 className="text-success">Games waiting for an opponent</h2>}
            <Container fluid>
                <Row>
                    {games.map((game) => (
                        <Game key={game.gameId} gameId={game.gameId} createdOn={game.createdOn}
                              creatorId={game.creatorId}
                              creatorName={game.creatorName} opponentName={game.opponentName}
                              opponentId={game.opponentId !== null ? game.opponentId : null} name={game.name}
                              status={game.status} creatorPhotoURL={game.creatorPhotoURL}
                              opponentPhotoURL={game.opponentPhotoURL} currentPlayerTurn={game.currentPlayerTurn}
                              creatorJoined/>
                    ))}
                </Row>
            </Container>
        </Container>
    );
};
