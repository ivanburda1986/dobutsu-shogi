import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  name: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}
export const Button: React.FC<ButtonProps> = ({ name, bgColor, borderColor, textColor }) => {
  return (
    <button className={styles.button} style={{ backgroundColor: `${bgColor}`, borderColor: `${borderColor}` }}>
      {name}
    </button>
  );
};
