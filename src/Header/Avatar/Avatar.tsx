import React from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name }) => {
  return <button className={styles.avatar} style={{ backgroundImage: `url("images/${name}.png")` }}></button>;
};
