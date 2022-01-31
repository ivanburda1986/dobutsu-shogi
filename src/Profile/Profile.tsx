import React from "react";
import { useUpdateUserProfile } from "../api/firestore";

export const Profile: React.FC = () => {
  const updateUserProfile = useUpdateUserProfile;
  React.useEffect(() => {
    updateUserProfile({ displayName: "Ivanek Burda", photoURL: "https://www.nugo.cz/user/articles/images/jorksirsky-terier.jpg" });
  }, []);
  return (
    <div className="container-lg my-3">
      <h2>Profile</h2>
    </div>
  );
};
