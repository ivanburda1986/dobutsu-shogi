import { MoveInterface } from "../../api/firestore";

export const getLastMove = (moves: MoveInterface[]) => {
    if (moves.length > 0) {
        return moves[moves.length - 1];
    }
    return undefined;
};

export const getLastButOneMove = (moves: MoveInterface[]) => {
    if (moves.length > 1) {
        return moves[moves.length - 2];
    }
    return undefined;
};

export const isTheMoveFromStash = (lastMove: MoveInterface) => lastMove.fromCoordinates.length > 2;

export const isTheMoveToStash = (lastMove: MoveInterface) => lastMove.targetCoordinates.length > 2;