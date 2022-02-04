import React from "react";
import { Container } from "react-bootstrap";
import { useGetGames, CreateGameInterface } from "../../api/firestore";
import { WaitingGame } from "./WaitingGame/WaitingGame";

export const WaitingGamesList: React.FC = () => {
  //const [games, setGames] = React.useState<CreateGameInterface>();
  const getGames = useGetGames;
  React.useEffect(() => {
    getGames();
  }, []);
  return (
    <Container>
      <h2>Open Games</h2>
      <Container>{/* <WaitingGame id={} createdOn={} creatorId={} creatorName={} name={} status={} type={} /> */}</Container>
    </Container>
  );
};
