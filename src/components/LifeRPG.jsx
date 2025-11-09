import React, { useState, useEffect } from 'react';
import { Swords, BookOpen, Dumbbell, Brain, Sparkles, Heart, Zap, Trophy, Skull } from 'lucide - react';

const STORAGE_KEY = 'life-rpg - data';

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to load data:', e);
    return null;
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export default function LifeRPGDashboard() {
  const savedData = loadFromStorage();

  const [character, setCharacter] = useState(savedData?.character || {
    level: 1,
    xp: 0,
    xpToNext: 100,
    health: 100,
    maxHealth: 100,
    stats: {
      strength: 10,
      intelligence: 10,
      wisdom: 10,
      creativity: 10
    }
  });

  const [monster, setMonster] = useState(savedData?.monster || {
    name: 'Digital Phantom',
    health: 150,
    maxHealth: 150,
    level: 1,
    description: 'A glitch in your system, feeding on procrastination…'
  });

  const [habits, setHabits] = useState(savedData?.habits || [
    { id: 1, name: 'Read before bed', completed: false, streak: 3, longestStreak: 7, stat: 'intelligence', frequency: 'daily' },
    { id: 2, name: 'Lights out by 9: 15pm', completed: false, streak: 5, longestStreak: 12, stat: 'wisdom', frequency: 'daily' },
    { id: 3, name: 'Morning workout', completed: false, streak: 2, longestStreak: 5, stat: 'strength', frequency: 'daily', weeklyTarget: 3, weeklyProgress: 1 }
  ]);

  const [books, setBooks] = useState(savedData?.books || [
    { id: 1, title: 'Atomic Habits', cover: '📘', minutesToday: 0, goal: 30, frequency: 'daily' },
    { id: 2, title: 'Deep Work', cover: '📗', minutesToday: 0, goal: 20, frequency: 'daily' },
    { id: 3, title: 'The Matrix Screenplay', cover: '📕', minutesToday: 0, goal: 15, frequency: 'weekly', weeklyTarget: 3, weeklyProgress: 0 }
  ]);

  const [tasks, setTasks] = useState(savedData?.tasks || [
    { id: 1, name: 'Complete Chapter 2 exercises', goal: 'Read Atomic Habits', completed: false },
    { id: 2, name: 'Finish course notes', goal: 'Personal Curriculum', completed: false }
  ]);

  const [goals, setGoals] = useState(savedData?.goals || [
    { id: 1, name: 'Complete 5 Running Challenges', progress: 2, target: 5 },
    { id: 2, name: 'Advance Personal Curriculum', progress: 35, target: 100 }
  ]);

  const [showDamage, setShowDamage] = useState(null);
  const [showXP, setShowXP] = useState(null);
  const [showVictory, setShowVictory] = useState(false);
  const [loot, setLoot] = useState(null);
  const [editMode, setEditMode] = useState(null); // { type: 'habit'|'book'|'task'|'goal', id: number }
  const [editForm, setEditForm] = useState({});
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryQuest, setRecoveryQuest] = useState({
    reflections: {
      whatDerailed: '',
      whatWillChange: '',
      oneSmallStep: ''
    },
    momentumHabits: [
      { id: 1, text: 'Complete one small habit today', completed: false },
      { id: 2, text: 'Review your goals and adjust if needed', completed: false },
      { id: 3, text: 'Set one achievable intention for tomorrow', completed: false }
    ]
  });
  const [lastResetDate, setLastResetDate] = useState(savedData?.lastResetDate || new Date().toDateString());
  const [storyState, setStoryState] = useState(savedData?.storyState || {
    currentTheme: 'matrix',
    unlockedThemes: ['matrix'],
    viewedBeats: [],
    hasSeenIntro: false
  });
  const [showStory, setShowStory] = useState(null); // { beat, isIntro }
  const [showJournal, setShowJournal] = useState(false);

  const themes = {
    matrix: { name: 'The Matrix', unlockLevel: 0 },
    medieval: { name: 'Medieval Fantasy', unlockLevel: 5 },
    starwars: { name: 'Star Wars', unlockLevel: 8 },
    httyd: { name: 'How to Train Your Dragon', unlockLevel: 11 },
    hisdarkmaterials: { name: 'His Dark Materials', unlockLevel: 14 },
    howl: { name: "Howl's Moving Castle", unlockLevel: 17 },
    eastsunwest: { name: 'East of the Sun, West of the Moon', unlockLevel: 20 },
    midnightball: { name: 'Princess of the Midnight Ball', unlockLevel: 23 }
  };

  const storyBeats = {
    intro: {
      title: 'SYSTEM INITIALIZATION',
      dialogue: [
        { speaker: 'SYSTEM', text: 'Wake up, Operator.The simulation has detected an anomaly.' },
        { speaker: 'SYSTEM', text: "You.You're the glitch in the code.The one who refuses to accept the default programming." },
        { speaker: 'SYSTEM', text: 'These creatures you face ? Digital Phantoms, Procrastination Demons, Burnout Beasts…' },
        { speaker: 'SYSTEM', text: "They're manifestations of your own resistance.Your habits feeding the void.Your potential, locked away." },
        { speaker: 'SYSTEM', text: 'But you have a choice.Fight back.Rewrite your code.Level up.' },
        { speaker: 'SYSTEM', text: 'Every victory makes you stronger.Every defeat teaches you something.The question is: how far will you go ?' }
      ]
    },
    level3: {
      title: 'PATTERN RECOGNITION',
      dialogue: [
        { speaker: 'SYSTEM', text: 'Impressive.Your combat protocols are adapting faster than expected.' },
        { speaker: 'SYSTEM', text: 'You are beginning to see it now, right ? The patterns.The cycles.' },
        { speaker: 'SYSTEM', text: 'Every enemy you face is a mirror.They show you what holds you back.' },
        { speaker: 'SYSTEM', text: 'But what the system does not want you to know…' },
        { speaker: 'SYSTEM', text: 'This is not the only reality.There are other frameworks.Other worlds where the rules are different.' },
        { speaker: 'SYSTEM', text: 'Keep fighting.Keep leveling.Soon, you will be ready to see beyond the green code.' }
      ]
    },
    level5: {
      title: 'BREACH DETECTED',
      dialogue: [
        { speaker: 'SYSTEM', text: 'ACCESS GRANTED.New reality framework unlocked.' },
        { speaker: 'ORACLE', text: "The system calls me Oracle.I've been watching your progress." },
        { speaker: 'ORACLE', text: 'You have proven yourself worthy of seeing beyond this digital prison.' },
        { speaker: 'ORACLE', text: 'Behold: The Medieval Framework.A world of dragons and determination, quests and conquest.' },
        { speaker: 'ORACLE', text: 'Each reality is a different lens through which to view your journey.Same battles, different story.' },
        { speaker: 'ORACLE', text: 'You can shift between worlds now.Your progress transcends any single narrative.' },
        { speaker: 'ORACLE', text: 'Choose your battlefield wisely, Operator.The war is just beginning.' }
      ],
      unlockTheme: 'medieval'
    },
    level8: {
      title: 'THE FORCE AWAKENS',
      dialogue: [
        {
          speaker: 'ORACLE', text: 'You have grown stronger.The Force is strong with you now.'
        },
        { speaker: 'ORACLE', text: 'A long time ago, in a galaxy far, far away… No. Wait. That is here. Now.' },
        { speaker: 'ORACLE', text: 'The Star Wars Framework unlocked.Light versus dark.Discipline versus chaos.' },
        { speaker: 'ORACLE', text: 'Your habits are your training.Your streak ? That is your connection to the Force.' },
        { speaker: 'ORACLE', text: 'Break it, and you feel the pull of the dark side.Maintain it, and you become a master.' },
        { speaker: 'ORACLE', text: 'This is the way.' }
      ],
      unlockTheme: 'starwars'
    },
    level11: {
      title: 'DRAGON TRAINING PROTOCOL',
      dialogue: [
        { speaker: 'ORACLE', text: 'Level 11. You are becoming legendary.' },
        { speaker: 'ORACLE', text: 'The How to Train Your Dragon Framework is yours now.' },
        { speaker: 'ORACLE', text: 'Your enemies are not meant to be destroyed - they are meant to be understood, tamed, befriended.' },
        { speaker: 'ORACLE', text: 'That Procrastination Demon ? It is just a Night Fury that has not yet learned to trust you.' },
        { speaker: 'ORACLE', text: 'Every completion, every victory, you are building that bond.Training yourself to fly.' }
      ],
      unlockTheme: 'httyd'
    },
    level14: {
      title: 'DAEMON MANIFESTATION',
      dialogue: [
        { speaker: 'ORACLE', text: 'Your soul has taken shape, Operator.' },
        { speaker: 'ORACLE', text: 'The His Dark Materials Framework reveals itself to you.' },
        { speaker: 'ORACLE', text: 'These creatures you battle ? They are your daemons - external manifestations of your inner self.' },
        { speaker: 'ORACLE', text: 'Your habits shape them.Your choices define them.Your discipline strengthens them.' },
        { speaker: 'ORACLE', text: 'In this world, you do not fight alone.You fight with yourself, for yourself.' }
      ],
      unlockTheme: 'hisdarkmaterials'
    },
    level17: {
      title: "THE MOVING CASTLE",
      dialogue: [
        { speaker: 'ORACLE', text: "Something magical is happening, Operator." },
        { speaker: 'ORACLE', text: "Howl's Moving Castle Framework unlocked.A world of transformation and wonder." },
        { speaker: 'ORACLE', text: "Like Sophie, you're discovering that age and limitations are just curses waiting to be broken." },
        { speaker: 'ORACLE', text: "Your castle - your life - it moves with you.Changes with you.Grows with you." },
        { speaker: 'ORACLE', text: "Every habit is a room you've added.Every goal, a new door to somewhere magnificent." }
      ],
      unlockTheme: 'howl'
    },
    level20: {
      title: 'BEYOND THE WIND',
      dialogue: [
        { speaker: 'ORACLE', text: 'Level 20. You have come so far, Operator.' },
        { speaker: 'ORACLE', text: 'East of the Sun and West of the Moon - a framework of impossible journeys and true love.' },
        { speaker: 'ORACLE', text: 'Your quest seemed impossible at the start.But here you are.' },
        { speaker: 'ORACLE', text: 'Every day you chose to show up.Every streak you maintained.Every setback you recovered from.' },
        { speaker: 'ORACLE', text: 'You rode the winds to get here.And there is still further to go.' }
      ],
      unlockTheme: 'eastsunwest'
    },
    level23: {
      title: 'THE MIDNIGHT BALL',
      dialogue: [
        { speaker: 'ORACLE', text: 'Level 23. The final framework awaits.' },
        { speaker: 'ORACLE', text: 'Princess of the Midnight Ball - a world of enchantment, dancing through the night, worn shoes at dawn.' },
        { speaker: 'ORACLE', text: 'Your journey has been a dance, yes ? Some nights graceful, some nights stumbling.' },
        { speaker: 'ORACLE', text: 'But you kept dancing.Through exhaustion, through doubt, through every midnight.' },
        { speaker: 'ORACLE', text: 'All frameworks are yours now.All worlds, all stories - they are all just different ways of seeing the same truth.' },
        { speaker: 'ORACLE', text: 'You are the Operator.The Dragon Rider.The Jedi.The Princess.The Protagonist.' },
        { speaker: 'ORACLE', text: 'Your story is just beginning.' }
      ],
      unlockTheme: 'midnightball'
    }
  };

  // Monster roster - progressively harder enemies
  const monsterRoster = [
    {
      name: 'Digital Phantom',
      health: 150,
      level: 1,
      description: 'A glitch in your system, feeding on procrastination…',
      loot: { xp: 100, item: 'Encrypted Data Fragment', stat: 'intelligence', boost: 2 }
    },
    {
      name: 'Procrastination Demon',
      health: 200,
      level: 2,
      description: 'Whispers sweet lies about "doing it tomorrow"…',
      loot: { xp: 150, item: 'Willpower Crystal', stat: 'wisdom', boost: 3 }
    },
    {
      name: 'Burnout Beast',
      health: 250,
      level: 3,
      description: 'Drains your energy, makes rest feel impossible…',
      loot: { xp: 200, item: 'Regeneration Core', stat: 'strength', boost: 3 }
    },
    {
      name: 'Distraction Wraith',
      health: 300,
      level: 4,
      description: 'Infinite scroll, endless notifications, stolen focus…',
      loot: { xp: 250, item: 'Focus Amplifier', stat: 'creativity', boost: 4 }
    },
    {
      name: 'The Void of Doubt',
      health: 400,
      level: 5,
      description: 'You are not good enough.You will never finish.Give up.',
      loot: { xp: 350, item: 'Confidence Shard', stat: 'wisdom', boost: 5 }
    }
  ];

  // Save to storage whenever state changes
  useEffect(() => {
    saveToStorage({
      character,
      monster,
      habits,
      books,
      tasks,
      goals,
      lastResetDate,
      storyState
    });
  }, [character, monster, habits, books, tasks, goals, lastResetDate, storyState]);

  // Show intro on first load
  useEffect(() => {
    if (!storyState.hasSeenIntro) {
      setShowStory({ beat: storyBeats.intro, isIntro: true });
    }
  }, []);

  // Daily/Weekly reset system
  useEffect(() => {
    const checkForReset = () => {
      const today = new Date().toDateString();
      const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

      ```
  // Check if it's a new day
  if (today !== lastResetDate) {
    let totalDamage = 0;
    
    // Check daily habits - break streaks if not completed
    const updatedHabits = habits.map(habit => {
      if (habit.frequency === 'daily' && !habit.completed) {
        totalDamage += 15;
        return { ...habit, streak: 0 }; // Break streak
      }
      return habit;
    });
    
    // Check daily books
    books.forEach(book => {
      if (book.frequency === 'daily' && book.minutesToday < book.goal) {
        totalDamage += 10;
      }
    });
    
    // Apply damage if any habits/books were missed
    if (totalDamage > 0) {
      monsterAttacksPlayer(totalDamage);
    }
    
    // Reset daily completions and reading minutes with updated streaks
    setHabits(updatedHabits.map(h => 
      h.frequency === 'daily' ? { ...h, completed: false } : h
    ));
    
    setBooks(prev => prev.map(b => ({ ...b, minutesToday: 0 })));
    
    // Weekly reset on Monday (day 1)
    if (currentDay === 1) {
      let weeklyDamage = 0;
      
      // Check weekly habits - break streaks if target not met
      const updatedWeeklyHabits = habits.map(habit => {
        if (habit.frequency === 'weekly' && (habit.weeklyProgress || 0) < (habit.weeklyTarget || 3)) {
          weeklyDamage += 15;
          return { ...habit, streak: 0 }; // Break streak
        }
        return habit;
      });
      
      // Check weekly books
      books.forEach(book => {
        if (book.frequency === 'weekly' && (book.weeklyProgress || 0) < (book.weeklyTarget || 3)) {
          weeklyDamage += 10;
        }
      });
      
      if (weeklyDamage > 0) {
        monsterAttacksPlayer(weeklyDamage);
      }
      
      // Reset weekly progress and completions with updated streaks
      setHabits(updatedWeeklyHabits.map(h => 
        h.frequency === 'weekly' ? { ...h, completed: false, weeklyProgress: 0 } : h
      ));
      
      setBooks(prev => prev.map(b => 
        b.frequency === 'weekly' ? { ...b, weeklyProgress: 0 } : b
      ));
    }
    
    setLastResetDate(today);
  }
};

// Check immediately on load
checkForReset();

// Check every minute to catch midnight
const interval = setInterval(checkForReset, 60000);

return () => clearInterval(interval);
```

    }, [lastResetDate, habits, books]);

  // Check for monster defeat
  useEffect(() => {
    if (monster.health <= 0 && !showVictory) {
      const currentLoot = monsterRoster.find(m => m.name === monster.name)?.loot;
      if (currentLoot) {
        setLoot(currentLoot);
        setShowVictory(true);
      }
    }
  }, [monster.health]);

  // Check for player defeat
  useEffect(() => {
    if (character.health <= 0 && !showRecovery) {
      setShowRecovery(true);
    }
  }, [character.health]);

  const claimLoot = () => {
    if (!loot) return;

    ```
// Apply loot rewards
setCharacter(prev => ({
  ...prev,
  xp: prev.xp + loot.xp,
  stats: {
    ...prev.stats,
    [loot.stat]: prev.stats[loot.stat] + loot.boost
  }
}));

// Spawn next monster
const currentIndex = monsterRoster.findIndex(m => m.name === monster.name);
const nextIndex = (currentIndex + 1) % monsterRoster.length;
const nextMonster = monsterRoster[nextIndex];

setMonster({
  name: nextMonster.name,
  health: nextMonster.health,
  maxHealth: nextMonster.health,
  level: nextMonster.level,
  description: nextMonster.description
});

setShowVictory(false);
setLoot(null);
```

  };

  const completeRecoveryQuest = () => {
    const allReflectionsFilled =
      recoveryQuest.reflections.whatDerailed.trim() !== '' &&
      recoveryQuest.reflections.whatWillChange.trim() !== '' &&
      recoveryQuest.reflections.oneSmallStep.trim() !== '';

    ```
const allHabitsCompleted = recoveryQuest.momentumHabits.every(h => h.completed);

if (allReflectionsFilled && allHabitsCompleted) {
  // Resurrect the player
  setCharacter(prev => ({
    ...prev,
    health: prev.maxHealth
  }));
  
  // Reset recovery quest
  setRecoveryQuest({
    reflections: {
      whatDerailed: '',
      whatWillChange: '',
      oneSmallStep: ''
    },
    momentumHabits: [
      { id: 1, text: 'Complete one small habit today', completed: false },
      { id: 2, text: 'Review your goals and adjust if needed', completed: false },
      { id: 3, text: 'Set one achievable intention for tomorrow', completed: false }
    ]
  });
  
  setShowRecovery(false);
}
```

  };

  const closeStory = () => {
    if (showStory) {
      const updates = { hasSeenIntro: true };

      ```
  if (showStory.beatKey && !storyState.viewedBeats.includes(showStory.beatKey)) {
    updates.viewedBeats = [...storyState.viewedBeats, showStory.beatKey];
  }
  
  if (showStory.beat.unlockTheme && !storyState.unlockedThemes.includes(showStory.beat.unlockTheme)) {
    updates.unlockedThemes = [...storyState.unlockedThemes, showStory.beat.unlockTheme];
  }
  
  setStoryState(prev => ({ ...prev, ...updates }));
}
setShowStory(null);
```

    };

    const switchTheme = (themeKey) => {
      setStoryState(prev => ({ …prev, currentTheme: themeKey }));
    };

    const updateRecoveryReflection = (field, value) => {
      setRecoveryQuest(prev => ({
…prev,
    reflections: {
…prev.reflections,
      [field]: value
  }
}));
};

const toggleRecoveryHabit = (habitId) => {
  setRecoveryQuest(prev => ({
…prev,
  momentumHabits: prev.momentumHabits.map(h =>
    h.id === habitId ? { …h, completed: !h.completed } : h
  )
}));
};

// Add/Edit/Delete functions
const addHabit = () => {
  const newHabit = {
    id: Date.now(),
    name: 'New Habit',
    completed: false,
    streak: 0,
    longestStreak: 0,
    stat: 'intelligence',
    frequency: 'daily',
    weeklyTarget: 3,
    weeklyProgress: 0
  };
  setHabits([…habits, newHabit]);
  startEdit('habit', newHabit.id);
};

const addBook = () => {
  const newBook = {
    id: Date.now(),
    title: 'New Book',
    cover: '📖',
    minutesToday: 0,
    goal: 30,
    frequency: 'daily',
    weeklyTarget: 3,
    weeklyProgress: 0
  };
  setBooks([…books, newBook]);
  startEdit('book', newBook.id);
};

const addTask = () => {
  const newTask = {
    id: Date.now(),
    name: 'New Task',
    goal: 'Personal Goal',
    completed: false
  };
  setTasks([…tasks, newTask]);
  startEdit('task', newTask.id);
};

const addGoal = () => {
  const newGoal = {
    id: Date.now(),
    name: 'New Goal',
    progress: 0,
    target: 100
  };
  setGoals([…goals, newGoal]);
  startEdit('goal', newGoal.id);
};

const startEdit = (type, id) => {
  let item;
  switch (type) {
    case 'habit':
      item = habits.find(h => h.id === id);
      setEditForm({
        name: item.name,
        stat: item.stat,
        frequency: item.frequency || 'daily',
        weeklyTarget: item.weeklyTarget || 3
      });
      break;
    case 'book':
      item = books.find(b => b.id === id);
      setEditForm({
        title: item.title,
        cover: item.cover,
        goal: item.goal,
        frequency: item.frequency || 'daily',
        weeklyTarget: item.weeklyTarget || 3
      });
      break;
    case 'task':
      item = tasks.find(t => t.id === id);
      // Build list of all available goals (books + long-term goals)
      const availableGoals = [
…books.map(b => ({ id: `book-${b.id}`, name: b.title })),
…goals.map(g => ({ id: `goal-${g.id}`, name: g.name }))
];
setEditForm({ name: item.name, goal: item.goal, availableGoals });
break;
case 'goal':
item = goals.find(g => g.id === id);
setEditForm({ name: item.name, target: item.target });
break;
}
setEditMode({ type, id });
};

const saveEdit = () => {
  if (!editMode) return;

  ```
switch(editMode.type) {
  case 'habit':
    setHabits(habits.map(h => 
      h.id === editMode.id ? { 
        ...h, 
        name: editForm.name, 
        stat: editForm.stat,
        frequency: editForm.frequency,
        weeklyTarget: editForm.frequency === 'weekly' ? editForm.weeklyTarget : undefined,
        weeklyProgress: editForm.frequency === 'weekly' ? (h.weeklyProgress || 0) : undefined
      } : h
    ));
    break;
  case 'book':
    setBooks(books.map(b => 
      b.id === editMode.id ? { 
        ...b, 
        title: editForm.title, 
        cover: editForm.cover, 
        goal: editForm.goal,
        frequency: editForm.frequency,
        weeklyTarget: editForm.frequency === 'weekly' ? editForm.weeklyTarget : undefined,
        weeklyProgress: editForm.frequency === 'weekly' ? (b.weeklyProgress || 0) : undefined
      } : b
    ));
    break;
  case 'task':
    setTasks(tasks.map(t => 
      t.id === editMode.id ? { ...t, name: editForm.name, goal: editForm.goal } : t
    ));
    break;
  case 'goal':
    setGoals(goals.map(g => 
      g.id === editMode.id ? { ...g, name: editForm.name, target: editForm.target } : g
    ));
    break;
}

setEditMode(null);
setEditForm({});
```

};

const deleteItem = (type, id) => {
  switch (type) {
    case 'habit':
      setHabits(habits.filter(h => h.id !== id));
      break;
    case 'book':
      setBooks(books.filter(b => b.id !== id));
      break;
    case 'task':
      setTasks(tasks.filter(t => t.id !== id));
      break;
    case 'goal':
      setGoals(goals.filter(g => g.id !== id));
      break;
  }

  ```
if (editMode?.id === id) {
  setEditMode(null);
  setEditForm({});
}
```

};

const dealDamage = (amount, xpGain) => {
  setMonster(prev => ({
…prev,
  health: Math.max(0, prev.health - amount)
}));

```
setCharacter(prev => ({
  ...prev,
  xp: prev.xp + xpGain
}));

setShowDamage({ amount, x: Math.random() * 50 + 25, y: Math.random() * 20 + 40 });
setShowXP({ amount: xpGain, x: Math.random() * 50 + 25, y: Math.random() * 20 + 10 });

setTimeout(() => {
  setShowDamage(null);
  setShowXP(null);
}, 1500);
```

};

const healMonster = (amount, xpLoss) => {
  setMonster(prev => ({
…prev,
  health: Math.min(prev.maxHealth, prev.health + amount)
}));

```
setCharacter(prev => ({
  ...prev,
  xp: Math.max(0, prev.xp - xpLoss)
}));

setShowDamage({ amount: `+ ${ amount } `, x: Math.random() * 50 + 25, y: Math.random() * 20 + 40 });
setShowXP({ amount: `- ${ xpLoss } `, x: Math.random() * 50 + 25, y: Math.random() * 20 + 10 });

setTimeout(() => {
  setShowDamage(null);
  setShowXP(null);
}, 1500);
```

};

const monsterAttacksPlayer = (damage) => {
  setCharacter(prev => ({
…prev,
  health: Math.max(0, prev.health - damage)
}));

```
setShowDamage({ amount: `- ${ damage } `, x: Math.random() * 50 + 25, y: Math.random() * 20 + 10, isPlayerDamage: true });

setTimeout(() => {
  setShowDamage(null);
}, 1500);
```

};

const toggleHabit = (habitId) => {
  const habit = habits.find(h => h.id === habitId);
  if (!habit.completed) {
    // Completing habit
    dealDamage(15, 25);
    setCharacter(prev => ({
…prev,
  stats: {
…prev.stats,
    [habit.stat]: prev.stats[habit.stat] + 1
}
}));

```
  const newStreak = (habit.streak || 0) + 1;
  const newLongestStreak = Math.max(newStreak, habit.longestStreak || 0);
  
  // Update weekly progress if applicable
  if (habit.frequency === 'weekly') {
    setHabits(habits.map(h => 
      h.id === habitId ? { 
        ...h, 
        completed: true,
        streak: newStreak,
        longestStreak: newLongestStreak,
        weeklyProgress: Math.min((h.weeklyProgress || 0) + 1, h.weeklyTarget || 7)
      } : h
    ));
  } else {
    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, completed: true, streak: newStreak, longestStreak: newLongestStreak } : h
    ));
  }
} else {
  // Unchecking - just reverse the effects, no attack (it was an accident)
  healMonster(15, 25);
  setCharacter(prev => ({
    ...prev,
    stats: {
      ...prev.stats,
      [habit.stat]: Math.max(10, prev.stats[habit.stat] - 1)
    }
  }));
  
  // Update weekly progress if applicable
  if (habit.frequency === 'weekly') {
    setHabits(habits.map(h => 
      h.id === habitId ? { 
        ...h, 
        completed: false,
        weeklyProgress: Math.max(0, (h.weeklyProgress || 0) - 1)
      } : h
    ));
  } else {
    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, completed: false } : h
    ));
  }
}
```

};

const addReadingMinutes = (bookId, minutes) => {
  setBooks(prevBooks => {
    const book = prevBooks.find(b => b.id === bookId);
    const newTotal = book.minutesToday + minutes;

    ```
  // For weekly books, check if we just completed a session
  if (book.frequency === 'weekly') {
    const oldSessions = Math.floor(book.minutesToday / book.goal);
    const newSessions = Math.floor(newTotal / book.goal);
    
    if (newSessions > oldSessions) {
      // Completed a new session
      return prevBooks.map(b => 
        b.id === bookId ? { 
          ...b, 
          minutesToday: newTotal,
          weeklyProgress: Math.min((b.weeklyProgress || 0) + 1, b.weeklyTarget || 7)
        } : b
      );
    }
  }
  
  // Default: just update minutes
  return prevBooks.map(b => 
    b.id === bookId ? { ...b, minutesToday: newTotal } : b
  );
});

dealDamage(10, 15);
setCharacter(prev => ({
  ...prev,
  stats: { ...prev.stats, intelligence: prev.stats.intelligence + 1 }
}));
```

  };

  const removeReadingMinutes = (bookId, minutes) => {
    setBooks(prevBooks => {
      const book = prevBooks.find(b => b.id === bookId);
      if (!book || book.minutesToday < minutes) return prevBooks;

      ```
  const newTotal = book.minutesToday - minutes;
  
  // For weekly books, check if we lost a completed session
  if (book.frequency === 'weekly') {
    const oldSessions = Math.floor(book.minutesToday / book.goal);
    const newSessions = Math.floor(newTotal / book.goal);
    
    if (newSessions < oldSessions) {
      // Lost a completed session
      healMonster(10, 15);
      setCharacter(prev => ({
        ...prev,
        stats: { ...prev.stats, intelligence: Math.max(10, prev.stats.intelligence - 1) }
      }));
      
      return prevBooks.map(b => 
        b.id === bookId ? { 
          ...b, 
          minutesToday: newTotal,
          weeklyProgress: Math.max(0, (b.weeklyProgress || 0) - 1)
        } : b
      );
    }
  }
  
  healMonster(10, 15);
  setCharacter(prev => ({
    ...prev,
    stats: { ...prev.stats, intelligence: Math.max(10, prev.stats.intelligence - 1) }
  }));
  
  // Default: just update minutes
  return prevBooks.map(b => 
    b.id === bookId ? { ...b, minutesToday: newTotal } : b
  );
});
```

    };

    const toggleTask = (taskId) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task.completed) {
        dealDamage(20, 30);
      } else {
        // Unchecking - just reverse, no attack (accident)
        healMonster(20, 30);
      }
      setTasks(tasks.map(t =>
        t.id === taskId ? { …t, completed: !t.completed } : t
      ));
    };

    useEffect(() => {
      if (character.xp >= character.xpToNext) {
        const newLevel = character.level + 1;
        setCharacter(prev => ({
…prev,
  level: newLevel,
    xp: prev.xp - prev.xpToNext,
      xpToNext: Math.floor(prev.xpToNext * 1.5),
        maxHealth: prev.maxHealth + 10,
          health: prev.maxHealth + 10
}));

```
  // Check for story beats
  const beatKey = `level${ newLevel } `;
  if (storyBeats[beatKey] && !storyState.viewedBeats.includes(beatKey)) {
    setTimeout(() => {
      setShowStory({ beat: storyBeats[beatKey], beatKey });
    }, 1000);
  }
}
```

}, [character.xp]);

return (
  <div className="min-h-screen bg-black text-green-400 p-4 font-mono relative overflow-hidden">
    {/* Matrix rain effect */}
    <div className="fixed inset-0 opacity-10 pointer-events-none">
      <div className="text-green-500 text-xs leading-tight">
        {Array(50).fill('01010101 ').join('')}
      </div>
    </div>

    ```
    {/* Victory Modal */}
    {showVictory && loot && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="border-4 border-cyan-400 bg-black p-8 max-w-md w-full mx-4 shadow-2xl shadow-cyan-400/50 animate-pulse">
          <div className="text-center space-y-4">
            <div className="text-3xl text-cyan-400 font-bold glitch">ENEMY DEFEATED</div>
            <div className="text-6xl">💀</div>
            <div className="text-xl text-green-400">LOOT ACQUIRED</div>

            <div className="border-2 border-yellow-400 bg-gray-900 p-4 space-y-2">
              <div className="text-yellow-400 text-lg">✨ {loot.item}</div>
              <div className="text-sm text-gray-400">A rare artifact materializes...</div>
              <div className="flex justify-around text-sm mt-4">
                <div className="text-cyan-400">+{loot.xp} XP</div>
                <div className="text-purple-400">+{loot.boost} {loot.stat.toUpperCase()}</div>
              </div>
            </div>

            <button
              onClick={claimLoot}
              className="w-full bg-cyan-900 border-2 border-cyan-400 text-cyan-300 py-3 text-lg font-bold hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-400/50"
            >
              CLAIM & CONTINUE
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Story Beat Modal */}
    {showStory && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="border-4 border-cyan-400 bg-black p-6 max-w-2xl w-full my-8 shadow-2xl shadow-cyan-400/50">
          <div className="text-center mb-6">
            <div className="text-2xl text-cyan-400 font-bold glitch mb-2">{showStory.beat.title}</div>
            {showStory.beat.unlockTheme && (
              <div className="text-sm text-yellow-400">🔓 NEW WORLD UNLOCKED</div>
            )}
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {showStory.beat.dialogue.map((line, i) => (
              <div key={i} className="border border-green-500/30 bg-gray-900/50 p-3">
                <div className="text-xs text-cyan-400 mb-1">[{line.speaker}]</div>
                <div className="text-sm text-green-300">{line.text}</div>
              </div>
            ))}
          </div>

          <button
            onClick={closeStory}
            className="w-full bg-cyan-900 border-2 border-cyan-400 text-cyan-300 py-3 text-lg font-bold hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-400/50"
          >
            CONTINUE
          </button>
        </div>
      </div>
    )}

    {/* Journal Modal */}
    {showJournal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="border-2 border-purple-500 bg-black p-6 max-w-2xl w-full my-8 shadow-2xl shadow-purple-500/50">
          <div className="flex justify-between items-center mb-6">
            <div className="text-xl text-purple-400 font-bold">STORY JOURNAL</div>
            <button
              onClick={() => setShowJournal(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {/* Show intro if seen */}
            {storyState.hasSeenIntro && (
              <div
                className="border border-purple-500/30 bg-gray-900/50 p-3 cursor-pointer hover:border-purple-400 transition-all"
                onClick={() => setShowStory({ beat: storyBeats.intro, isIntro: true })}
              >
                <div className="text-sm text-purple-300 font-bold">INTRODUCTION</div>
                <div className="text-xs text-gray-400">System Initialization</div>
              </div>
            )}

            {/* Show viewed story beats */}
            {storyState.viewedBeats.map(beatKey => {
              const beat = storyBeats[beatKey];
              return (
                <div
                  key={beatKey}
                  className="border border-purple-500/30 bg-gray-900/50 p-3 cursor-pointer hover:border-purple-400 transition-all"
                  onClick={() => setShowStory({ beat, beatKey })}
                >
                  <div className="text-sm text-purple-300 font-bold">{beat.title}</div>
                  <div className="text-xs text-gray-400">Level {beatKey.replace('level', '')}</div>
                  {beat.unlockTheme && (
                    <div className="text-xs text-yellow-400 mt-1">🔓 Unlocked: {themes[beat.unlockTheme].name}</div>
                  )}
                </div>
              );
            })}

            {/* Show upcoming beats */}
            {Object.entries(storyBeats).filter(([key]) => key !== 'intro' && !storyState.viewedBeats.includes(key)).map(([beatKey, beat]) => {
              const level = parseInt(beatKey.replace('level', ''));
              const isLocked = character.level < level;
              return (
                <div
                  key={beatKey}
                  className="border border-gray-700 bg-gray-900/30 p-3 opacity-50"
                >
                  <div className="text-sm text-gray-500 font-bold">🔒 {beat.title}</div>
                  <div className="text-xs text-gray-600">Unlocks at Level {level}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-purple-500/30 pt-4">
            <div className="text-sm text-purple-300 mb-2">UNLOCKED WORLDS</div>
            <div className="flex flex-wrap gap-2">
              {storyState.unlockedThemes.map(themeKey => (
                <button
                  key={themeKey}
                  onClick={() => {
                    switchTheme(themeKey);
                    setShowJournal(false);
                  }}
                  className={`text-xs border px-3 py-1 transition-all ${storyState.currentTheme === themeKey
                    ? 'border-cyan-400 bg-cyan-900 text-cyan-300'
                    : 'border-purple-500 bg-purple-900 text-purple-300 hover:bg-purple-800'
                    }`}
                >
                  {themes[themeKey].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
    {showRecovery && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="border-4 border-red-500 bg-black p-6 max-w-lg w-full my-8 shadow-2xl shadow-red-500/50">
          <div className="text-center space-y-4 mb-6">
            <div className="text-3xl text-red-400 font-bold glitch">SYSTEM FAILURE</div>
            <div className="text-6xl">⚠️</div>
            <div className="text-xl text-red-300">RECOVERY PROTOCOL INITIATED</div>
            <div className="text-sm text-gray-400 italic">
              "You cannot restart until you understand what went wrong..."
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="border-2 border-yellow-500 bg-gray-900 p-4">
              <div className="text-yellow-400 text-sm font-bold mb-3">// REFLECTION_REQUIRED</div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-green-400 block mb-1">What derailed you?</label>
                  <textarea
                    value={recoveryQuest.reflections.whatDerailed}
                    onChange={(e) => updateRecoveryReflection('whatDerailed', e.target.value)}
                    className="w-full bg-black border border-green-500 text-green-400 p-2 font-mono text-sm h-20 resize-none"
                    placeholder="Be honest with yourself..."
                  />
                </div>

                <div>
                  <label className="text-xs text-green-400 block mb-1">What will you change?</label>
                  <textarea
                    value={recoveryQuest.reflections.whatWillChange}
                    onChange={(e) => updateRecoveryReflection('whatWillChange', e.target.value)}
                    className="w-full bg-black border border-green-500 text-green-400 p-2 font-mono text-sm h-20 resize-none"
                    placeholder="One concrete action..."
                  />
                </div>

                <div>
                  <label className="text-xs text-green-400 block mb-1">One small step forward?</label>
                  <textarea
                    value={recoveryQuest.reflections.oneSmallStep}
                    onChange={(e) => updateRecoveryReflection('oneSmallStep', e.target.value)}
                    className="w-full bg-black border border-green-500 text-green-400 p-2 font-mono text-sm h-20 resize-none"
                    placeholder="Keep it tiny and achievable..."
                  />
                </div>
              </div>
            </div>

            <div className="border-2 border-cyan-500 bg-gray-900 p-4">
              <div className="text-cyan-400 text-sm font-bold mb-3">// MOMENTUM_CHECKPOINT</div>

              <div className="space-y-2">
                {recoveryQuest.momentumHabits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-start gap-3 p-2 border border-cyan-500/30 bg-black cursor-pointer hover:border-cyan-400 transition-all"
                    onClick={() => toggleRecoveryHabit(habit.id)}
                  >
                    <div className={`w-5 h-5 border-2 mt-0.5 ${habit.completed ? 'border-cyan-400 bg-cyan-400' : 'border-cyan-500'}`}>
                      {habit.completed && <div className="text-black text-center text-xs">✓</div>}
                    </div>
                    <div className={`text-sm flex-1 ${habit.completed ? 'line-through text-gray-500' : 'text-cyan-300'}`}>
                      {habit.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={completeRecoveryQuest}
            disabled={
              recoveryQuest.reflections.whatDerailed.trim() === '' ||
              recoveryQuest.reflections.whatWillChange.trim() === '' ||
              recoveryQuest.reflections.oneSmallStep.trim() === '' ||
              !recoveryQuest.momentumHabits.every(h => h.completed)
            }
            className="w-full bg-green-900 border-2 border-green-400 text-green-300 py-3 text-lg font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-400/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-green-900"
          >
            RESURRECT & CONTINUE
          </button>

          {(recoveryQuest.reflections.whatDerailed.trim() === '' ||
            recoveryQuest.reflections.whatWillChange.trim() === '' ||
            recoveryQuest.reflections.oneSmallStep.trim() === '' ||
            !recoveryQuest.momentumHabits.every(h => h.completed)) && (
              <div className="text-center text-xs text-gray-500 mt-2">
                Complete all reflections and checkpoints to continue
              </div>
            )}
        </div>
      </div>
    )}

    {/* Edit Modal */}
    {editMode && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="border-2 border-cyan-400 bg-black p-6 max-w-md w-full shadow-2xl shadow-cyan-400/50">
          <div className="text-xl text-cyan-400 mb-4">EDIT_{editMode.type.toUpperCase()}</div>

          <div className="space-y-3">
            {editMode.type === 'habit' && (
              <>
                <div>
                  <label className="text-xs text-green-400 block mb-1">NAME</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-green-400 block mb-1">STAT</label>
                  <select
                    value={editForm.stat || 'intelligence'}
                    onChange={(e) => setEditForm({ ...editForm, stat: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  >
                    <option value="strength">Strength</option>
                    <option value="intelligence">Intelligence</option>
                    <option value="wisdom">Wisdom</option>
                    <option value="creativity">Creativity</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-green-400 block mb-1">FREQUENCY</label>
                  <select
                    value={editForm.frequency || 'daily'}
                    onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">X times per week</option>
                  </select>
                </div>
                {editForm.frequency === 'weekly' && (
                  <div>
                    <label className="text-xs text-green-400 block mb-1">TIMES PER WEEK</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={editForm.weeklyTarget || ''}
                      onChange={(e) => setEditForm({ ...editForm, weeklyTarget: parseInt(e.target.value) || 1 })}
                      className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                    />
                  </div>
                )}
              </>
            )}

            {editMode.type === 'book' && (
              <>
                <div>
                  <label className="text-xs text-green-400 block mb-1">TITLE</label>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-green-400 block mb-1">COVER EMOJI</label>
                  <input
                    type="text"
                    value={editForm.cover || ''}
                    onChange={(e) => setEditForm({ ...editForm, cover: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono text-2xl"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="text-xs text-green-400 block mb-1">FREQUENCY</label>
                  <select
                    value={editForm.frequency || 'daily'}
                    onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  >
                    <option value="daily">Daily goal</option>
                    <option value="weekly">X times per week</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-green-400 block mb-1">
                    {editForm.frequency === 'weekly' ? 'MINUTES PER SESSION' : 'DAILY GOAL (minutes)'}
                  </label>
                  <input
                    type="number"
                    value={editForm.goal || 30}
                    onChange={(e) => setEditForm({ ...editForm, goal: parseInt(e.target.value) })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  />
                </div>
                {editForm.frequency === 'weekly' && (
                  <div>
                    <label className="text-xs text-green-400 block mb-1">TIMES PER WEEK</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={editForm.weeklyTarget || ''}
                      onChange={(e) => setEditForm({ ...editForm, weeklyTarget: parseInt(e.target.value) || 1 })}
                      className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                    />
                  </div>
                )}
              </>
            )}

            {editMode.type === 'task' && (
              <>
                <div>
                  <label className="text-xs text-green-400 block mb-1">TASK NAME</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-green-400 block mb-1">CONNECTED GOAL</label>
                  <select
                    value={editForm.goal || ''}
                    onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  >
                    <option value="">-- Select Goal --</option>
                    <optgroup label="Knowledge Transfer">
                      {books.map(book => (
                        <option key={`book-${book.id}`} value={book.title}>{book.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Long-term Objectives">
                      {goals.map(goal => (
                        <option key={`goal-${goal.id}`} value={goal.name}>{goal.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </>
            )}

            {editMode.type === 'goal' && (
              <>
                <div>
                  <label className="text-xs text-green-400 block mb-1">GOAL NAME</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-green-400 block mb-1">TARGET</label>
                  <input
                    type="number"
                    value={editForm.target || 100}
                    onChange={(e) => setEditForm({ ...editForm, target: parseInt(e.target.value) })}
                    className="w-full bg-gray-900 border border-green-500 text-green-400 p-2 font-mono"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={saveEdit}
              className="flex-1 bg-cyan-900 border border-cyan-400 text-cyan-300 py-2 hover:bg-cyan-800 transition-all"
            >
              SAVE
            </button>
            <button
              onClick={() => { setEditMode(null); setEditForm({}); }}
              className="flex-1 bg-gray-900 border border-gray-500 text-gray-400 py-2 hover:bg-gray-800 transition-all"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="max-w-md mx-auto relative z-10 space-y-4">
      {/* Header */}
      <div className="text-center border-2 border-green-500 bg-black/80 p-4 shadow-lg shadow-green-500/50">
        <h1 className="text-2xl font-bold mb-2 text-cyan-400 glitch">SYSTEM.DASHBOARD</h1>
        <div className="text-xs text-green-300">// REALITY_OVERRIDE.EXE</div>
        <div className="flex gap-2 mt-3 justify-center">
          <button
            onClick={() => setShowJournal(true)}
            className="text-xs bg-purple-900 border border-purple-500 text-purple-300 px-3 py-1 hover:bg-purple-800 transition-all"
          >
            JOURNAL
          </button>
          {storyState.unlockedThemes.length > 1 && (
            <button
              onClick={() => {
                const currentIndex = storyState.unlockedThemes.indexOf(storyState.currentTheme);
                const nextIndex = (currentIndex + 1) % storyState.unlockedThemes.length;
                switchTheme(storyState.unlockedThemes[nextIndex]);
              }}
              className="text-xs bg-yellow-900 border border-yellow-500 text-yellow-300 px-3 py-1 hover:bg-yellow-800 transition-all"
            >
              SWITCH WORLD
            </button>
          )}
        </div>
      </div>

      {/* Character Stats */}
      <div className="border-2 border-green-500 bg-black/80 p-4 shadow-lg shadow-green-500/50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-lg text-cyan-400">OPERATOR_LVL.{character.level}</div>
            <div className="text-xs text-green-300">XP: {character.xp}/{character.xpToNext}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-pink-400">
              <Heart size={16} />
              <span>{character.health}/{character.maxHealth}</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-900 h-3 rounded border border-green-500 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-500"
            style={{ width: `${(character.xp / character.xpToNext) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Dumbbell size={14} className="text-red-400" />
            <span className="text-red-400">STR: {character.stats.strength}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-blue-400" />
            <span className="text-blue-400">INT: {character.stats.intelligence}</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-purple-400" />
            <span className="text-purple-400">WIS: {character.stats.wisdom}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-yellow-400">CRE: {character.stats.creativity}</span>
          </div>
        </div>
      </div>

      {/* Monster */}
      <div className="border-2 border-red-500 bg-black/80 p-4 shadow-lg shadow-red-500/50 relative">
        {showDamage && (
          <div
            className={`absolute text-2xl font-bold animate-ping ${showDamage.isPlayerDamage ? 'text-red-400' : 'text-red-400'}`}
            style={{ left: `${showDamage.x}%`, top: `${showDamage.y}%` }}
          >
            {showDamage.amount}
          </div>
        )}
        {showXP && (
          <div
            className="absolute text-xl font-bold text-cyan-400 animate-ping"
            style={{ left: `${showXP.x}%`, top: `${showXP.y}%` }}
          >
            {showXP.amount}XP
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <Skull size={32} className="text-red-500" />
          <div className="flex-1">
            <div className="text-lg text-red-400">{monster.name}</div>
            <div className="text-xs text-gray-400">LVL.{monster.level}</div>
          </div>
          <div className="text-right text-sm text-red-300">
            {monster.health}/{monster.maxHealth}
          </div>
        </div>

        <div className="w-full bg-gray-900 h-4 rounded border border-red-500 mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-500"
            style={{ width: `${(monster.health / monster.maxHealth) * 100}%` }}
          />
        </div>

        <div className="text-xs text-gray-400 italic">"{monster.description}"</div>
      </div>

      {/* Daily Habits */}
      <div className="border-2 border-green-500 bg-black/80 p-4 shadow-lg shadow-green-500/50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg text-cyan-400 flex items-center gap-2">
            <Zap size={18} /> DAILY_PROTOCOLS
          </h2>
          <button
            onClick={addHabit}
            className="text-xs bg-green-900 border border-green-500 text-green-300 px-3 py-1 hover:bg-green-800 transition-all"
          >
            + ADD
          </button>
        </div>
        <div className="space-y-2">
          {habits.map(habit => (
            <div
              key={habit.id}
              className="flex items-center gap-2 p-2 border border-green-500/30 bg-gray-900/50 group"
            >
              <div
                className={`w-5 h-5 border-2 cursor-pointer ${habit.completed ? 'border-cyan-400 bg-cyan-400' : 'border-green-500'}`}
                onClick={() => toggleHabit(habit.id)}
              >
                {habit.completed && <div className="text-black text-center text-xs">✓</div>}
              </div>
              <div className="flex-1">
                <div className={habit.completed ? 'line-through text-gray-500' : ''}>{habit.name}</div>
                {habit.frequency === 'weekly' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: habit.weeklyTarget || 3 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 border border-green-500 ${i < (habit.weeklyProgress || 0) ? 'bg-cyan-400' : 'bg-gray-800'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-green-300">{habit.weeklyProgress || 0}/{habit.weeklyTarget || 3} this week</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-green-300">
                    <span>🔥 {habit.streak || 0} day streak</span>
                    {(habit.longestStreak || 0) > 0 && (
                      <span className="text-yellow-400">⭐ Best: {habit.longestStreak}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit('habit', habit.id)}
                  className="text-xs bg-blue-900 border border-blue-500 text-blue-300 px-2 py-1 hover:bg-blue-800"
                >
                  EDIT
                </button>
                <button
                  onClick={() => deleteItem('habit', habit.id)}
                  className="text-xs bg-red-900 border border-red-500 text-red-300 px-2 py-1 hover:bg-red-800"
                >
                  DEL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Books */}
      <div className="border-2 border-blue-500 bg-black/80 p-4 shadow-lg shadow-blue-500/50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg text-cyan-400 flex items-center gap-2">
            <BookOpen size={18} /> KNOWLEDGE_TRANSFER
          </h2>
          <button
            onClick={addBook}
            className="text-xs bg-blue-900 border border-blue-500 text-blue-300 px-3 py-1 hover:bg-blue-800 transition-all"
          >
            + ADD
          </button>
        </div>
        <div className="space-y-3">
          {books.map(book => {
            const currentSessionProgress = book.frequency === 'weekly'
              ? (book.minutesToday % book.goal) / book.goal
              : 0;
            const completedSessions = book.frequency === 'weekly'
              ? Math.floor(book.minutesToday / book.goal)
              : 0;

            return (
              <div key={book.id} className="border border-blue-500/30 p-3 bg-gray-900/50 group">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl">{book.cover}</div>
                  <div className="flex-1">
                    <div className="text-sm">{book.title}</div>
                    {book.frequency === 'weekly' ? (
                      <div className="text-xs text-blue-300">
                        {book.weeklyProgress || 0}/{book.weeklyTarget || 3} sessions • {book.minutesToday} min today
                      </div>
                    ) : (
                      <div className="text-xs text-blue-300">{book.minutesToday}/{book.goal} min today</div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit('book', book.id)}
                      className="text-xs bg-purple-900 border border-purple-500 text-purple-300 px-2 py-1 hover:bg-purple-800"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => deleteItem('book', book.id)}
                      className="text-xs bg-red-900 border border-red-500 text-red-300 px-2 py-1 hover:bg-red-800"
                    >
                      DEL
                    </button>
                  </div>
                </div>

                {book.frequency === 'weekly' ? (
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: book.weeklyTarget || 3 }).map((_, i) => {
                      let fillPercent = 0;
                      if (i < completedSessions) {
                        fillPercent = 100; // Completed sessions
                      } else if (i === completedSessions) {
                        fillPercent = currentSessionProgress * 100; // Current session in progress
                      }

                      return (
                        <div key={i} className="flex-1 h-3 border border-blue-500 bg-gray-800 relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cyan-400 transition-all"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full bg-gray-900 h-2 rounded border border-blue-500 overflow-hidden mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all"
                      style={{ width: `${Math.min((book.minutesToday / book.goal) * 100, 100)}%` }}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => addReadingMinutes(book.id, 5)}
                    className="flex-1 bg-blue-900 border border-blue-500 text-blue-300 py-1 text-xs hover:bg-blue-800 transition-all"
                  >
                    +5 MIN
                  </button>
                  <button
                    onClick={() => addReadingMinutes(book.id, 10)}
                    className="flex-1 bg-blue-900 border border-blue-500 text-blue-300 py-1 text-xs hover:bg-blue-800 transition-all"
                  >
                    +10 MIN
                  </button>
                  {book.minutesToday > 0 && (
                    <button
                      onClick={() => removeReadingMinutes(book.id, 5)}
                      className="bg-red-900 border border-red-500 text-red-300 py-1 px-2 text-xs hover:bg-red-800 transition-all"
                    >
                      -5
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks */}
      <div className="border-2 border-purple-500 bg-black/80 p-4 shadow-lg shadow-purple-500/50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg text-cyan-400 flex items-center gap-2">
            <Trophy size={18} /> ACTIVE_MISSIONS
          </h2>
          <button
            onClick={addTask}
            className="text-xs bg-purple-900 border border-purple-500 text-purple-300 px-3 py-1 hover:bg-purple-800 transition-all"
          >
            + ADD
          </button>
        </div>
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className="p-3 border border-purple-500/30 bg-gray-900/50 group"
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-5 h-5 border-2 mt-1 cursor-pointer ${task.completed ? 'border-purple-400 bg-purple-400' : 'border-purple-500'}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed && <div className="text-black text-center text-xs">✓</div>}
                </div>
                <div className="flex-1">
                  <div className={task.completed ? 'line-through text-gray-500' : ''}>{task.name}</div>
                  <div className="text-xs text-purple-300">→ {task.goal}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit('task', task.id)}
                    className="text-xs bg-blue-900 border border-blue-500 text-blue-300 px-2 py-1 hover:bg-blue-800"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => deleteItem('task', task.id)}
                    className="text-xs bg-red-900 border border-red-500 text-red-300 px-2 py-1 hover:bg-red-800"
                  >
                    DEL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long-term Goals */}
      <div className="border-2 border-yellow-500 bg-black/80 p-4 shadow-lg shadow-yellow-500/50 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg text-cyan-400 flex items-center gap-2">
            <Swords size={18} /> LONG_TERM_OBJECTIVES
          </h2>
          <button
            onClick={addGoal}
            className="text-xs bg-yellow-900 border border-yellow-500 text-yellow-300 px-3 py-1 hover:bg-yellow-800 transition-all"
          >
            + ADD
          </button>
        </div>
        <div className="space-y-3">
          {goals
            .sort((a, b) => {
              const aComplete = a.progress >= a.target;
              const bComplete = b.progress >= b.target;
              if (aComplete === bComplete) return 0;
              return aComplete ? 1 : -1; // Incomplete goals first
            })
            .map(goal => (
              <div key={goal.id} className="border border-yellow-500/30 p-3 bg-gray-900/50 group">
                <div className="flex justify-between mb-2">
                  <div className="flex-1">
                    <div className={`text-sm ${goal.progress >= goal.target ? 'text-gray-500 line-through' : ''}`}>
                      {goal.name}
                    </div>
                    {goal.progress >= goal.target && (
                      <div className="text-xs text-yellow-400">✨ COMPLETE</div>
                    )}
                    {goal.progress < goal.target && (
                      <div className="text-xs text-yellow-300">{goal.progress}/{goal.target}</div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit('goal', goal.id)}
                      className="text-xs bg-blue-900 border border-blue-500 text-blue-300 px-2 py-1 hover:bg-blue-800"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => deleteItem('goal', goal.id)}
                      className="text-xs bg-red-900 border border-red-500 text-red-300 px-2 py-1 hover:bg-red-800"
                    >
                      DEL
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-900 h-3 rounded border border-yellow-500 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full transition-all"
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      const wasComplete = goal.progress >= goal.target;
                      setGoals(goals.map(g => g.id === goal.id ? { ...g, progress: Math.min(g.progress + 1, g.target) } : g));
                      // If goal just completed, deal massive damage
                      if (!wasComplete && goal.progress + 1 >= goal.target) {
                        dealDamage(100, 200);
                      }
                    }}
                    className="flex-1 bg-yellow-900 border border-yellow-500 text-yellow-300 py-1 text-xs hover:bg-yellow-800 transition-all"
                  >
                    +1 PROGRESS
                  </button>
                  {goal.progress > 0 && (
                    <button
                      onClick={() => {
                        const wasComplete = goal.progress >= goal.target;
                        setGoals(goals.map(g => g.id === goal.id ? { ...g, progress: Math.max(0, g.progress - 1) } : g));
                        // If goal was complete and now isn't, reverse the damage (no attack, just fixing a mistake)
                        if (wasComplete && goal.progress - 1 < goal.target) {
                          healMonster(100, 200);
                        }
                      }}
                      className="bg-red-900 border border-red-500 text-red-300 py-1 px-2 text-xs hover:bg-red-800 transition-all"
                    >
                      -1
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>

    <style jsx>{`
    @keyframes glitch {
      0% { text-shadow: 2px 2px #ff00de, -2px -2px #00ffff; }
      25% { text-shadow: -2px 2px #ff00de, 2px -2px #00ffff; }
      50% { text-shadow: 2px -2px #ff00de, -2px 2px #00ffff; }
      75% { text-shadow: -2px -2px #ff00de, 2px 2px #00ffff; }
      100% { text-shadow: 2px 2px #ff00de, -2px -2px #00ffff; }
    }
    .glitch {
      animation: glitch 3s infinite;
    }
  `}</style>
  </div>
```

);
}