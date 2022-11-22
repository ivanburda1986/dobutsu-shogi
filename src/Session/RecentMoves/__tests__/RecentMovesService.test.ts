import { isTheMoveFromStash, isTheMoveToStash } from "../RecentMovesService";
import { MoveInterface } from "../../../api/firestore";

describe('RecentMovesService', () => {
    describe('isTheMoveFromStash', () => {
        it('should return true when the move is from the stash', () => {
            const move = {
                fromCoordinates: 'CREATOR-ELEPHANT',
                targetCoordinates: 'B1',
            } as MoveInterface;

            expect(isTheMoveFromStash(move)).toBe(true);
        });

        it('should false true when the move is not from the stash', () => {
            const move = {
                fromCoordinates: 'A1',
                targetCoordinates: 'B1',
            } as MoveInterface;

            expect(isTheMoveFromStash(move)).toBe(false);
        });
    });

    describe('isTheMoveToStash', () => {
        it('should return true when the move is to the stash', () => {
            const move = {
                fromCoordinates: 'A1',
                targetCoordinates: 'CREATOR-ELEPHANT',
            } as MoveInterface;

            expect(isTheMoveToStash(move)).toBe(true);
        });

        it('should false true when the move is not to the stash', () => {
            const move = {
                fromCoordinates: 'A1',
                targetCoordinates: 'B1',
            } as MoveInterface;

            expect(isTheMoveToStash(move)).toBe(false);
        });
    });
});