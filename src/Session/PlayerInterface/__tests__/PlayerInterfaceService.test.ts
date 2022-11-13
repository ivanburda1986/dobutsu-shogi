import {getInterfacePlayerName, getStashColumnLetters, isPlayersTurn} from "../PlayerInterfaceService";

describe('PlayerInterfaceService', () => {
    describe('getStashColumnLetters', () => {
        it('should return column names for a creators player interface', () => {
            const creatorInterface = true;

            expect(getStashColumnLetters(creatorInterface)).toEqual(["CREATOR-ELEPHANT", "CREATOR-GIRAFFE", "CREATOR-CHICKEN"])
        });

        it('should return column names for an opponent player interface', () => {
            const creatorInterface = false;

            expect(getStashColumnLetters(creatorInterface)).toEqual(["OPPONENT-ELEPHANT", "OPPONENT-GIRAFFE", "OPPONENT-CHICKEN"])
        });
    });

    describe('getInterfacePlayerName', () => {
        it('should return creators name for the player interface related to the creator', () => {
            const creatorInterface = true;
            const gameData = {creatorName:'abc', opponentName:'efg'}

            expect(getInterfacePlayerName(creatorInterface,gameData)).toBe('abc')
        });

        it('should return opponent name for the player interface related to the opponent', () => {
            const creatorInterface = false;
            const gameData = {creatorName:'abc', opponentName:'efg'}

            expect(getInterfacePlayerName(creatorInterface,gameData)).toBe('efg')
        });
    });

    describe('isPlayersTurn', () => {
        it('should return false if gameData is not available', () => {
            const creatorInterface = false;
            const gameData = undefined;

            expect(isPlayersTurn(creatorInterface,gameData)).toBe(false);
        });

        it('should return true for creators interface when the player to play is the creator', () => {
            const creatorInterface = true;
            const gameData = {currentPlayerTurn:"123", creatorId: "123", opponentId:"456"};

            expect(isPlayersTurn(creatorInterface,gameData)).toBe(true);
        });

        it('should return false for creators interface when the player to play is the opponent', () => {
            const creatorInterface = true;
            const gameData = {currentPlayerTurn:"456", creatorId: "123", opponentId:"456"};

            expect(isPlayersTurn(creatorInterface,gameData)).toBe(false);
        });

        it('should return true for opponents interface when the player to play is the opponent', () => {
            const creatorInterface = false;
            const gameData = {currentPlayerTurn:"456", creatorId: "123", opponentId:"456"};

            expect(isPlayersTurn(creatorInterface,gameData)).toBe(true);
        });

        it('should return false for opponent interface when the player to play is the creator', () => {
            const creatorInterface = false;
            const gameData = {currentPlayerTurn:"123", creatorId: "123", opponentId:"456"};

            expect(isPlayersTurn(creatorInterface,gameData)).toBe(false);
        });
    });
});