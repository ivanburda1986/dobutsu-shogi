import React from "react";
import { Button } from "../components/Button/Button";
import styles from "../sharedStyles.module.css";

export const LaunchScreen = () => {
  return (
    <div>
      <Button name="Register" />
      <Button name="Login" />
    </div>
  );
};
