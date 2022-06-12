import {gameType} from "./firestore";
import {v4 as uuidv4} from "uuid";
import {StoneInterface} from "../Session/Board/Stones/Stone";

export const getCreatorStones = ({creatorId, type}: { creatorId: string; type: gameType }): StoneInterface[] => {
    if (type === "DOBUTSU") {
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 4,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "LION",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 4,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 4,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 3,
                highlighted: false,
            },
        ];
    } else
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 4,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "LION",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 4,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 4,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 3,
                highlighted: false,
            },
        ];
};

export const getOpponentStones = ({opponentId, type}: { opponentId: string; type: gameType }): StoneInterface[] => {
    if (type === "DOBUTSU") {
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 1,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "LION",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 1,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 1,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 2,
                highlighted: false,
            },
        ];
    } else
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 1,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "LION",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 1,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 1,
                highlighted: false,
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 2,
                highlighted: false,
            },
        ];
};
