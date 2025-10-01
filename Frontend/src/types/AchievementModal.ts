import { Achievement } from "./Achievements";

export interface AchievementModalContextType {
  modalVisible: boolean;
  currentAchievement: Achievement | null;
  showModal: (achievement: Achievement) => void;
  hideModal: () => void;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAchievement: React.Dispatch<React.SetStateAction<Achievement | null>>;
}

export interface AchievementModalProviderProps {
  children: React.ReactNode;
}
