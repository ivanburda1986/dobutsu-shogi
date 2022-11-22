import { FC } from "react";
import { getImgReference } from "../images/imageRelatedService";
import styles from "./Avatar.module.css";

interface AvatarProps {
    name: string | null;
    small?: boolean;
    big?: boolean;
    playerInterface?: boolean;
}

export const Avatar: FC<AvatarProps> = ({name, small, big, playerInterface}) => {
    return <div
        className={`${styles.avatar} ${small && styles.avatarSmall} ${big && styles.avatarBig} ${playerInterface && styles.playerInterfaceAvatar}  d-flex flex-row justify-content-between align-items-center`}
        style={{backgroundImage: `url(${getImgReference(name)})`}}/>;
};

