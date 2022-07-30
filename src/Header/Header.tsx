import {FC, useContext} from "react";


import {appContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {MobileNavigation} from "./MobileNavigation/MobileNavigation";
import {Navigation} from "./Navigation/Navigation";

export const Header: FC = () => {
    const {
        userLoggedIn,
        loggedInUserDisplayName,
        loggedInUserPhotoURL
    }: appContextInterface = useContext(AppContext);


    return (<>
            <MobileNavigation userLoggedIn={userLoggedIn} loggedInUserDisplayName={loggedInUserDisplayName}
                              loggedInUserPhotoURL={loggedInUserPhotoURL}/>
            <Navigation userLoggedIn={userLoggedIn} loggedInUserDisplayName={loggedInUserDisplayName}
                        loggedInUserPhotoURL={loggedInUserPhotoURL}/>
        </>
    );
};
