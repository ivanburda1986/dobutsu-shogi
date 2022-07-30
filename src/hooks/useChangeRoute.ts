import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";

export const useChangeRoute = (isUserLoggedIn: boolean) => {
    const navigate = useNavigate();
    const location = useLocation();
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
};