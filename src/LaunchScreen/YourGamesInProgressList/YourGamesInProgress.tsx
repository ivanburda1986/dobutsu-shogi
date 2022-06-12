import {FC} from "react";
import {Container, Row} from "react-bootstrap";

import {Game} from "../Game/Game";
import {ReturnedGameInterface} from "../WaitingGamesList/WaitingGamesList";


interface YourGamesInProgressListInterface {
    games: ReturnedGameInterface[];
}

export const YourGamesInProgressList: FC<YourGamesInProgressListInterface> = ({games}) => {


    return (
        <Container>
            {games.length > 0 && <h2>Your Games In Progress</h2>}
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
