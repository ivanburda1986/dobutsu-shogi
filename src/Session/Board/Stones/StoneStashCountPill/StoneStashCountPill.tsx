import { FC } from "react";
import styles from "./StoneStashCountPill.module.css";

interface Props {
  count: number;
}

export const StoneStashCountPill: FC<Props> = ({ count }) => {
  return (
    <div
      className={`${styles.StoneStashCount} d-flex justify-content-center align-items-center bg-danger rounded-pill text-center lh-1 align-middle mx-auto`}
    >
      {count}
    </div>
  );
};
