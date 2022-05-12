import CHICKEN from "./images/chicken.png";
import ELEPHANT from "./images/elephant.png";
import GIRAFFE from "./images/giraffe.png";
import LION from "./images/lion.png";
import {stoneType} from "../../../api/firestore";


interface canStoneMoveThisWayInterface {
    stoneType: stoneType;
    movedFromLetter: string;
    movedFromNumber: number;
    movingToLetter: string;
    movingToNumber: number;
    isRotated: boolean;
}

export const canStoneMoveThisWay = ({
                                        stoneType,
                                        movedFromLetter,
                                        movedFromNumber,
                                        movingToLetter,
                                        movingToNumber,
                                        isRotated,
                                    }: canStoneMoveThisWayInterface) => {
    const letters = ["A", "B", "C"];
    const numbers = [1, 2, 3, 4];

    if (stoneType === "CHICKEN") {
        const allowedLetters = movedFromLetter;
        // console.log("allowedLetters", allowedLetters);
        let allowedNumbers = [];
        // console.log("movedFromNumber", movedFromNumber);
        isRotated ? allowedNumbers.push(movedFromNumber - 1) : allowedNumbers.push(movedFromNumber + 1);
        // console.log("allowedNumbers", allowedNumbers);
        // console.log('movingToLetter', movingToLetter);
        // console.log('movingToNumber', movingToNumber);
        // console.log(allowedLetters.includes(movingToLetter) && allowedNumbers.includes(movingToNumber)) ;
        return (allowedLetters.includes(movingToLetter) && allowedNumbers.includes(movingToNumber));
    }
    if (stoneType === "GIRAFFE") {
        const allowedLetters = [letters[letters.indexOf(movedFromLetter) - 1], movedFromLetter, letters[letters.indexOf(movedFromLetter) + 1]];
        console.log("allowedLetters", allowedLetters);
        let allowedNumbers: number[] = [];
        console.log("movedFromNumber", movedFromNumber);
        isRotated ? allowedNumbers = [numbers[numbers.indexOf(movedFromNumber) - 1], movedFromNumber, numbers[numbers.indexOf(movedFromNumber) + 1]] : allowedNumbers = [numbers[numbers.indexOf(movedFromNumber) + 1], movedFromNumber, numbers[numbers.indexOf(movedFromNumber) - 1]];
        console.log("allowedNumbers", allowedNumbers);
        // console.log('movingToLetter', movingToLetter);
        // console.log('movingToNumber', movingToNumber);
        // console.log(allowedLetters.includes(movingToLetter) && allowedNumbers.includes(movingToNumber)) ;
        return (allowedLetters.includes(movingToLetter) && allowedNumbers.includes(movingToNumber));
    }

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

//test

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
