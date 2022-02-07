import React, { FC } from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string | null;
}

export const Avatar: FC<AvatarProps> = ({ name }) => {
  return <div className={`${styles.avatarIco} d-flex flex-row justify-content-between align-items-center`} style={{ backgroundImage: `url("images/${name ? name : "placeholder"}.png")` }}></div>;
};
