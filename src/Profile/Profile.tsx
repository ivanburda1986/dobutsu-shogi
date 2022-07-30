import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

import {db, updatePlayerAvatarInGames, useUpdateUserProfile} from "../api/firestore";
import {AppContext} from "../context/AppContext";
import {appContextInterface} from "../App";
import {Avatar} from "../Header/Avatar/Avatar";
import {doc, onSnapshot} from "firebase/firestore";

export const Profile: FC = () => {
    const appContext: appContextInterface = useContext(AppContext);
    const [avatarUsernameEditModeOn, setAvatarUsernameEditModeOn] = useState<boolean>(false);
    const [avatarImgSelection, setAvatarImgSelection] = useState<string | null>(appContext.loggedInUserPhotoURL);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [wins, setWins] = useState<number>(0);
    const [losses, setLosses] = useState<number>(0);
    const [ties, setTies] = useState<number>(0);
    const updateUserProfile = useUpdateUserProfile;

    const shouldBeChecked = (optionName: string) => {
        return appContext.loggedInUserPhotoURL === optionName;
    };

    useEffect(() => {
        if (!appContext.loggedInUserPhotoURL || !appContext.loggedInUserDisplayName) {
            setAvatarUsernameEditModeOn(true);
        }
    }, [appContext.loggedInUserDisplayName, appContext.loggedInUserPhotoURL]);

    useEffect(() => {
        //Listening to change of the player stats
        if (!appContext.loggedInUserUserId || !db) {
            return;
        }
        const docRef = doc(db, "stats", appContext.loggedInUserUserId);
        onSnapshot(docRef, (doc) => {
            setWins(doc.data()?.win);
            setLosses(doc.data()?.loss);
            setTies(doc.data()?.tie);
        });
    }, [appContext.loggedInUserUserId]);

    return (
        <Container className="text-success">
            <h2>Avatar and username</h2>
            {avatarUsernameEditModeOn && (
                <Container fluid className="rounded py-1 mb-3 transparentContainer">
                    <Row>
                        <Form>
                            <Form.Group className="mb-3" controlId="formAvatarSelection">
                                <Form.Label>Select an avatar</Form.Label>
                                {["radio"].map(() => (
                                    <div key={`inline-radio`} className="mb-3">
                                        <Form.Check inline defaultChecked={shouldBeChecked("chicken")}
                                                    label={<Avatar name="chicken"/>} name="group1" type="radio"
                                                    id={`chicken`}
                                                    onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("boar")}
                                                    label={<Avatar name="boar"/>} name="group1" type="radio" id={`boar`}
                                                    onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("dog")}
                                                    label={<Avatar name="dog"/>} name="group1" type="radio"
                                                    id={`dog`} onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("hen")}
                                                    label={<Avatar name="hen"/>} name="group1" type="radio"
                                                    id={`hen`} onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("cat")}
                                                    label={<Avatar name="cat"/>} name="group1" type="radio" id={`cat`}
                                                    onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("rabbit")}
                                                    label={<Avatar name="rabbit"/>} name="group1" type="radio"
                                                    id={`rabbit`}
                                                    onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("elephant")}
                                                    label={<Avatar name="elephant"/>} name="group1" type="radio"
                                                    id={`elephant`}
                                                    onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("giraffe")}
                                                    label={<Avatar name="giraffe"/>} name="group1" type="radio"
                                                    id={`giraffe`}
                                                    onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                        <Form.Check inline defaultChecked={shouldBeChecked("lion")}
                                                    label={<Avatar name="lion"/>} name="group1" type="radio" id={`lion`}
                                                    onChange={(e) => setAvatarImgSelection(e.target.id)}/>
                                    </div>
                                ))}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Set a username</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={usernameRef}
                                    value={usernameInput}
                                    placeholder={appContext.loggedInUserDisplayName ? appContext.loggedInUserDisplayName : "Username"}
                                    onChange={() => {
                                        setUsernameInput(usernameRef.current!.value);
                                    }}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={() => {
                                    updateUserProfile({
                                        displayName: usernameRef.current?.value ? usernameRef.current.value : appContext.loggedInUserDisplayName,
                                        photoURL: avatarImgSelection,
                                        cb: appContext.setUserData
                                    });
                                    updatePlayerAvatarInGames({
                                        playerId: appContext.loggedInUserUserId,
                                        updatedAvatar: avatarImgSelection
                                    }).then(response => console.log('avatar updated in player games'));
                                    setAvatarUsernameEditModeOn(false);
                                }}
                            >
                                Save
                            </Button>
                        </Form>
                    </Row>
                </Container>
            )}
            {!avatarUsernameEditModeOn && (
                <Container fluid className="rounded py-1 my-1 mb-3 transparentContainer">
                    <Row>
                        <Col className="d-flex flex-row justify-content-between align-items-center">
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <Avatar name={appContext.loggedInUserPhotoURL}/>
                                <p className="fs-4 mx-2 align-middle my-auto">{appContext.loggedInUserDisplayName ? appContext.loggedInUserDisplayName : "Username"}</p>
                            </div>
                            <Button
                                className="btn-height-40 justify-content-center"
                                onClick={() => {
                                    setAvatarUsernameEditModeOn(true);
                                }}
                            >
                                Change
                            </Button>
                        </Col>
                    </Row>
                </Container>
            )}
            <h2>Game statistics</h2>
            <table className="table text-success">
                <thead>
                <tr>
                    <th scope="col">Wins</th>
                    <th scope="col">Losses</th>
                    <th scope="col">Ties</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{wins}</td>
                    <td>{losses}</td>
                    <td>{ties}</td>
                </tr>
                </tbody>
            </table>
        </Container>
    );
};
