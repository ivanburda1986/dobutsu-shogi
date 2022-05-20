import CHICKEN from "./images/chicken.png";
import ELEPHANT from "./images/elephant.png";
import GIRAFFE from "./images/giraffe.png";
import LION from "./images/lion.png";
import {stoneMovements} from "./StoneMovements";
import {stoneType} from "./Stone";


export const getStashTargetPosition = () => {
    
};


interface canStoneMoveThisWayInterface {
    stoneType: stoneType;
    movedFromLetter: string;
    movedFromNumber: number;
    movingToLetter: string;
    movingToNumber: number;
    amIOpponent: boolean;
}

export const canStoneMoveThisWay = ({
                                        stoneType,
                                        movedFromLetter,
                                        movedFromNumber,
                                        movingToLetter,
                                        movingToNumber,
                                        amIOpponent,
                                    }: canStoneMoveThisWayInterface) => {

    if (stoneType === "CHICKEN") {
        const originatingCoordinate = `${movedFromLetter}${movedFromNumber}`;
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        console.log('amIOpponent', amIOpponent);
        const allowedLetters = stoneMovements.CHICKEN[amIOpponent ? 'opponent' : 'creator'][originatingCoordinate];
        // console.log(allowedLetters.includes(targetCoordinate));
        return allowedLetters.includes(targetCoordinate);
    }
    if (stoneType === "GIRAFFE") {
        const originatingCoordinate = `${movedFromLetter}${movedFromNumber}`;
        const targetCoordinate = `${movingToLetter}${movingToNumber}`;
        const allowedLetters = stoneMovements.GIRAFFE[originatingCoordinate];
        // console.log(allowedLetters.includes(targetCoordinate));
        return allowedLetters.includes(targetCoordinate);
    }
    if (stoneType === "ELEPHANT") {
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
    return LION;
};
