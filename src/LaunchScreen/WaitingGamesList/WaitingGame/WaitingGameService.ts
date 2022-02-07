import { gameType } from "../../../api/firestore";
import { ProvidedContextInterface } from "../../../App";

export const whichBackroundToUse = (type: gameType) => {
  if (type === "DOBUTSU") {
    return "success";
  }
  if (type === "GOROGORO") {
    return "warning";
  }
  return "danger";
};

export const displayDeleteOption = ({ creatorId, appContext }: { creatorId: string; appContext: ProvidedContextInterface }) => {
  if (creatorId === appContext.loggedInUserUserId) {
    return true;
  }
  return false;
};
