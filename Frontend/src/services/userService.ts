import api from "./api";
import { UserLevelResponse, UserXpAchievementsResponse } from "../types/Achievements";
import { CompleteHabitResponse } from "../types/Habit";
import { User } from "../types/User";

export const getUserLevel = async (token: string): Promise<UserLevelResponse> => {
  const res = await api.get("/habtracker/users/level", {
     headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );
  return res.data;
};

export const getUserXpAchievements = async (token: string): Promise<UserXpAchievementsResponse> => {
  const res = await api.get("/habtracker/users/xp-achievements", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const completeHabit = async (token: string, habitId: string): Promise<CompleteHabitResponse> => {
  const res = await api.post(
    `/habtracker/users/habits/${habitId}/complete`,{
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const uploadUserAvatar = async (token: string, imageUri: string): Promise<{ avatar: string }> => {
  const formData = new FormData();
  formData.append("avatar", {
    uri: imageUri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const res = await api.post("/habtracker/users/avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getUserProfile = async (token: string): Promise<User> => {
  const res = await api.get("/habtracker/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
