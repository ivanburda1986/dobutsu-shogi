import CHICKEN from "./images/chicken.png";
import ELEPHANT from "./images/elephant.png";
import GIRAFFE from "./images/giraffe.png";
import LION from "./images/lion.png";
import HEN from "./images/hen.png"

import {chickenTurningToHenCoordinates, stoneMovements} from "./StoneMovements";
import {stoneType} from "./Stone";

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
    movingToLetter: string;
    movingToNumber: number;
}

export const shouldChickenTurnIntoHen = ({
                                             amIOpponent,
                                             stashed,
                                             movingToLetter,
                                             movingToNumber
                                         }: shouldChickenTurnIntoHenInterface) => {
    if (stashed) {
        return false;
    }

    if (amIOpponent && chickenTurningToHenCoordinates.opponent.includes(`${movingToLetter}${movingToNumber}`)) {
        return true;
    }

    return !amIOpponent && chickenTurningToHenCoordinates.creator.includes(`${movingToLetter}${movingToNumber}`);
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
        console.log(allowedLetters.includes(targetCoordinate));
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
    targetPositionLetter: string;
    targetPositionNumber: number;
    positionX: number;
    setPositionX: (position: number) => void;
    positionY: number;
    setPositionY: (position: number) => void;
}


export const useSetStonePosition = ({
                                        stoneId,
                                        targetPositionLetter,
                                        targetPositionNumber,
                                        positionX,
                                        setPositionX,
                                        positionY,
                                        setPositionY
                                    }: useSetStonePositionInterface) => {
    let targetPosition = document.querySelector(`[data-letter="${targetPositionLetter}"][data-number="${targetPositionNumber}"]`);
    let rect = targetPosition?.getBoundingClientRect();

    setPositionX(Math.floor(rect!.left));
    setPositionY(Math.floor(rect!.top));
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
