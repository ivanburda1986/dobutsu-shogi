import {FC} from "react";
import {Container, Row} from "react-bootstrap";
import {gameType, statusType} from "../../api/firestore";

import {Game} from "../Game/Game";

export interface ReturnedGameInterface {
    gameId: string;
    createdOn: number;
    creatorId: string;
    creatorName: string;
    opponentName: string;
    creatorPhotoURL: string;
    opponentPhotoURL: string;
    currentPlayerTurn: string;
    name: string;
    status: statusType;
    type: gameType;
    opponentId: string | null;
}

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
                              status={game.status} type={game.type} creatorPhotoURL={game.creatorPhotoURL}
                              opponentPhotoURL={game.opponentPhotoURL} currentPlayerTurn={game.currentPlayerTurn}/>
                    ))}
                </Row>
            </Container>
        </Container>
    );
};
