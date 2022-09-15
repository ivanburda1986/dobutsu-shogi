import * as firestoreRequests from "../../api/firestore";
import {determineStartingPlayer} from "../SessionService";
import {Dispatch} from "react";
import {useUpdateGameInterface} from "../../api/firestore";
import {mockRandom, resetMockRandom} from "jest-mock-random";

const MATH_RANDOM_TO_MAKE_CREATOR_STARTING_PLAYER = 0.49;
const MATH_RANDOM_TO_MAKE_OPPONENT_STARTING_PLAYER = 0.5;

describe('SessionService', () => {
    describe('determineStartingPlayer', () => {
        it('decides a starting player send decision to database when both players joined and starting player is not determined', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: null,
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

        it('randomly decides creator to start and sends the decision to database', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: null,
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

        it('randomly decides opponent to start and sends the decision to database', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {
                creatorId: 'creator123',
                opponentId: 'opponent123',
                creatorJoined: true,
                opponentJoined: true,
                startingPlayer: null,
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

        it('does not send decision about starting player to database when starting player is already determined', () => {
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

            expect(updateGameSpy).not.toHaveBeenCalled();
        });

        it('does not send decision about starting player to database when game data is not available', () => {
            const updateGameSpy = jest
                .spyOn(firestoreRequests, 'updateGame') as any as Dispatch<useUpdateGameInterface>;
            const gameData = {};
            const gameId = 'game123';

            determineStartingPlayer(gameData, gameId, updateGameSpy);

            expect(updateGameSpy).not.toHaveBeenCalled();
        });

        it('does not send decision about starting player to database when gameId is not available', () => {
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

    describe('isGameLoadedForBothPlayers', () => {
        it('returns false when gameId is unknown', () => {

        });

        it('returns false when game is loaded only for a single player', () => {

        });

        it('returns true when game is loaded', () => {

        });
    });
});