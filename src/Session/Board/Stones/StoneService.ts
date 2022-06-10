import CHICKEN from "./images/chicken.png";
import ELEPHANT from "./images/elephant.png";
import GIRAFFE from "./images/giraffe.png";
import LION from "./images/lion.png";
import HEN from "./images/hen.png";

import {chickenTurningToHenCoordinates, lionConquerFields, stoneMovements} from "./StoneMovements";
import {StoneInterface, stoneType} from "./Stone";
import {columnLetterType} from "../../PlayerInterface/PlayerInterfaceService";
import {DocumentData} from "firebase/firestore";
import {lionConquerAttemptInterface} from "../BoardField/FieldService";

interface getStashTargetPositionInterface {
    type: stoneType;
    amIOpponent: boolean;
}

export const getStashTargetPosition = ({type, amIOpponent}: getStashTargetPositionInterface): string => {
    if (amIOpponent) {
        return `OPPONENT-${type}`;
    }
    return `CREATOR-${type}`;
};

interface shouldChickenTurnIntoHenInterface {
    amIOpponent: boolean;
    stashed: boolean;
    type: stoneType;
    movingToLetter: string;
    movingToNumber: number;
}

export const shouldChickenTurnIntoHen = ({
                                             amIOpponent,
                                             stashed,
                                             type,
                                             movingToLetter,
                                             movingToNumber
                                         }: shouldChickenTurnIntoHenInterface) => {
    // console.log('amIOpponent', amIOpponent);
    // console.log('stashed', stashed);
    // console.log('movingToLetter', movingToLetter);
    // console.log('movingToNumber', movingToNumber);
    if (type !== "CHICKEN") {
        return false;
    }

    if (stashed) {
        return false;
    }

    if (amIOpponent && chickenTurningToHenCoordinates.opponent.includes(`${movingToLetter}${movingToNumber}`)) {
        return true;
    }

    return !amIOpponent && chickenTurningToHenCoordinates.creator.includes(`${movingToLetter}${movingToNumber}`);
};

interface isItMyTurnInterface {
    myId: string;
    currentTurnPlayerId: string;
}

export const isItMyTurn = ({myId, currentTurnPlayerId}: isItMyTurnInterface): boolean => {
    return myId === currentTurnPlayerId;
};

interface nextTurnPlayerIdInterface {
    myId: string;
    gameData: DocumentData | undefined;
}

export const nextTurnPlayerId = ({myId, gameData}: nextTurnPlayerIdInterface): string => {
    if (myId === gameData?.currentPlayerTurn) {
        let nextTurnPlayerId = myId === gameData?.creatorId ? gameData?.opponentId : gameData?.creatorId;
        // console.log('nextTurnPlayerId', nextTurnPlayerId);
        return nextTurnPlayerId;
    }
    // console.log('nextTurnPlayerId', myId);
    return myId;
};

interface canStoneMoveThisWayInterface {
    stoneType: stoneType;
    movedFromLetter: string;
    movedFromNumber: number;
    movingToLetter: string;
    movingToNumber: number;
    amIOpponent: boolean;
    stashed: boolean;
}

export const canStoneMoveThisWay = ({
                                        stoneType,
                                        movedFromLetter,
                                        movedFromNumber,
                                        movingToLetter,
                                        movingToNumber,
                                        amIOpponent,
                                        stashed
                                    }: canStoneMoveThisWayInterface) => {

    if (stoneType === "CHICKEN") {
        if (stashed) {
            return true;
        }
        const originatingCoordinate = `${movedFromLetter}${movedFromNumber}`;
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        console.log('amIOpponent', amIOpponent);
        const allowedLetters = stoneMovements.CHICKEN[amIOpponent ? 'opponent' : 'creator'][originatingCoordinate];
        // console.log(allowedLetters.includes(targetCoordinate));
        return allowedLetters.includes(targetCoordinate);
    }
    if (stoneType === "GIRAFFE") {
        if (stashed) {
            return true;
        }
        const originatingCoordinate = `${movedFromLetter}${movedFromNumber}`;
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        const allowedLetters = stoneMovements.GIRAFFE[originatingCoordinate];
        // console.log(allowedLetters.includes(targetCoordinate));
        return allowedLetters.includes(targetCoordinate);
    }
    if (stoneType === "ELEPHANT") {
        if (stashed) {
            return true;
        }
        const originatingCoordinate = `${movedFromLetter}${movedFromNumber}`;
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        const allowedLetters = stoneMovements.ELEPHANT[originatingCoordinate];
        // console.log(allowedLetters.includes(targetCoordinate));
        return allowedLetters.includes(targetCoordinate);
    }
    if (stoneType === "LION") {
        const originatingCoordinate = `${movedFromLetter}${movedFromNumber}`;
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        const allowedLetters = stoneMovements.LION[originatingCoordinate];
        // console.log(allowedLetters.includes(targetCoordinate));
        // console.log(allowedLetters.includes(targetCoordinate));
        return allowedLetters.includes(targetCoordinate);
    }
    if (stoneType === "HEN") {
        if (stashed) {
            return true;
        }
        const originatingCoordinate = `${movedFromLetter}${movedFromNumber}`;
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        const allowedLetters = stoneMovements.HEN[amIOpponent ? 'opponent' : 'creator'][originatingCoordinate];
        // console.log(allowedLetters.includes(targetCoordinate));
        return allowedLetters.includes(targetCoordinate);
    }
    return false;
};


interface amIStoneOwnerInterface {
    currentOwner: string;
    loggedInUserUserId: string;
}

export const amIStoneOwner = ({currentOwner, loggedInUserUserId}: amIStoneOwnerInterface) => {
    return currentOwner === loggedInUserUserId;
};

interface useSetStonePositionInterface {
    stoneId: string;
    targetPositionLetter: string | columnLetterType;
    targetPositionNumber: number;
    positionX: number;
    setPositionX: (position: number) => void;
    positionY: number;
    setPositionY: (position: number) => void;
}

const translateHenToChickenStashPositioning = (targetPositionLetter: columnLetterType | string) => {
    if (targetPositionLetter === "OPPONENT-HEN") {
        return "OPPONENT-CHICKEN";
    }
    if (targetPositionLetter === "CREATOR-HEN") {
        return "CREATOR-CHICKEN";
    }
    return targetPositionLetter;
};

export const useSetStonePosition = ({
                                        stoneId,
                                        targetPositionLetter,
                                        targetPositionNumber,
                                        positionX,
                                        setPositionX,
                                        positionY,
                                        setPositionY
                                    }: useSetStonePositionInterface) => {
    // console.log('targetPositionLetter', targetPositionLetter);
    // console.log('targetPositionNumber', targetPositionNumber);
    let targetPosition = document.querySelector(`[data-letter=${translateHenToChickenStashPositioning(targetPositionLetter)}][data-number="${targetPositionNumber}"]`);
    let stone = document.getElementById(stoneId)?.getBoundingClientRect();

    //console.log('targetPosition', targetPosition);
    let rect = targetPosition?.getBoundingClientRect();
    //console.log('rect', rect);

    setPositionX(Math.floor(rect!.left + (rect!.width - stone!.width) / 2));
    setPositionY(Math.floor(rect!.top + (rect!.height - stone!.height) / 2));
    let div = document.getElementById(stoneId);
    div!.style.left = positionX + "px";
    div!.style.top = positionY + "px";
};

interface rotateOponentStonesInterface {
    currentOwner: string;
    loggedInUserUserId: string;
    setRotateDegrees: (numberOfDegrees: number) => void;
}

export const rotateOponentStones = ({
                                        currentOwner,
                                        loggedInUserUserId,
                                        setRotateDegrees
                                    }: rotateOponentStonesInterface) => {
    if (!currentOwner || !loggedInUserUserId) {
        return setRotateDegrees(0);
    }
    if (currentOwner === loggedInUserUserId) {
        return setRotateDegrees(0);
    }
    if (currentOwner !== loggedInUserUserId) {
        return setRotateDegrees(180);
    }

    return setRotateDegrees(0);
};

export const getImgReference = (type: stoneType) => {
    if (type === "CHICKEN") return CHICKEN;
    if (type === "ELEPHANT") return ELEPHANT;
    if (type === "GIRAFFE") return GIRAFFE;
    if (type === "HEN") return HEN;
    return LION;
};

interface getStashedStonePillCountInterface {
    allStones: StoneInterface[];
    currentOwnerId?: string;
    type: stoneType;
    stashed: boolean;
}

export const getStashedStonePillCount = ({
                                             allStones,
                                             currentOwnerId,
                                             type,
                                             stashed,
                                         }: getStashedStonePillCountInterface): number => {
    if (!currentOwnerId || !stashed) {
        return 0;
    }
    const stashedStones = allStones.filter((stone) => stone.stashed);
    const playerStashedCountOfTheStone = stashedStones.filter((stone) => stone.currentOwner === currentOwnerId).filter((stashedStone) => stashedStone.type === type);
    return playerStashedCountOfTheStone.length;
};


// Lion conquer attempt evaluation
interface lionConquerAttemptEvaluationInterface {
    stoneData: StoneInterface;
    amIOpponent: boolean;
    movingToLetter: string;
    movingToNumber: number;
    stones: StoneInterface[],


}

export const lionConquerAttemptEvaluation = ({
                                                 stoneData,
                                                 amIOpponent,
                                                 movingToLetter,
                                                 movingToNumber,
                                                 stones
                                             }: lionConquerAttemptEvaluationInterface): lionConquerAttemptInterface => {
    let lionConquerAttempt: lionConquerAttemptInterface = {
        success: undefined,
        conqueringPlayerId: undefined,
        conqueredPlayerId: undefined
    };
    if (stoneData!.type === "LION" && !amIOpponent) {
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        console.log('lion target coordinate', targetCoordinate);
        if (targetCoordinate in lionConquerFields.creator) {
            let opponentStones = stones.filter((stone) => stone.currentOwner !== stoneData!.currentOwner && !stone.stashed);
            console.log('opponentStones', opponentStones);
            console.log('nearby fields of lion target position', lionConquerFields.creator[targetCoordinate]);
            let nearbyOpponentStones = opponentStones.filter((stone) => lionConquerFields.creator[targetCoordinate].includes(`${stone.positionLetter}${stone.positionNumber}`));
            console.log('nearbyOpponentStones', nearbyOpponentStones);
            let endangeringOpponentStones = nearbyOpponentStones.filter((stone) => {
                if (stone.type === "CHICKEN" || stone.type === "HEN") {
                    return stoneMovements[stone.type].opponent[`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
                } else {
                    return stoneMovements[stone.type][`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
                }
            });
            console.log('endangeringOpponentStones', endangeringOpponentStones);
            lionConquerAttempt = {
                success: endangeringOpponentStones.length === 0,
                conqueringPlayerId: stoneData!.currentOwner,
                conqueredPlayerId: opponentStones[0].currentOwner,
            };
        }
    } else if (stoneData!.type === "LION" && amIOpponent) {
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        console.log('lion target coordinate', targetCoordinate);
        if (targetCoordinate in lionConquerFields.opponent) {
            let opponentStones = stones.filter((stone) => stone.currentOwner !== stoneData!.currentOwner && !stone.stashed);
            console.log('opponentStones', opponentStones);
            console.log('nearby fields of lion target position', lionConquerFields.opponent[targetCoordinate]);
            let nearbyOpponentStones = opponentStones.filter((stone) => lionConquerFields.opponent[targetCoordinate].includes(`${stone.positionLetter}${stone.positionNumber}`));
            console.log('nearbyOpponentStones', nearbyOpponentStones);
            let endangeringOpponentStones = nearbyOpponentStones.filter((stone) => {
                if (stone.type === "CHICKEN" || stone.type === "HEN") {
                    return stoneMovements[stone.type].creator[`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
                } else {
                    return stoneMovements[stone.type][`${stone.positionLetter}${stone.positionNumber}`].includes(targetCoordinate);
                }
            });
            console.log('endangeringOpponentStones', endangeringOpponentStones);
            lionConquerAttempt = {
                success: endangeringOpponentStones.length === 0,
                conqueringPlayerId: stoneData!.currentOwner,
                conqueredPlayerId: opponentStones[0].currentOwner,
            };
        }
    }
    return lionConquerAttempt;
};
