import React, {FunctionComponent} from "react";
import sadpanda from "../../images/sadPanda.jpeg";
import styles from "./SadPanda.module.css";

export const SadPanda: FunctionComponent = () => {
    return (
        <div className="d-flex justify-content-center align-items-center">

            <img src={sadpanda}
                 className={`${styles.sadPanda} me-3`}
                 alt="this is car image"/>
            <span className={`${styles.sadPandaText} p-4 d-flex justify-content-center align-items-center flex-column`}>
                <div>
                <h4>I think it looks pretty sad here ... </h4>
            </div>
            <p>What about you creating a new game?</p>
            </span>
        </div>
    );
};