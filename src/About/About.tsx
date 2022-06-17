import React, {FC} from "react";
import {Container} from "react-bootstrap";

export const About: FC = () => {

    return (
        <Container>
            <h2>About this site</h2>
            <p>This site has been created for two reasons:</p>
            <ul>
                <li>a programming exercise</li>
                <li>a chance to play Dobutsu Shogi online with my brother</li>
            </ul>
            <p>This is a hobbyist activity neither with an aim of attracting any broader audience nor with a pursuit of
                any financial
                profits.</p>
            <p>Should there be any concerns of copyright infringements, <a href="mailto:burda.ivan@protonmail.com">get
                in
                touch</a> with me.</p>
            <p>If you wish to support creators of the Animal Shogi game, buy the physical version <a
                className="link" href="http://shop.nekomado.com/products/detail.php?product_id=135"
                target="_blank" rel="noreferrer">here</a> or <a className="link"
                                                                href="https://www.shogi.cz/en/offer/game-sets.html"
                                                                target="_blank" rel="noreferrer">here</a>.</p>
        </Container>
    );
};