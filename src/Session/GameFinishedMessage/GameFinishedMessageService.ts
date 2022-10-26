export type GameFinishedMessageType =
    "VICTORY_LION_CAPTURE"
    | "LOSS_LION_CAPTURE"
    | "VICTORY_HOME_BASE_CONQUER"
    | "VICTORY_HOME_BASE_CONQUER_FAILED"
    | "LOSS_HOME_BASE_CONQUER"
    | "LOSS_HOME_BASE_CONQUER_FAILED"
    | "TIE"

export type GameResultType = "VICTORY"
    | "LOSS"
    | "TIE"

export const getMessageContent = (messageType: GameFinishedMessageType) => {
    const texts = {
        'VICTORY_LION_CAPTURE': {
            'headline': "You have won!",
            'textBody': "You have captured the opponent's lion.",
        },
        'LOSS_LION_CAPTURE': {
            'headline': "You have lost!",
            'textBody': "Your lion got captured.",
        },
        'VICTORY_HOME_BASE_CONQUER': {
            'headline': "You have won!",
            'textBody': "You have conquered the opponent's homebase!",
        },
        'LOSS_HOME_BASE_CONQUER': {
            'headline': "You have lost!",
            'textBody': "Your homebase has got conquered.",
        },
        'VICTORY_HOME_BASE_CONQUER_FAILED': {
            'headline': "You have won!",
            'textBody': "The opponent's lion has tried to conquer your homebase, but failed because your animals protected it.",
        },
        'LOSS_HOME_BASE_CONQUER_FAILED': {
            'headline': "You have lost!",
            'textBody': "Your lion has tried to conquer the opponent's homebase, but failed because it was protected.",
        },
        'TIE': {
            'headline': "It's a tie!",
            'textBody': "A tie happens when you and your opponent keep repeating the same movements.",
        }
    };

    const headline = texts[messageType].headline;
    const textBody = texts[messageType].textBody;
    return {headline, textBody};
};

export const evaluateGameResult = (messageType: GameFinishedMessageType): GameResultType => {
    if (messageType === "VICTORY_LION_CAPTURE" || messageType === "VICTORY_HOME_BASE_CONQUER" || messageType === "VICTORY_HOME_BASE_CONQUER_FAILED") {
        return 'VICTORY';
    }
    if (messageType === "LOSS_LION_CAPTURE" || messageType === "LOSS_HOME_BASE_CONQUER" || messageType === "LOSS_HOME_BASE_CONQUER_FAILED") {
        return 'LOSS';
    } else {
        return 'TIE';
    }
};