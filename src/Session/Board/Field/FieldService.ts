const rowNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

interface isLabelVisibleInterface {
  rowNumber: number;
  columnLetter: string;
}
export const isLetterLabelVisible = ({ rowNumber, columnLetter }: isLabelVisibleInterface) => {
  if (rowNumber === 1 && columnLetters.includes(columnLetter)) {
    return true;
  }
};
export const isNumberLabelVisible = ({ rowNumber, columnLetter }: isLabelVisibleInterface) => {
  if (columnLetter === "A" && rowNumbers.includes(rowNumber)) {
    return true;
  }
};
