const AchievementNameEnum = {
    xp: [
        'XP Beginner',
        'Habit Explorer',
        'Progress Addict',
        'Routine Master',
        'Challenge Crusher',
        'Discipline Guru',
        'Focused Mind',
        'Persistence Legend',
        'Habit Dominator',
        'XP Unstoppable',
    ],
    streak: [
        '3 Days in a Row',
        'Week of Glory',
        'Steadfast (10 Days)',
        'Focused Fortnight',
        '3 Week Conqueror',
        'Month Without Breaking',
        '50 Days of Focus',
        'Consistency Master',
        '100 Days of Victory',
        'Discipline Legend',
    ],
    count: [
        'First Step',
        'Promising Start',
        'On the Way',
        'Visible Progress',
        'Habit Builder',
        '50 Daily Wins',
        'Golden Hundred',
        'Habit Executor',
        'Master of 200',
        'Habit Conqueror',
    ]
};

const AllAchievementNames = [
  ...AchievementNameEnum.xp,
  ...AchievementNameEnum.streak,
  ...AchievementNameEnum.count,
];


module.exports = {
    AchievementNameEnum,
    AllAchievementNames
};