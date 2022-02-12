interface rotateOponentUI {
  creatorId: string;
  loggedInUserUserId: string;
}
export const rotateOponentUI = ({ creatorId, loggedInUserUserId }: rotateOponentUI) => {
  if (creatorId === loggedInUserUserId) {
    return 0;
  }
  return 180;
};
