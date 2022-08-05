import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../api/firestore";
import {Dispatch} from "react";
import {PlayerGameStats} from "./Profile";

export const shouldBeChecked = (avatarOptionName: string, loggedInUserPhotoURL: string | null) => {
    return loggedInUserPhotoURL === avatarOptionName;
};

export const getPlayerGameStats = (loggedInUserUserId: string, cb: Dispatch<PlayerGameStats>) => {
    const docRef = doc(db, "stats", loggedInUserUserId);
    onSnapshot(docRef, (doc) => {
        cb({
            wins: (doc.data()?.win),
            losses: (doc.data()?.loss),
            ties: (doc.data()?.tie)
        });
    });
};