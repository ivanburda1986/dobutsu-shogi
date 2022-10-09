import * as firestoreRequests from "../../api/firestore";
import {determineStartingPlayer, isGameDataAvailable, isStartingPlayerDetermined} from "../SessionService";
import {Dispatch} from "react";
import {useUpdateGameInterface} from "../../api/firestore";
import {mockRandom, resetMockRandom} from "jest-mock-random";

const MATH_RANDOM_TO_MAKE_CREATOR_STARTING_PLAYER = 0.49;
const MATH_RANDOM_TO_MAKE_OPPONENT_STARTING_PLAYER = 0.5;

describe('SessionService', () => {
    describe('determineStartingPlayer', () => {
        it('decides and saves to server a starting player when both players joined and starting player is not determined', async () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: undefined,
            };
            const gameId = 'game123';
            mockRandom(MATH_RANDOM_TO_MAKE_CREATOR_STARTING_PLAYER);

            determineStartingPlayer(gameData, gameId, updateGameSpy);

            await expect(updateGameSpy).toHaveBeenCalledWith({
                id: gameId,
                updatedDetails: {startingPlayer: 'creator123', currentPlayerTurn: 'creator123'}
            });
            resetMockRandom();
        });

        it('decides the creator should start and saves decision to server', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: undefined,
            };
            const gameId = 'game123';
            mockRandom(MATH_RANDOM_TO_MAKE_CREATOR_STARTING_PLAYER);

            determineStartingPlayer(gameData, gameId, updateGameSpy);

            expect(updateGameSpy).toHaveBeenCalledWith({
                id: gameId,
                updatedDetails: {startingPlayer: 'creator123', currentPlayerTurn: 'creator123'}
            });
            resetMockRandom();
        });

        it('decides the opponent should start and saves decision to server', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: undefined,
            };
            const gameId = 'game123';
            mockRandom(MATH_RANDOM_TO_MAKE_OPPONENT_STARTING_PLAYER);

            determineStartingPlayer(gameData, gameId, updateGameSpy);

            expect(updateGameSpy).toHaveBeenCalledWith({
                id: gameId,
                updatedDetails: {startingPlayer: 'opponent123', currentPlayerTurn: 'opponent123'}
            });
            resetMockRandom();
        });

        it('does not send decision about starting player to server when starting player is already known', async () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: 'creator123',
            };
            const gameId = 'game123';


            determineStartingPlayer(gameData, gameId, updateGameSpy);

            await expect(updateGameSpy).not.toHaveBeenCalled();

        });

        it('does not send decision about starting player to server when game data is not available', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {};
            const gameId = 'game123';

            determineStartingPlayer(gameData, gameId, updateGameSpy);

            expect(updateGameSpy).not.toHaveBeenCalled();
        });

        it('does not send decision about starting player to server when gameId is not available', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: 'creator123',
            };
            const gameId = undefined;

            determineStartingPlayer(gameData, gameId, updateGameSpy);

            expect(updateGameSpy).not.toHaveBeenCalled();
        });
    });

    describe('havePlayersJoinedGame', () => {
        it('returns false when gameId is not available', () => {
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: 'creator123',
            };
            const gameId = undefined;

            const result = isGameDataAvailable(gameData, gameId);

            expect(result).toBe(false);
        });

        it('returns false when game has been joined only by 1 player', () => {
            const gameData = {
                creatorId: 'creator123',
                opponentId: undefined,
                creatorJoined: true,
                opponentJoined: false,
                startingPlayer: undefined,
            };
            const gameId = 'game123';

            const result = isGameDataAvailable(gameData, gameId);

            expect(result).toBe(false);
        });

        it('returns true when game has been joined by both players', () => {
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: 'creator123',
            };
            const gameId = 'game123';

            const result = isGameDataAvailable(gameData, gameId);

            expect(result).toBe(true);
        });
    });

    describe('isStartingPlayerDetermined', () => {
        it('returns false when starting player is not determined', () => {
            const startingPlayer = undefined;

            expect(isStartingPlayerDetermined(startingPlayer)).toBe(false);
        });

        it('returns true when starting player is determined', () => {
            const startingPlayer = 'creator123';

            expect(isStartingPlayerDetermined(startingPlayer)).toBe(true);
        });
    });
});