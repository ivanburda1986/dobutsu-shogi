import {FC} from "react";
import { getImgReference } from "../../images/imageRelatedService";
import styles from "./RecentMoveStone.module.css";

interface Props {
    name: string | null;
}

export const RecentMoveStone: FC<Props> = ({name}) => {
    return <div
        className={`${styles.recentMoveStone} d-flex flex-row justify-content-between align-items-center`}
        style={{backgroundImage: `url(${getImgReference(name)})`}}/>;
};


