import React, {FunctionComponent, useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

import {db, updatePlayerAvatarInGames, useUpdateUserProfile} from "../api/firestore";
import {AppContext} from "../context/AppContext";
import {appContextInterface} from "../App";
import {Avatar} from "../Header/Avatar/Avatar";
import {getPlayerGameStats, shouldBeChecked} from "./ProfileService";

export interface PlayerGameStats {
    wins: number,
    losses: number,
    ties: number,
}

export const Profile: FunctionComponent = () => {
    const {
        loggedInUserPhotoURL,
        loggedInUserDisplayName,
        loggedInUserUserId,
        setUserData
    }: appContextInterface = useContext(AppContext);
    const updateUserProfile = useUpdateUserProfile;

    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(loggedInUserPhotoURL);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const usernameRef = useRef<HTMLInputElement>(null);

    const [stats, setStats] = useState<PlayerGameStats>({wins: 0, losses: 0, ties: 0});


    useEffect(() => {
        if (!loggedInUserPhotoURL || !loggedInUserDisplayName) {
            setIsEditingProfile(true);
        }
    }, [loggedInUserPhotoURL, loggedInUserDisplayName]);

    useEffect(() => {
        if (!loggedInUserUserId || !db) {
            return;
        }
        getPlayerGameStats(loggedInUserUserId, setStats);
    }, [loggedInUserUserId,]);

    const onSubmitHandler = () => {
        const newUsername = usernameRef.current?.value;
        updateUserProfile({
            displayName: newUsername ? newUsername : loggedInUserDisplayName,
            photoURL: selectedAvatar,
            cb: setUserData
        });
        updatePlayerAvatarInGames({
            playerId: loggedInUserUserId,
            updatedAvatar: selectedAvatar
        }).then(response => console.log('Avatar updated in player games'));
        setIsEditingProfile(false);
    };

    return (
        <Container className="text-success">
            <h2>Avatar and username</h2>
            {isEditingProfile && (
                <Container fluid className="rounded py-1 mb-3 transparentContainer">
                    <Row>
                        <Form onSubmit={onSubmitHandler}>
                            <Form.Group className="mb-3" controlId="formAvatarSelection">
                                <Form.Label>Select an avatar</Form.Label>
                                {["radio"].map(() => (
                                    <div key={`inline-radio`} className="mb-3">
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("chicken", loggedInUserPhotoURL)}
                                                    label={<Avatar name="chicken"/>} name="group1" type="radio"
                                                    id={`chicken`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("boar", loggedInUserPhotoURL)}
                                                    label={<Avatar name="boar"/>} name="group1" type="radio" id={`boar`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("dog", loggedInUserPhotoURL)}
                                                    label={<Avatar name="dog"/>} name="group1" type="radio"
                                                    id={`dog`} onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("hen", loggedInUserPhotoURL)}
                                                    label={<Avatar name="hen"/>} name="group1" type="radio"
                                                    id={`hen`} onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("cat", loggedInUserPhotoURL)}
                                                    label={<Avatar name="cat"/>} name="group1" type="radio" id={`cat`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("rabbit", loggedInUserPhotoURL)}
                                                    label={<Avatar name="rabbit"/>} name="group1" type="radio"
                                                    id={`rabbit`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("elephant", loggedInUserPhotoURL)}
                                                    label={<Avatar name="elephant"/>} name="group1" type="radio"
                                                    id={`elephant`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("giraffe", loggedInUserPhotoURL)}
                                                    label={<Avatar name="giraffe"/>} name="group1" type="radio"
                                                    id={`giraffe`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("lion", loggedInUserPhotoURL)}
                                                    label={<Avatar name="lion"/>} name="group1" type="radio" id={`lion`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                    </div>
                                ))}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Set a username</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={usernameRef}
                                    value={usernameInput}
                                    placeholder={loggedInUserDisplayName ? loggedInUserDisplayName : "Username"}
                                    onChange={() => {
                                        setUsernameInput(usernameRef.current!.value);
                                    }}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                Save
                            </Button>
                        </Form>
                    </Row>
                </Container>
            )}
            {!isEditingProfile && (
                <Container fluid className="rounded py-1 my-1 mb-3 transparentContainer">
                    <Row>
                        <Col className="d-flex flex-row justify-content-between align-items-center">
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <Avatar name={loggedInUserPhotoURL}/>
                                <p className="fs-4 mx-2 align-middle my-auto">{loggedInUserDisplayName ? loggedInUserDisplayName : "Username"}</p>
                            </div>
                            <Button
                                className="btn-height-40 justify-content-center"
                                onClick={() => {
                                    setIsEditingProfile(true);
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
                    <td>{stats.wins}</td>
                    <td>{stats.losses}</td>
                    <td>{stats.ties}</td>
                </tr>
                </tbody>
            </table>
        </Container>
    );
};
