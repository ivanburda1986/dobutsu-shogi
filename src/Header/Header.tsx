import {FC, useContext} from "react";
import {AppContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {Navigation} from "./Navigation/Navigation";
import {MobileNavigation} from "./MobileNavigation/MobileNavigation";

export const Header: FC = () => {
    const {
        userLoggedIn,
        loggedInUserDisplayName,
        loggedInUserPhotoURL
    }: AppContextInterface = useContext(AppContext);

    return (<>
            <MobileNavigation userLoggedIn={userLoggedIn}
                              loggedInUserPhotoURL={loggedInUserPhotoURL}/>
            <Navigation userLoggedIn={userLoggedIn} loggedInUserDisplayName={loggedInUserDisplayName}
                        loggedInUserPhotoURL={loggedInUserPhotoURL}/>
        </>
    );
};
