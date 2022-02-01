import React from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name }) => {
  return <div className={`${styles.avatarIco} d-flex flex-row justify-content-between align-items-center`} style={{ backgroundImage: `url("images/${name}.png")` }}></div>;
};
