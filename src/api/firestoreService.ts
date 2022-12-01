import {v4 as uuidv4} from "uuid";
import {StoneInterface} from "../Session/Board/Stones/Stone";

export const getCreatorStones = (creatorId: string): StoneInterface[] => {
    return [
        {
            id: uuidv4(),
            type: "ELEPHANT",
            originalOwner: creatorId,
            currentOwner: creatorId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "A",
            positionRowNumber: 4,
            highlighted: false,
        },
        {
            id: uuidv4(),
            type: "LION",
            originalOwner: creatorId,
            currentOwner: creatorId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "B",
            positionRowNumber: 4,
            highlighted: false,
        },
        {
            id: uuidv4(),
            type: "GIRAFFE",
            originalOwner: creatorId,
            currentOwner: creatorId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "C",
            positionRowNumber: 4,
            highlighted: false,
        },
        {
            id: uuidv4(),
            type: "CHICKEN",
            originalOwner: creatorId,
            currentOwner: creatorId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "B",
            positionRowNumber: 3,
            highlighted: false,
        },
    ];
};

export const getOpponentStones = (opponentId: string): StoneInterface[] => {
    return [
        {
            id: uuidv4(),
            type: "ELEPHANT",
            originalOwner: opponentId,
            currentOwner: opponentId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "C",
            positionRowNumber: 1,
            highlighted: false,
        },
        {
            id: uuidv4(),
            type: "LION",
            originalOwner: opponentId,
            currentOwner: opponentId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "B",
            positionRowNumber: 1,
            highlighted: false,
        },
        {
            id: uuidv4(),
            type: "GIRAFFE",
            originalOwner: opponentId,
            currentOwner: opponentId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "A",
            positionRowNumber: 1,
            highlighted: false,
        },
        {
            id: uuidv4(),
            type: "CHICKEN",
            originalOwner: opponentId,
            currentOwner: opponentId,
            stashed: false,
            invisible: false,
            positionColumnLetter: "B",
            positionRowNumber: 2,
            highlighted: false,
        },
    ];
};
