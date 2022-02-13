interface evaluateBeingOpponentInterface {
  creatorId: string;
  loggedInUserUserId: string;
}
export const evaluateBeingOpponent = ({ creatorId, loggedInUserUserId }: evaluateBeingOpponentInterface) => {
  if (creatorId === loggedInUserUserId) {
    return 0;
  }
  return 180;
};
