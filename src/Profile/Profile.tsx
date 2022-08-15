import React, {FunctionComponent, useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

import {db, updatePlayerAvatarInGames, useUpdateUserProfile} from "../api/firestore";
import {AppContext} from "../context/AppContext";
import {AppContextInterface} from "../App";
import {Avatar} from "../Avatar/Avatar";
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
    }: AppContextInterface = useContext(AppContext);
    const updateUserProfile = useUpdateUserProfile;

    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(loggedInUserPhotoURL);
    const [usernameInput, setUsernameInput] = useState<string | undefined>(loggedInUserDisplayName ?? "");
    const [stats, setStats] = useState<PlayerGameStats>({wins: 0, losses: 0, ties: 0});
    const usernameRef = useRef<HTMLInputElement>(null);

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
        updateUserProfile({
            displayName: usernameRef.current?.value ?? loggedInUserDisplayName,
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
                                                    label={<Avatar name="chicken" big/>} name="AvatarSelection"
                                                    type="radio"
                                                    id={`chicken`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("boar", loggedInUserPhotoURL)}
                                                    label={<Avatar name="boar" big/>} name="AvatarSelection"
                                                    type="radio"
                                                    id={`boar`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("dog", loggedInUserPhotoURL)}
                                                    label={<Avatar name="dog" big/>} name="AvatarSelection" type="radio"
                                                    id={`dog`} onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("hen", loggedInUserPhotoURL)}
                                                    label={<Avatar name="hen" big/>} name="AvatarSelection" type="radio"
                                                    id={`hen`} onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("cat", loggedInUserPhotoURL)}
                                                    label={<Avatar name="cat" big/>} name="AvatarSelection" type="radio"
                                                    id={`cat`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("rabbit", loggedInUserPhotoURL)}
                                                    label={<Avatar name="rabbit" big/>} name="AvatarSelection"
                                                    type="radio"
                                                    id={`rabbit`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("elephant", loggedInUserPhotoURL)}
                                                    label={<Avatar name="elephant" big/>} name="AvatarSelection"
                                                    type="radio"
                                                    id={`elephant`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("giraffe", loggedInUserPhotoURL)}
                                                    label={<Avatar name="giraffe" big/>} name="AvatarSelection"
                                                    type="radio"
                                                    id={`giraffe`}
                                                    onChange={(e) => setSelectedAvatar(e.target.id)}/>
                                        <Form.Check inline
                                                    defaultChecked={shouldBeChecked("lion", loggedInUserPhotoURL)}
                                                    label={<Avatar name="lion" big/>} name="AvatarSelection"
                                                    type="radio"
                                                    id={`lion`}
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
                                    placeholder={loggedInUserDisplayName ?? "Username"}
                                    onChange={() => {
                                        setUsernameInput(usernameRef.current?.value);
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
                                <Avatar name={loggedInUserPhotoURL} big/>
                                <p className="fs-4 mx-2 align-middle my-auto">{loggedInUserDisplayName ?? "Username"}</p>
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
