export interface WeekDay {
    label: string;       
    dateNumber: number;  
    fullDate: Date;      
}

export interface WeekCalendarProps {
    onDaySelect?: (date: Date) => void;
}

export interface UserXPHeaderProps {
  name: string;
  currentXp: number;
  level: number;
  maxXp?: number; // XP necessário para subir de nível
}