import { ViewStyle, FlexAlignType } from "react-native";

type Justify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

type Align = FlexAlignType;

export const theme = {
  // Flex helpers
  flex: {
    row: { flexDirection: 'row' as const } satisfies ViewStyle,
    column: { flexDirection: 'column' as const } satisfies ViewStyle,
  },

  // Alignments
  align: {
    "top-left": { justifyContent: "flex-start" as Justify, alignItems: "flex-start" as Align } satisfies ViewStyle,
    "top-center": { justifyContent: "flex-start" as Justify, alignItems: "center" as Align } satisfies ViewStyle,
    "top-right": { justifyContent: "flex-start" as Justify, alignItems: "flex-end" as Align } satisfies ViewStyle,
    "center-left": { justifyContent: "center" as Justify, alignItems: "flex-start" as Align } satisfies ViewStyle,
    "center": { justifyContent: "center" as Justify, alignItems: "center" as Align } satisfies ViewStyle,
    "center-right": { justifyContent: "center" as Justify, alignItems: "flex-end" as Align } satisfies ViewStyle,
    "bottom-left": { justifyContent: "flex-end" as Justify, alignItems: "flex-start" as Align } satisfies ViewStyle,
    "bottom-center": { justifyContent: "flex-end" as Justify, alignItems: "center" as Align } satisfies ViewStyle,
    "bottom-right": { justifyContent: "flex-end" as Justify, alignItems: "flex-end" as Align } satisfies ViewStyle,
    "space-between": { justifyContent: "space-between" as Justify, alignItems: "center" as Align } satisfies ViewStyle,
  },

  // Size helpers
  size: {
    hug: { width: 'auto' as const, height: 'auto' as const } satisfies ViewStyle,
    hug_height: { height: 'auto' as const } satisfies ViewStyle,
    full: { width: '100%' as const, height: '100%' as const } satisfies ViewStyle,
    full_width: { width: '100%' as const } satisfies ViewStyle,
    full_height_flex: { flex: 1 } satisfies ViewStyle, // 👈 O componente cresce apenas até ocupar o espaço que sobra.
    full_width_flex: { flex: 1 } satisfies ViewStyle,
  },

  // Gap
  gap: {
    xs: 4,
    sm: 8,
    s: 12,
    md: 20,
    lg: 24,
    xl: 48,
  },

  // Colors
  colors: {
    primary: '#2D69FF',
    dark_text: '#434343',
    secondary: '#2d68ff4d',
    white: '#FFFFFF',
    background: '#F8F8F8',
    gray: '#D9D9D9',
    red: '#FF5555',
  },

  // Padding
  padding: {
    horizontal: {
      xs: { paddingHorizontal: 8 } satisfies ViewStyle,
      sm: { paddingHorizontal: 12 } satisfies ViewStyle,
      md: { paddingHorizontal: 16 } satisfies ViewStyle,
      l: { paddingHorizontal: 24 } satisfies ViewStyle,
      xxl: { paddingHorizontal: 32 } satisfies ViewStyle,
    },
    vertical: {
      xs: { paddingVertical: 8 } satisfies ViewStyle,
      sm: { paddingVertical: 12 } satisfies ViewStyle,
      md: { paddingVertical: 24 } satisfies ViewStyle,
      xxl: { paddingVertical: 56 } satisfies ViewStyle,
    },
  },


  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    full: 1000,
  },

  borderColor: {
    borderWidth: 1,
    borderSecondWidth: 1.5,
    borderThirdWidth: 2.5,
    borderColor: '#2D69FF',
    borderSecondColor: 'rgba(45,105,255,0.4)', 
    borderThirdColor: 'rgba(45,105,255,0.4)', 
  },

  // Typography
typography: {
  fontFamily: {
    regular: 'InstrumentSans-Regular',
    medium: 'InstrumentSans-Medium',
    semibold: 'InstrumentSans-Semibold',
    bold: 'InstrumentSans-Bold',
  },
  sizes: {
    xs: 12,
    s: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 40,
  },
  align: {
    center: { textAlign: "center" as const },
    left: { textAlign: "left" as const },
    right: { textAlign: "right" as const },
  },
},
};
