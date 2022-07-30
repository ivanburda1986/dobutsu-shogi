import {useEffect} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";

export const useRoute = (isUserLoggedIn: boolean) => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (isUserLoggedIn && location.pathname === "/login") {
            navigate("../", {replace: false});
            return;
        }
        if (isUserLoggedIn && location.pathname === "/register") {
            navigate("../", {replace: false});
            return;
        }
        if (!isUserLoggedIn && location.pathname === "/") {
            navigate("../login", {replace: false});
            return;
        }
    }, [isUserLoggedIn, navigate, location.pathname]);
};