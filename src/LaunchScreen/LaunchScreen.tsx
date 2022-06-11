import React from "react";
import {Container} from "react-bootstrap";
import {WaitingGamesList} from "./WaitingGamesList/WaitingGamesList";
import {YourGamesInProgressList} from "./YourGamesInProgressList/YourGamesInProgress";

export const LaunchScreen: React.FC = () => {
    return (
        <Container>
            <WaitingGamesList/>
            <YourGamesInProgressList/>
        </Container>
    );
};
