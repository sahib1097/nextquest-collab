
import React from "react";
import UserProfile from "@/components/Quests/UserProfile";
import { UserLevel } from "@/types/quest";

// Get user data from localStorage and create a UserLevel object for example
const getUserLevel = (): UserLevel => {
  const userLevelString = localStorage.getItem("fluxUserLevel");
  if (userLevelString) {
    try {
      return JSON.parse(userLevelString);
    } catch {
      // fallback default
      return {
        userId: "unknown",
        username: "User",
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        profilePicture: "",
      };
    }
  }
  return {
    userId: "unknown",
    username: "User",
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    profilePicture: "",
  };
};

const Profile = () => {
  const userLevel = getUserLevel();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <UserProfile userLevel={userLevel} publicProfile={false} />
    </div>
  );
};

export default Profile;
