import {FC, useContext, useEffect, useRef, useState} from "react";
import {Container, Row} from "react-bootstrap";
import {onSnapshot} from "firebase/firestore";
import {gamesCollectionRef, gameType, statusType} from "../../api/firestore";

import {Game} from "../Game/Game";
import {ReturnedGameInterface} from "../WaitingGamesList/WaitingGamesList";
import {ProvidedContextInterface} from "../../App";
import {AppContext} from "../../context/AppContext";


export const YourGamesInProgressList: FC = () => {
    const appContext: ProvidedContextInterface = useContext(AppContext);
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
                    games.push({id: doc.id, ...doc.data()} as ReturnedGameInterface);
                });
                setGames(games.filter((game) => game.status === "INPROGRESS" && (game.creatorId === appContext.loggedInUserUserId || game.opponentId === appContext.loggedInUserUserId)));
            }
        });
    }, [appContext]);

    return (
        <Container>
            {games.length > 0 && <h2>Your Games In Progress</h2>}
            <Container fluid>
                <Row>
                    {games.map((game) => (
                        <Game key={game.id} id={game.id} createdOn={game.createdOn} creatorId={game.creatorId}
                              creatorName={game.creatorName} opponentName={game.opponentName}
                              opponentId={game.opponentId !== null ? game.opponentId : null} name={game.name}
                              status={game.status} type={game.type}/>
                    ))}
                </Row>
            </Container>
        </Container>
    );
};
