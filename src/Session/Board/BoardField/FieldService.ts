import React from "react";

interface shouldShowLabelInterface {
  rowNumber: number;
  columnLetter: string;
}

export const shouldShowLetterLabel = ({
  rowNumber,
  columnLetter,
}: shouldShowLabelInterface) => {
  const LABELLED_ROW_NUMBER = 1;
  const COLUMN_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  if (
    rowNumber === LABELLED_ROW_NUMBER &&
    COLUMN_LETTERS.includes(columnLetter)
  ) {
    return true;
  }
};

export const shouldShowNumberLabel = ({
  rowNumber,
  columnLetter,
}: shouldShowLabelInterface) => {
  const LABELLED_COLUMN_LETTER = "A";
  const ROW_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (
    columnLetter === LABELLED_COLUMN_LETTER &&
    ROW_NUMBERS.includes(rowNumber)
  ) {
    return true;
  }
};

export const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

export const rotateField = (amIOpponent: boolean): number => {
  if (amIOpponent) {
    return 180;
  }

  return 0;
};
