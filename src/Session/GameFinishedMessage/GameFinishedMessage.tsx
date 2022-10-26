import {FunctionComponent} from "react";
import {evaluateGameResult, GameFinishedMessageType, getMessageContent} from "./GameFinishedMessageService";

export interface GameFinishedMessageInterface {
    messageType: GameFinishedMessageType;
}

export const GameFinishedMessage: FunctionComponent<GameFinishedMessageInterface> = ({messageType}) => {
    const gameResult = evaluateGameResult(messageType);

    if (gameResult === 'VICTORY') {
        return (
            <div className="alert alert-success" role="alert">
                <h3 className="alert-heading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         className="bi trophy-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"
                         aria-label="Warning:">
                        <path
                            d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                    </svg>
                    {getMessageContent(messageType).headline}
                </h3>
                {getMessageContent(messageType).textBody}
                <div>
                    <p> Your opponent says 'thank you' for a good game.</p>
                </div>
            </div>
        );
    }

    if (gameResult === 'LOSS') {
        return (
            <div className="d-block alert alert-danger " role="alert">
                <h3 className="alert-heading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         className="bi bi-emoji-smile-upside-down-fill flex-shrink-0 me-2" viewBox="0 0 16 16"
                         role="img"
                         aria-label="Warning:">
                        <path
                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM7 9.5C7 8.672 6.552 8 6 8s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5zM4.285 6.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 4.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 3.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM10 8c-.552 0-1 .672-1 1.5s.448 1.5 1 1.5 1-.672 1-1.5S10.552 8 10 8z"/>
                    </svg>
                    {getMessageContent(messageType).headline}
                </h3>
                {getMessageContent(messageType).textBody}
                <div>
                    Your opponent says 'thank you' for a good game.
                </div>
            </div>
        );
    } else {
        return (
            <div className="d-block alert alert-warning " role="alert">
                <h3 className="alert-heading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-star-half" viewBox="0 0 16 16">
                        <path
                            d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
                    </svg>
                    {getMessageContent(messageType).headline}
                </h3>
                {getMessageContent(messageType).textBody}
                <div>
                    Your opponent says 'thank you' for a good game.
                </div>
            </div>
        );
    }
};