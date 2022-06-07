import {FunctionComponent} from "react";
import styles from "./StoneStashCount.module.css";

interface Props {
    count: number;
}

export const StoneStashCount: FunctionComponent<Props> = ({count}) => {
    return (
        <div
            className={`${styles.StoneStashCount} d-flex justify-content-center align-items-center bg-danger rounded-pill text-center lh-1 align-middle mx-auto`}
        >{count}</div>
    );
};