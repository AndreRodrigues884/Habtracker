import { TextInputProps } from "react-native";

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

export interface CustomDropdownProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  optional?: boolean;
  placeholder?: string;
}

export interface DatePickerInputProps {
  label: string;
  date: Date | null;
  onDateChange: (date: Date) => void;
  optional?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
}

export interface EditHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habit: {
    habitId: string;
    title: string;
    description?: string;
    category: string;
    frequency: string;
    intention?: string;
    trigger?: string;
    startDate?: string;
    endDate?: string;
  };
  token: string;
  onHabitUpdated: (habitId: string, updatedData: any) => void;
}

export interface InputFieldProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

export interface Props {
  title: string;
  onPress: () => void;
}

export interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}
