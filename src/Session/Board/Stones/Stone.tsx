import React from "react";
import ChickenImg from "./images/chicken.png";
import ElephantImg from "./images/elephant.png";
import GiraffeImg from "./images/giraffe.png";
import LionImg from "./images/lion.png";
import styles from "./Stone.module.css";

export const Stone = () => {
  return <div style={{ backgroundImage: `url(${GiraffeImg})` }} className={styles.Stone}></div>;
};
