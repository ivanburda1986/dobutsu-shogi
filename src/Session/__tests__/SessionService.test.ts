import * as firestoreRequests from "../../api/firestore";
import { updateGameInterface } from "../../api/firestore";

import {
  areSufficientMoveRecordsAvailable,
  createAndStoreLastRoundMoveHash,
  determineStartingPlayer,
  getPlayerFinishedGameState,
  isGameDataAvailable,
  isMoveHashRelatedToStash,
  isStartingPlayerDetermined,
  isThisPlayerOpponent,
  isTieEvaluation,
  shouldSaveLatestRoundMovementHash,
} from "../SessionService";

import { Dispatch } from "react";
import { mockRandom, resetMockRandom } from "jest-mock-random";

const MATH_RANDOM_TO_MAKE_CREATOR_STARTING_PLAYER = 0.49;
const MATH_RANDOM_TO_MAKE_OPPONENT_STARTING_PLAYER = 0.5;

describe("SessionService", () => {
  describe("determineStartingPlayer", () => {
    it("decides and saves to server a starting player when both players joined and starting player is not determined", async () => {
      const updateGameSpy = jest.spyOn(
        firestoreRequests,
        "updateGame"
      ) as any as Dispatch<updateGameInterface>;
      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: undefined,
      };
      const gameId = "game123";
      mockRandom(MATH_RANDOM_TO_MAKE_CREATOR_STARTING_PLAYER);

      determineStartingPlayer(gameData, gameId, updateGameSpy);

      await expect(updateGameSpy).toHaveBeenCalledWith({
        id: gameId,
        updatedDetails: {
          startingPlayer: "creator123",
          currentPlayerTurn: "creator123",
        },
      });
      resetMockRandom();
    });

    it("decides the creator should start and saves decision to server", () => {
      const updateGameSpy = jest.spyOn(
        firestoreRequests,
        "updateGame"
      ) as any as Dispatch<updateGameInterface>;
      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: undefined,
      };
      const gameId = "game123";
      mockRandom(MATH_RANDOM_TO_MAKE_CREATOR_STARTING_PLAYER);

      determineStartingPlayer(gameData, gameId, updateGameSpy);

      expect(updateGameSpy).toHaveBeenCalledWith({
        id: gameId,
        updatedDetails: {
          startingPlayer: "creator123",
          currentPlayerTurn: "creator123",
        },
      });
      resetMockRandom();
    });

    it("decides the opponent should start and saves decision to server", () => {
      const updateGameSpy = jest.spyOn(
        firestoreRequests,
        "updateGame"
      ) as any as Dispatch<updateGameInterface>;
      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: undefined,
      };
      const gameId = "game123";
      mockRandom(MATH_RANDOM_TO_MAKE_OPPONENT_STARTING_PLAYER);

      determineStartingPlayer(gameData, gameId, updateGameSpy);

      expect(updateGameSpy).toHaveBeenCalledWith({
        id: gameId,
        updatedDetails: {
          startingPlayer: "opponent123",
          currentPlayerTurn: "opponent123",
        },
      });
      resetMockRandom();
    });

    it("does not send decision about starting player to server when starting player is already known", () => {
      const updateGameSpy = jest.spyOn(
        firestoreRequests,
        "updateGame"
      ) as any as Dispatch<updateGameInterface>;
      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: "creator123",
      };
      const gameId = "game123";

      determineStartingPlayer(gameData, gameId, updateGameSpy);

      expect(updateGameSpy).not.toHaveBeenCalled();
    });

    it("does not send decision about starting player to server when game data is not available", () => {
      const updateGameSpy = jest.spyOn(
        firestoreRequests,
        "updateGame"
      ) as any as Dispatch<updateGameInterface>;
      const gameData = {};
      const gameId = "game123";

      determineStartingPlayer(gameData, gameId, updateGameSpy);

      expect(updateGameSpy).not.toHaveBeenCalled();
    });

    it("does not send decision about starting player to server when gameId is not available", () => {
      const updateGameSpy = jest.spyOn(
        firestoreRequests,
        "updateGame"
      ) as any as Dispatch<updateGameInterface>;
      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: "creator123",
      };
      const gameId = undefined;

      determineStartingPlayer(gameData, gameId, updateGameSpy);

      expect(updateGameSpy).not.toHaveBeenCalled();
    });
  });

  describe("havePlayersJoinedGame", () => {
    it("returns false when gameId is not available", () => {
      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: "creator123",
      };
      const gameId = undefined;

      const result = isGameDataAvailable(gameData, gameId);

      expect(result).toBe(false);
    });

    it("returns false when game has been joined only by 1 player", () => {
      const gameData = {
        creatorId: "creator123",
        opponentId: undefined,
        creatorJoined: true,
        opponentJoined: false,
        startingPlayer: undefined,
      };
      const gameId = "game123";

      const result = isGameDataAvailable(gameData, gameId);

      expect(result).toBe(false);
    });

    it("returns true when game has been joined by both players", () => {
      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: "creator123",
      };
      const gameId = "game123";

      const result = isGameDataAvailable(gameData, gameId);

      expect(result).toBe(true);
    });
  });

  describe("isStartingPlayerDetermined", () => {
    it("returns false when starting player is not determined", () => {
      const startingPlayer = undefined;

      expect(isStartingPlayerDetermined(startingPlayer)).toBe(false);
    });

    it("returns true when starting player is determined", () => {
      const startingPlayer = "creator123";

      expect(isStartingPlayerDetermined(startingPlayer)).toBe(true);
    });
  });

  describe("createAndStoreLastRoundMoveHash", () => {
    it("saves to server a hash representing the latest move round", async () => {
      const updateGameSpy = jest.spyOn(
        firestoreRequests,
        "updateGame"
      ) as any as Dispatch<updateGameInterface>;

      const gameData = {
        creatorId: "creator123",
        opponentId: "opponent123",
        creatorJoined: true,
        opponentJoined: true,
        startingPlayer: "opponent123",
        moveRepresentations: [],
        moves: [
          {
            fromCoordinates: "A1",
            id: "stoneId123",
            isTakeOver: false,
            isVictory: false,
            moveNumber: 0,
            movingPlayerId: "opponent123",
            targetCoordinates: "A2",
            type: "GIRAFFE",
          },
          {
            fromCoordinates: "B4",
            id: "stoneId456",
            isTakeOver: false,
            isVictory: false,
            moveNumber: 1,
            movingPlayerId: "creator123",
            targetCoordinates: "C3",
            type: "LION",
          },
        ],
      };
      const gameId = "game123";

      createAndStoreLastRoundMoveHash(gameData, gameId, updateGameSpy);

      await expect(updateGameSpy).toHaveBeenCalledWith({
        id: gameId,
        updatedDetails: { moveRepresentations: ["oga1a2clb4c3"] },
      });
    });
  });

  describe("areSufficientMoveRecordsAvailable", () => {
    it("returns false when 0 move records are available", () => {
      const gameData = {
        moves: [],
      };

      expect(areSufficientMoveRecordsAvailable(gameData)).toBe(false);
    });

    it("returns false when an odd number of move records is available", () => {
      const gameData = {
        moves: [
          {
            fromCoordinates: "A1",
            id: "stoneId123",
            isTakeOver: false,
            isVictory: false,
            moveNumber: 0,
            movingPlayerId: "opponent123",
            targetCoordinates: "A2",
            type: "GIRAFFE",
          },
        ],
      };

      expect(areSufficientMoveRecordsAvailable(gameData)).toBe(false);
    });

    it("returns true when an even number of move records is available", () => {
      const gameData = {
        moves: [
          {
            fromCoordinates: "A1",
            id: "stoneId123",
            isTakeOver: false,
            isVictory: false,
            moveNumber: 0,
            movingPlayerId: "opponent123",
            targetCoordinates: "A2",
            type: "GIRAFFE",
          },
          {
            fromCoordinates: "B4",
            id: "stoneId456",
            isTakeOver: false,
            isVictory: false,
            moveNumber: 1,
            movingPlayerId: "creator123",
            targetCoordinates: "C3",
            type: "LION",
          },
        ],
      };

      expect(areSufficientMoveRecordsAvailable(gameData)).toBe(true);
    });
  });

  describe("isMoveHashRelatedToStash", () => {
    it("returns false when the move hash represents a stash-related movement", () => {
      expect(isMoveHashRelatedToStash("pga2a31lc3c2")).toBe(false);
    });

    it("returns true when the move hash represents a non-stash related movement", () => {
      expect(isMoveHashRelatedToStash("pcb2b3pcb3opponent-chicken3")).toBe(
        true
      );
    });
  });

  describe("shouldSaveLatestRoundMovementHash", () => {
    it("returns false when latest round move hash has already been stored", () => {
      const moveRepresentations = ["1gc4c3plb1a1", "pga2a31lc3c2"];
      const latestRoundMoveHash = "pga2a31lc3c2";

      expect(
        shouldSaveLatestRoundMovementHash(
          moveRepresentations,
          latestRoundMoveHash
        )
      ).toBe(false);
    });

    it("returns true when latest round move hash has not been stored yet", () => {
      const moveRepresentations = ["1gc4c3plb1a1"];
      const latestRoundMoveHash = "pga2a31lc3c2";

      expect(
        shouldSaveLatestRoundMovementHash(
          moveRepresentations,
          latestRoundMoveHash
        )
      ).toBe(true);
    });
  });

  describe("isTieEvaluation", () => {
    it("returns false when not enough movements happened to possibly cause a tie", () => {
      const gameData = {
        moveRepresentations: ["aaaa", "bbbb", "aaaa", "bbbb", "aaaa"],
      };

      expect(isTieEvaluation(gameData)).toBe(false);
    });

    it("returns false when both players have not taken 3 repeating movements", () => {
      const gameData = {
        moveRepresentations: ["aaaa", "bbbb", "aaaa", "bbbb", "aaaa", "ccc"],
      };

      expect(isTieEvaluation(gameData)).toBe(false);
    });

    it("returns true when both players have taken 3 repeating movements", () => {
      const gameData = {
        moveRepresentations: ["aaaa", "bbbb", "aaaa", "bbbb", "aaaa", "bbbb"],
      };
      expect(isTieEvaluation(gameData)).toBe(true);
    });
  });

  describe("getPlayerFinishedGameState", () => {
    it("returns that player has won by capturing opponents lion", () => {
      const winnerId = "creator123";
      const victoryType = "LION_CAUGHT_SUCCESS";
      const loggedInUserUserId = "creator123";

      const finishedGameState = getPlayerFinishedGameState(
        winnerId,
        victoryType,
        loggedInUserUserId
      );

      expect(finishedGameState).toBe("VICTORY_LION_CAPTURE");
    });

    it("returns that player has lost because their lion got captured", () => {
      const winnerId = "creator123";
      const victoryType = "LION_CAUGHT_SUCCESS";
      const loggedInUserUserId = "opponent123";

      const finishedGameState = getPlayerFinishedGameState(
        winnerId,
        victoryType,
        loggedInUserUserId
      );

      expect(finishedGameState).toBe("LOSS_LION_CAPTURE");
    });

    it("returns that player has won by conquering opponents homebase", () => {
      const winnerId = "creator123";
      const victoryType = "HOMEBASE_CONQUERED_SUCCESS";
      const loggedInUserUserId = "creator123";

      const finishedGameState = getPlayerFinishedGameState(
        winnerId,
        victoryType,
        loggedInUserUserId
      );

      expect(finishedGameState).toBe("VICTORY_HOME_BASE_CONQUER");
    });

    it("returns that player has lost because their homebase got conquered", () => {
      const winnerId = "creator123";
      const victoryType = "HOMEBASE_CONQUERED_SUCCESS";
      const loggedInUserUserId = "opponent123";

      const finishedGameState = getPlayerFinishedGameState(
        winnerId,
        victoryType,
        loggedInUserUserId
      );

      expect(finishedGameState).toBe("LOSS_HOME_BASE_CONQUER");
    });

    it("returns that player has won because they have defended their homebase against opponents conquer attempt", () => {
      const winnerId = "creator123";
      const victoryType = "HOMEBASE_CONQUERED_FAILURE";
      const loggedInUserUserId = "creator123";

      const finishedGameState = getPlayerFinishedGameState(
        winnerId,
        victoryType,
        loggedInUserUserId
      );

      expect(finishedGameState).toBe("VICTORY_HOME_BASE_CONQUER_FAILED");
    });

    it("returns that player has lost because they unsuccessfully attempted conquering opponents homebase", () => {
      const winnerId = "creator123";
      const victoryType = "HOMEBASE_CONQUERED_FAILURE";
      const loggedInUserUserId = "opponent123";

      const finishedGameState = getPlayerFinishedGameState(
        winnerId,
        victoryType,
        loggedInUserUserId
      );

      expect(finishedGameState).toBe("LOSS_HOME_BASE_CONQUER_FAILED");
    });
  });

  describe("isThisPlayerOpponent", () => {
    it("should return true if the player from whose perspective this gets evaluated is an opponent", () => {
      const creatorId = "playerA";
      const loggedInUserUserId = "playerB";
      expect(isThisPlayerOpponent(creatorId, loggedInUserUserId)).toBe(true);
    });

    it("should return false if the player from whose perspective this gets evaluated is a creator", () => {
      const creatorId = "playerA";
      const loggedInUserUserId = "playerA";
      expect(isThisPlayerOpponent(creatorId, loggedInUserUserId)).toBe(false);
    });
  });
});
