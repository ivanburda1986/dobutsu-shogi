import {FunctionComponent} from "react";
import {Container} from "react-bootstrap";
import {NavLink} from "react-router-dom";

export const Footer: FunctionComponent = () => {
    return (
        <footer className="fixed-bottom">
            <Container>
                <ul className="nav justify-content-center text-si">
                    <li>
                        <a className="nav-link" href="https://www.youtube.com/watch?v=bH05gUTrq3o"
                           target="_blank" rel="noreferrer">Rules</a>
                    </li>
                    <li><NavLink to="/" className="btn fs-6">
                        Animal Shogi
                    </NavLink></li>
                    <li><NavLink to="/" className="btn fs-6">
                        About this site
                    </NavLink></li>
                </ul>
            </Container>
        </footer>
    );
};