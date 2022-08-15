import chicken from "../../../images/chicken.png";
import elephant from "../../../images/elephant.png";
import giraffe from "../../../images/giraffe.png";
import placeholder from "../../../images/placeholder.png";


export const getImgReference = (name: string | null) => {
    if (name === "CREATOR-ELEPHANT" || name === "OPPONENT-ELEPHANT") return elephant;
    if (name === "CREATOR-GIRAFFE" || name === "OPPONENT-GIRAFFE") return giraffe;
    if (name === "CREATOR-CHICKEN" || name === "OPPONENT-CHICKEN") return chicken;
    return placeholder;
};

