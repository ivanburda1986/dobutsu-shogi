import React, { useContext, useRef } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useUpdateUserProfile } from "../api/firestore";
import { AppContext } from "../context/AppContext";
import { Avatar } from "../Header/Avatar/Avatar";
import styles from "./Profile.module.css";

export const Profile: React.FC = () => {
  const [avatarUsernameEditModeOn, setAvatarUsernameEditModeOn] = React.useState<boolean>(false);
  const [avatarImgSelection, setAvatarImgSelection] = React.useState<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const [usernameInput, setUsernameInput] = React.useState<string>("");
  const appContext = useContext(AppContext);

  const updateUserProfile = useUpdateUserProfile;

  const shouldBeChecked = (optionName: string) => {
    return appContext.loggedInUserAvatarImg === optionName;
  };

  return (
    <Container>
      <h2>Avatar and username</h2>
      {!avatarUsernameEditModeOn && (
        <Container fluid className={`rounded py-1 my-1 ${styles.profileSectionContainer}`}>
          <Row>
            <Col className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <Avatar name={appContext.loggedInUserAvatarImg} />
                <p className="fs-4 mx-2 align-middle my-auto">{appContext.loggedInUserUsername ? appContext.loggedInUserUsername : "Username"}</p>
              </div>
              <Button
                className={`${styles.profileSetupBtn} justify-content-center`}
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
      {avatarUsernameEditModeOn && (
        <Container fluid className={`rounded py-1 ${styles.profileSectionContainer}`}>
          <Row>
            <Form>
              <Form.Group className="mb-3" controlId="formAvatarSelection">
                <Form.Label>Select an avatar</Form.Label>
                {["radio"].map(() => (
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check inline defaultChecked={shouldBeChecked("chicken")} label={<Avatar name="chicken" />} name="group1" type="radio" id={`chicken`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                    <Form.Check inline defaultChecked={shouldBeChecked("boar")} label={<Avatar name="boar" />} name="group1" type="radio" id={`boar`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                    <Form.Check inline defaultChecked={shouldBeChecked("rabbit")} label={<Avatar name="rabbit" />} name="group1" type="radio" id={`rabbit`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                    <Form.Check inline defaultChecked={shouldBeChecked("cat")} label={<Avatar name="cat" />} name="group1" type="radio" id={`cat`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                    <Form.Check inline defaultChecked={shouldBeChecked("dog")} label={<Avatar name="dog" />} name="group1" type="radio" id={`dog`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                    <Form.Check inline defaultChecked={shouldBeChecked("elephant")} label={<Avatar name="elephant" />} name="group1" type="radio" id={`elephant`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                    <Form.Check inline defaultChecked={shouldBeChecked("giraffe")} label={<Avatar name="giraffe" />} name="group1" type="radio" id={`giraffe`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                    <Form.Check inline defaultChecked={shouldBeChecked("lion")} label={<Avatar name="lion" />} name="group1" type="radio" id={`lion`} onChange={(e) => setAvatarImgSelection(e.target.id)} />
                  </div>
                ))}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Set a username</Form.Label>
                <Form.Control
                  type="text"
                  ref={usernameRef}
                  value={usernameInput}
                  placeholder={appContext.loggedInUserUsername}
                  onChange={() => {
                    setUsernameInput(usernameRef.current!.value);
                  }}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={() => {
                  updateUserProfile({ displayName: usernameRef.current?.value ? usernameRef.current?.value : appContext.loggedInUserUsername, photoURL: avatarImgSelection, cb: appContext.setUserData });
                  setAvatarUsernameEditModeOn(false);
                }}
              >
                Save
              </Button>
            </Form>
          </Row>
        </Container>
      )}
    </Container>
  );
};
