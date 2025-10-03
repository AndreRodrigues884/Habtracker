import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Achievement } from '../types/Achievements';
import { AchievementModalContextType, AchievementModalProviderProps } from '../types/AchievementModal';


const AchievementModalContext = createContext<AchievementModalContextType | undefined>(undefined);

export const useAchievementModal = (): AchievementModalContextType => {
  const context = useContext(AchievementModalContext);
  if (!context) {
    throw new Error(
      "useAchievementModal must be used within an AchievementModalProvider"
    );
  }
  return context;
};


export const AchievementModalProvider: React.FC<AchievementModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const showModal = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentAchievement(null);
  };

  return (
    <AchievementModalContext.Provider
      value={{
        modalVisible,
        currentAchievement,
        showModal,
        hideModal,
        setModalVisible,
        setCurrentAchievement,
      }}
    >
      {children}
    </AchievementModalContext.Provider>
  );
};
