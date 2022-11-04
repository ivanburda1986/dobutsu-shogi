import React, {FC} from "react";
import {Container} from "react-bootstrap";

export const About: FC = () => {
    return (
        <Container className="text-success">
            <h2>How to play111</h2>
            <ul>
                <li><p>Watch <a className="link-primary" href="https://www.youtube.com/watch?v=bH05gUTrq3o"
                                target="_blank" rel="noreferrer">this video</a> to learn rules of Dobutsu Shogi.</p>
                </li>
                <li><p>Visit <a className="link-primary" href="https://www.shogi.cz/en/about-shogi"
                                target="_blank" rel="noreferrer">this page</a> to learn more about Shogi.</p></li>
            </ul>

            <h2>About this site 222</h2>
            <p>This site has been created for two reasons:</p>
            <ul>
                <li>a programming exercise</li>
                <li>a chance to play Dobutsu Shogi online with my brother and friends</li>
            </ul>
            <p>This is a hobbyist activity neither with an aim of attracting any considerable audience nor with a
                pursuit of
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