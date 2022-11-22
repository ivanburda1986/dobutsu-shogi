import React, {FC} from "react";
import { getImgReference } from "../../../images/imageRelatedService";
import styles from "./StashField.module.css";


interface FieldInterface {
    columnLetter: string;
    amIOpponent: boolean;
}

export const StashField: FC<FieldInterface> = ({ columnLetter, amIOpponent}) => {
    return (
        <div style={{
            backgroundImage: `url(${getImgReference(columnLetter)})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: '0.1'
        }}>
            <div
                data-number="1"
                data-letter={columnLetter}
                className={`${styles.Field} noselect`}
            />
        </div>
    );
};
