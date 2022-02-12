import { FC, useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { onSnapshot } from "firebase/firestore";
import { gamesCollectionRef, gameType, statusType } from "../../api/firestore";

import { WaitingGame } from "./WaitingGame/WaitingGame";

export interface ReturnedGameInterface {
  id: string;
  createdOn: number;
  creatorId: string;
  creatorName: string;
  name: string;
  status: statusType;
  type: gameType;
  opponentId: string | null;
}

export const WaitingGamesList: FC = () => {
  const [games, setGames] = useState<ReturnedGameInterface[]>([]);
  const isComponentMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onSnapshot(gamesCollectionRef, (snapshot) => {
      if (isComponentMountedRef.current) {
        let games: ReturnedGameInterface[] = [];
        snapshot.docs.forEach((doc) => {
          games.push({ id: doc.id, ...doc.data() } as ReturnedGameInterface);
        });
        setGames(games);
      }
    });
  }, []);

  return (
    <Container>
      <h2>Open Games</h2>
      <Container fluid>
        <Row>
          {games.map((game) => (
            <WaitingGame key={game.id} id={game.id} createdOn={game.createdOn} creatorId={game.creatorId} creatorName={game.creatorName} opponentId={game.opponentId !== null ? game.opponentId : null} name={game.name} status={game.status} type={game.type} />
          ))}
        </Row>
      </Container>
    </Container>
  );
};
