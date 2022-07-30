import {FC, useContext} from "react";


import {AppContextInterface} from "../App";
import {AppContext} from "../context/AppContext";
import {MobileNavigation} from "./MobileNavigation/MobileNavigation";
import {Navigation} from "./Navigation/Navigation";

export const Header: FC = () => {
    const {
        isUserLoggedIn,
        loggedInUserDisplayName,
        loggedInUserPhotoURL
    }: AppContextInterface = useContext(AppContext);


    return (<>
            <MobileNavigation isUserLoggedIn={isUserLoggedIn} loggedInUserDisplayName={loggedInUserDisplayName}
                              loggedInUserPhotoURL={loggedInUserPhotoURL}/>
            <Navigation isUserLoggedIn={isUserLoggedIn} loggedInUserDisplayName={loggedInUserDisplayName}
                        loggedInUserPhotoURL={loggedInUserPhotoURL}/>
        </>
    );
};
