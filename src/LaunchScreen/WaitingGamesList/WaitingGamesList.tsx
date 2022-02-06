import { DocumentData, onSnapshot } from "firebase/firestore";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { gamesCollectionRef } from "../../api/firestore";

import { WaitingGame } from "./WaitingGame/WaitingGame";

export interface ReturnedGameInterface extends DocumentData {
  id: string;
}

export const WaitingGamesList: React.FC = () => {
  const [games, setGames] = React.useState<ReturnedGameInterface[]>([]);
  React.useEffect(() => {
    onSnapshot(gamesCollectionRef, (snapshot) => {
      let games: ReturnedGameInterface[] = [];
      snapshot.docs.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() });
      });

      setGames(games);
    });
  }, []);
  return (
    <Container>
      <h2>Open Games</h2>
      <Container fluid>
        <Row>
          {games.map((game) => (
            <WaitingGame key={game.id} id={game.id} createdOn={game.createdOn} creatorId={game.creatorId} creatorName={game.creatorName} name={game.name} status={game.status} type={game.type} />
          ))}
        </Row>
      </Container>
    </Container>
  );
};
