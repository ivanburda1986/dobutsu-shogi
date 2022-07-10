import React, {FC} from "react";
import boar from "./images/boar.png";
import cat from "./images/cat.png";
import chicken from "./images/chicken.png";
import hen from "./images/hen.png";
import dog from "./images/dog.png";
import elephant from "./images/elephant.png";
import giraffe from "./images/giraffe.png";
import lion from "./images/lion.png";
import rabbit from "./images/rabbit.png";
import placeholder from "./images/placeholder.png";
import styles from "./Avatar.module.css";

interface AvatarProps {
    name: string | null;
    small?: boolean;
    medium?: boolean;
    square?: boolean;
}

export const Avatar: FC<AvatarProps> = ({name, small, medium, square}) => {
    return <div
        className={`${styles.avatarNormal} ${small && styles.avatarSmall} ${medium && styles.avatarMedium} ${square && styles.avatarSquare} d-flex flex-row justify-content-between align-items-center`}
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
    if (name === "hen") return hen;
    if (name === "lion") return lion;
    if (name === "rabbit") return rabbit;
    return placeholder;
};

