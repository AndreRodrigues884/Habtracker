import { Achievement } from "./Achievements";

export interface User {
  _id: string;  // id do MongoDB
  name: string;
  email: string;
  password: string;
  type: 'user' | 'admin';
  avatar: string | null;
  level: number;
  xp: number;
  associatedhabits: string[]; // array de ObjectId
  achievementsUnlocked: string[]; // array de ObjectId
  habitsCompletedCount: number;
  lastLoginXpReward: string | null; // ISO date string
  lastHabitCompletionDate: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  identifier: string; 
  password: string;
}

export interface AuthResponse {
  id: string;            
  token: string;  
  refreshToken?: string;
  name: string;     
  avatar?: string | null;  
  xpGrantedToday?: boolean;
  currentXp?: number;
  level?: number;
  unlockedAchievements?: Achievement[];
  pendingAchievements?: Achievement[];
}

export interface AuthContextData {
  user: AuthResponse | null;
  token: string | null;
  register: (data: RegisterData) => Promise<string | null>;
  login: (data: LoginData) => Promise<string | null>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthResponse | null>>;
}

export interface TokenPayload {
  userId: string;
  type: string;
  exp: number;
  iat: number;
}

