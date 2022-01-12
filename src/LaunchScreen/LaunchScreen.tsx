import React from "react";
import { Button } from "../components/Button/Button";
import styles from "./LaunchScreen.module.css";
import sharedStyles from "../sharedStyles.module.css";

export const LaunchScreen: React.FC = () => {
  return (
    <div className={styles.launchScreen}>
      Lanchscreen
      <Button name="Login" />
      <Button name="Register" />
    </div>
  );
};
