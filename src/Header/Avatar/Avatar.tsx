import React, {FC} from "react";
import boar from "./images/boar.png";
import cat from "./images/cat.png";
import chicken from "./images/chicken.png";
import dog from "./images/rabbit.png";
import elephant from "./images/elephant.png";
import giraffe from "./images/giraffe.png";
import lion from "./images/lion.png";
import rabbit from "./images/rabbit.png";
import placeholder from "./images/placeholder.png";
import styles from "./Avatar.module.css";

interface AvatarProps {
    name: string | null;
}

export const Avatar: FC<AvatarProps> = ({name}) => {
    return <div className={`${styles.avatarIco} d-flex flex-row justify-content-between align-items-center`}
                style={{backgroundImage: `url(${getImgReference(name)})`}}/>;
};

export const getImgReference = (name: string | null) => {
    if (name === "CREATOR-ELEPHANT" || name === "OPPONENT-ELEPHANT") return elephant;
    if (name === "CREATOR-GIRAFFE" || name === "OPPONENT-GIRAFFE") return giraffe;
    if (name === "CREATOR-CHICKEN" || name === "OPPONENT-CHICKEN") return chicken;
    if (name === "boar") return boar;
    if (name === "cat") return cat;
    if (name === "dog") return dog;
    if (name === "elephant") return elephant;
    if (name === "giraffe") return giraffe;
    if (name === "chicken") return chicken;
    if (name === "lion") return lion;
    if (name === "rabbit") return rabbit;
    return placeholder;
};

