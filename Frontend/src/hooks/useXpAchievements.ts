import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useAchievementModal } from "../contexts/AchievementModalContext";
import { getUserXpAchievements } from "../services/userService";
import { Achievement } from "../types/Achievements";

export const useXpAchievements = () => {
  const { token, user, setUser } = useContext(AuthContext);
  const { showModal, hideModal, setModalVisible, setCurrentAchievement } = useAchievementModal();
  const [xpAchievements, setXpAchievements] = useState<Achievement[]>([]);

  const fetchXpAchievements = useCallback(async () => {
    if (!token || !user || !setUser) return;

    try {
      
      const res = await getUserXpAchievements(token);
      if (!res) return;

   

      // Atualiza o user context com nível e XP
      setUser({
        ...user,
        level: res.level,
        currentXp: res.xp,
        xpGrantedToday: user.xpGrantedToday,
      });

      // Se houver achievements desbloqueados pelo endpoint, abre modal
      if (res.unlockedAchievements?.length > 0) {
        
        setXpAchievements(res.unlockedAchievements);
        showModal(res.unlockedAchievements[0]);
      } else {
      
      }
    } catch (err: any) {
      console.log(
        "Erro ao buscar achievements XP:",
        err.response?.data || err.message
      );
    }
  }, [token, user, setUser]);

  useEffect(() => {
    if (!user) return;
    const pending = user.pendingAchievements ?? [];
    
    if (pending.length === 0) return;
   
    setXpAchievements(pending);
    showModal(pending[0]);

    // Limpa os pending achievements após mostrar a modal
    setUser({ ...user, pendingAchievements: [] });
  }, [user?.pendingAchievements, setUser, showModal]);

  
  const handleClaim = () => {
    const remaining = xpAchievements.slice(1);
    if (remaining.length > 0) {
      setCurrentAchievement(remaining[0]);
      setXpAchievements(remaining);
    } else {
      setCurrentAchievement(null);
      setXpAchievements([]);
      hideModal();
    }
  };

  return {
    handleClaim,
    fetchXpAchievements,
    setCurrentAchievement,
    setModalVisible,
  };
};
