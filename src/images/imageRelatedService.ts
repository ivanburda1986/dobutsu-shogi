import boar from "./boar.png";
import cat from "./cat.png";
import dog from "./dog.png";
import elephant from "./elephant.png";
import giraffe from "./giraffe.png";
import chicken from "./chicken.png";
import hen from "./hen.png";
import lion from "./lion.png";
import rabbit from "./rabbit.png";
import placeholder from "./placeholder.png";

export const getImgReference = (name: string | null) => {
    if (name === "boar") return boar;
    if (name === "cat") return cat;
    if (name === "dog") return dog;
    if (name === "elephant") return elephant;
    if (name === "giraffe") return giraffe;
    if (name === "chicken") return chicken;
    if (name === "hen") return hen;
    if (name === "lion") return lion;
    if (name === "rabbit") return rabbit;
    return placeholder;
};