import {FC} from "react";
import boar from "../../images/boar.png";
import cat from "../../images/cat.png";
import chicken from "../../images/chicken.png";
import dog from "../../images/dog.png";
import elephant from "../../images/elephant.png";
import giraffe from "../../images/giraffe.png";
import hen from "../../images/hen.png";
import lion from "../../images/lion.png";
import placeholder from "../../images/placeholder.png";
import rabbit from "../../images/rabbit.png";
import styles from "./RecentMoveStone.module.css";

interface Props {
    name: string | null;
}

export const RecentMoveStone: FC<Props> = ({name}) => {
    return <div
        className={`${styles.recentMoveStone} d-flex flex-row justify-content-between align-items-center`}
        style={{backgroundImage: `url(${getImgReference(name)})`}}/>;
};

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

