import {evaluateGameResult} from "../GameFinishedMessage/GameFinishedMessageService";

describe('GameFinishedMessageService', () => {
    describe('evaluateGameResult', () => {
        it('returns VICTORY if the user has won by capturing a lion', () => {
            expect(evaluateGameResult("VICTORY_LION_CAPTURE")).toBe('VICTORY');
        });

        it('returns VICTORY if the user has won by capturing a base', () => {
            expect(evaluateGameResult("VICTORY_HOME_BASE_CONQUER")).toBe('VICTORY');
        });

        it('returns VICTORY if the user has won by defending own base against an attack', () => {
            expect(evaluateGameResult("VICTORY_HOME_BASE_CONQUER_FAILED")).toBe('VICTORY');
        });

        it('returns LOSS if the user has lost because their lion got captured', () => {
            expect(evaluateGameResult("LOSS_LION_CAPTURE")).toBe('LOSS');
        });

        it('returns LOSS if the user has lost because their homebase got conquered', () => {
            expect(evaluateGameResult("LOSS_HOME_BASE_CONQUER")).toBe('LOSS');
        });

        it('returns LOSS if the user has lost because they have unsuccessfully attempted conquering opponents homebase', () => {
            expect(evaluateGameResult("LOSS_HOME_BASE_CONQUER_FAILED")).toBe('LOSS');
        });

        it('returns TIE if the user has tied', () => {
            expect(evaluateGameResult("TIE")).toBe('TIE');
        });
    });
});