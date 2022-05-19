import {gameType} from "./firestore";
import {v4 as uuidv4} from "uuid";
import {StoneInterface} from "../Session/Board/Stones/Stone";

export const getCreatorStones = ({creatorId, type}: { creatorId: string; type: gameType }): StoneInterface[] => {
    if (type === "DOBUTSU") {
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 4
            },
            {
                id: uuidv4(),
                type: "LION",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 4
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 4
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 3
            },
        ];
    } else
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 4
            },
            {
                id: uuidv4(),
                type: "LION",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 4
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 4
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                empowered: false,
                originalOwner: creatorId,
                currentOwner: creatorId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 3
            },
        ];
};

export const getOpponentStones = ({opponentId, type}: { opponentId: string; type: gameType }): StoneInterface[] => {
    if (type === "DOBUTSU") {
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 1
            },
            {
                id: uuidv4(),
                type: "LION",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 1
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 1
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 2
            },
        ];
    } else
        return [
            {
                id: uuidv4(),
                type: "ELEPHANT",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "C",
                positionNumber: 1
            },
            {
                id: uuidv4(),
                type: "LION",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 1
            },
            {
                id: uuidv4(),
                type: "GIRAFFE",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "A",
                positionNumber: 1
            },
            {
                id: uuidv4(),
                type: "CHICKEN",
                empowered: false,
                originalOwner: opponentId,
                currentOwner: opponentId,
                stashed: false,
                positionLetter: "B",
                positionNumber: 2
            },
        ];
};
