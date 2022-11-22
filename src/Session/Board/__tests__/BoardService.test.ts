import { getColumnLetters, getRowNumbers } from "../BoardService";

describe('BoardService', () => {
    describe('getRowNumbers', () => {
        it('should return numbers for board rows from the creators perspective', () => {
            const amIOpponent = false;
            expect(getRowNumbers(amIOpponent)).toEqual([1, 2, 3, 4])
        });

        it('should return numbers for board rows from the opponents perspective', () => {
            const amIOpponent = true;
            expect(getRowNumbers(amIOpponent)).toEqual([4, 3, 2, 1])
        });
    });

    describe('getColumnLetters', () => {
        it('should return letters for the board from the creators perspective', () => {
            const amIOpponent = false;
            expect(getColumnLetters(amIOpponent)).toEqual(["A", "B", "C"])
        });

        it('should return letters for the board from the opponents perspective', () => {
            const amIOpponent = true;
            expect(getColumnLetters(amIOpponent)).toEqual(["C", "B", "A"])
        });
    });
});