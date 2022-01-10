import React from "react";
import styles from "../sharedStyles.module.css";

export const LaunchScreen = () => {
  return (
    <div>
      <button className={styles.button}>Register</button>
      <button className={styles.button}>Login</button>
    </div>
  );
};
