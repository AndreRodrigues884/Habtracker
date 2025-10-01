const FrequencyEnum = [
  'daily',
  'weekly',
  'biweekly',
  'twice_per_week',
  'three_times_per_week',
  'four_times_per_week',
  'five_times_per_week',
  'weekends'
];

// enums.ts
const CategoryEnum = [
  "health",
  "productivity",
  "learning",
  "creativity",
  "lifestyle",
  "social",
];

const CategoryConfig = {
  health: {
    name: "health",
    img: "./public/icons/health.svg", 
  },
  productivity: {
    name: "productivity",
    img: "./public/icons/productivity.svg",
  },
  learning: {
    name: "learning",
    img: "./public/icons/learning.svg",
  },
  creativity: {
    name: "creativity",
    img: "./public/icons/creativity.svg",
  },
  lifestyle: {
    name: "lifestyle",
    img: "./public/icons/lifestyle.svg",
  },
  social: {
    name: "Social",
    img: "./public/icons/social.svg",
  },
};

module.exports = {
  FrequencyEnum,
  CategoryEnum,
  CategoryConfig
};