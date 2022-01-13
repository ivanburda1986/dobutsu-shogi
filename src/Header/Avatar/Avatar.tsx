import React from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name }) => {
  return (
    <button className={`${styles.avatar} d-flex flex-row justify-content-between align-items-center`}>
      <div className={`${styles.avatarIco} d-flex flex-row justify-content-between align-items-center`} style={{ backgroundImage: `url("images/${name}.png")` }}></div>
    </button>
  );
};
