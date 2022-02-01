import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useUpdateUserProfile } from "../api/firestore";
import { Avatar } from "../Header/Avatar/Avatar";
import styles from "./Profile.module.css";

export const Profile: React.FC = () => {
  const updateUserProfile = useUpdateUserProfile;

  return (
    <div className="container-lg my-3">
      <h2>Avatar and username</h2>
      <Container fluid className={`rounded py-1 ${styles.profileSectionContainer}`}>
        <Row>
          <Col className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center">
              <Avatar name="lion" />
              <p className="fs-4 mx-2 align-middle my-auto">Ivanek</p>
            </div>
            <Button className={`${styles.profileSetupBtn} justify-content-center`}>Change</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
