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

    if(!name){
        return placeholder;
    }

    const lowerCasedName = name.toLowerCase()
    if (lowerCasedName.includes( "boar")) return boar;
    if (lowerCasedName.includes( "cat")) return cat;
    if (lowerCasedName.includes( "dog")) return dog;
    if (lowerCasedName.includes( "elephant")) return elephant;
    if (lowerCasedName.includes( "giraffe")) return giraffe;
    if (lowerCasedName.includes( "chicken")) return chicken;
    if (lowerCasedName.includes( "hen")) return hen;
    if (lowerCasedName.includes( "lion")) return lion;
    if (lowerCasedName.includes( "rabbit")) return rabbit;
};