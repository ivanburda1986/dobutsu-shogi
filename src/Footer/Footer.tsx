import {FunctionComponent} from "react";
import {Container} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import styles from './Footer.module.css';

export const Footer: FunctionComponent = () => {
    return (
        <footer className={`${styles.footer} fixed-bottom`}>
            <Container>
                <ul className="nav justify-content-center text-si">
                    <li>
                        <a className="nav-link link-success" href="https://www.youtube.com/watch?v=bH05gUTrq3o"
                           target="_blank" rel="noreferrer">Rules</a>
                    </li>
                    <li>
                        <a className="nav-link link-success" href="https://www.shogi.cz/en/about-shogi"
                           target="_blank" rel="noreferrer">Shogi</a>
                    </li>
                    <li><NavLink to="/about" className="btn fs-6 link-success">
                        This site
                    </NavLink></li>
                </ul>
            </Container>
        </footer>
    );
};