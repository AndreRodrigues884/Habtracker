export interface UserLevelResponse {
  level: number;
  xp: number;
}

export interface UserXpAchievementsResponse {
  level: number;
  xp: number;
  unlockedAchievements: Achievement[];
}

export interface Achievement {
  _id: string;
  name: string;
  type: 'xp' | 'streak' | 'count';
  threshold: number;
  rewardXp: number;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}
