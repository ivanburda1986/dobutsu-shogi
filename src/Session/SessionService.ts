interface evaluateBeingOpponentInterface {
  creatorId: string;
  loggedInUserUserId: string;
}
export const evaluateBeingOpponent = ({ creatorId, loggedInUserUserId }: evaluateBeingOpponentInterface) => {
  if (!creatorId || !loggedInUserUserId) {
    return 0;
  }
  if (creatorId === loggedInUserUserId) {
    return 0;
  }
  if (creatorId !== loggedInUserUserId) {
    return 180;
  }

  return 0;
};
