import React, { FC } from "react";
import { getImgReference } from "../../../images/imageRelatedService";
import styles from "./StashField.module.css";

interface Props {
  columnLetter: string;
}

export const StashField: FC<Props> = ({ columnLetter }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${getImgReference(columnLetter)})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        opacity: "0.1",
      }}
    >
      <div
        data-row-number="1"
        data-column-letter={columnLetter}
        className={`${styles.StashField} noselect`}
      />
    </div>
  );
};
