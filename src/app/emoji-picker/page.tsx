"use client";

import { useState, useEffect, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import { useToast } from "@/components/ui/Toast";
import SeoContent from "@/components/tools/SeoContent";

interface EmojiEntry {
  emoji: string;
  name: string;
  category: string;
}

const CATEGORIES = [
  "All",
  "Smileys & Emotion",
  "People & Gestures",
  "Animals",
  "Food & Drink",
  "Travel & Places",
  "Objects",
  "Symbols",
  "Flags",
] as const;

const EMOJIS: EmojiEntry[] = [
  // Smileys & Emotion
  { emoji: "\u{1F600}", name: "grinning face", category: "Smileys & Emotion" },
  { emoji: "\u{1F603}", name: "grinning face with big eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F604}", name: "grinning face with smiling eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F601}", name: "beaming face with smiling eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F606}", name: "grinning squinting face", category: "Smileys & Emotion" },
  { emoji: "\u{1F605}", name: "grinning face with sweat", category: "Smileys & Emotion" },
  { emoji: "\u{1F923}", name: "rolling on the floor laughing", category: "Smileys & Emotion" },
  { emoji: "\u{1F602}", name: "face with tears of joy", category: "Smileys & Emotion" },
  { emoji: "\u{1F642}", name: "slightly smiling face", category: "Smileys & Emotion" },
  { emoji: "\u{1F60A}", name: "smiling face with smiling eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F607}", name: "smiling face with halo", category: "Smileys & Emotion" },
  { emoji: "\u{1F970}", name: "smiling face with hearts", category: "Smileys & Emotion" },
  { emoji: "\u{1F60D}", name: "smiling face with heart eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F929}", name: "star struck", category: "Smileys & Emotion" },
  { emoji: "\u{1F618}", name: "face blowing a kiss", category: "Smileys & Emotion" },
  { emoji: "\u{1F617}", name: "kissing face", category: "Smileys & Emotion" },
  { emoji: "\u{1F61A}", name: "kissing face with closed eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F60B}", name: "face savoring food", category: "Smileys & Emotion" },
  { emoji: "\u{1F61B}", name: "face with tongue", category: "Smileys & Emotion" },
  { emoji: "\u{1F61C}", name: "winking face with tongue", category: "Smileys & Emotion" },
  { emoji: "\u{1F92A}", name: "zany face", category: "Smileys & Emotion" },
  { emoji: "\u{1F61D}", name: "squinting face with tongue", category: "Smileys & Emotion" },
  { emoji: "\u{1F911}", name: "money mouth face", category: "Smileys & Emotion" },
  { emoji: "\u{1F917}", name: "hugging face", category: "Smileys & Emotion" },
  { emoji: "\u{1F92D}", name: "face with hand over mouth", category: "Smileys & Emotion" },
  { emoji: "\u{1F92B}", name: "shushing face", category: "Smileys & Emotion" },
  { emoji: "\u{1F914}", name: "thinking face", category: "Smileys & Emotion" },
  { emoji: "\u{1F610}", name: "neutral face", category: "Smileys & Emotion" },
  { emoji: "\u{1F611}", name: "expressionless face", category: "Smileys & Emotion" },
  { emoji: "\u{1F636}", name: "face without mouth", category: "Smileys & Emotion" },
  { emoji: "\u{1F644}", name: "face with rolling eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F60F}", name: "smirking face", category: "Smileys & Emotion" },
  { emoji: "\u{1F623}", name: "persevering face", category: "Smileys & Emotion" },
  { emoji: "\u{1F625}", name: "sad but relieved face", category: "Smileys & Emotion" },
  { emoji: "\u{1F62E}", name: "face with open mouth", category: "Smileys & Emotion" },
  { emoji: "\u{1F910}", name: "zipper mouth face", category: "Smileys & Emotion" },
  { emoji: "\u{1F62F}", name: "hushed face", category: "Smileys & Emotion" },
  { emoji: "\u{1F62A}", name: "sleepy face", category: "Smileys & Emotion" },
  { emoji: "\u{1F62B}", name: "tired face", category: "Smileys & Emotion" },
  { emoji: "\u{1F971}", name: "yawning face", category: "Smileys & Emotion" },
  { emoji: "\u{1F634}", name: "sleeping face", category: "Smileys & Emotion" },
  { emoji: "\u{1F60C}", name: "relieved face", category: "Smileys & Emotion" },
  { emoji: "\u{1F924}", name: "drooling face", category: "Smileys & Emotion" },
  { emoji: "\u{1F612}", name: "unamused face", category: "Smileys & Emotion" },
  { emoji: "\u{1F613}", name: "downcast face with sweat", category: "Smileys & Emotion" },
  { emoji: "\u{1F614}", name: "pensive face", category: "Smileys & Emotion" },
  { emoji: "\u{1F615}", name: "confused face", category: "Smileys & Emotion" },
  { emoji: "\u{1F643}", name: "upside down face", category: "Smileys & Emotion" },
  { emoji: "\u{1F632}", name: "astonished face", category: "Smileys & Emotion" },
  { emoji: "\u{2639}\u{FE0F}", name: "frowning face", category: "Smileys & Emotion" },
  { emoji: "\u{1F641}", name: "slightly frowning face", category: "Smileys & Emotion" },
  { emoji: "\u{1F616}", name: "confounded face", category: "Smileys & Emotion" },
  { emoji: "\u{1F61E}", name: "disappointed face", category: "Smileys & Emotion" },
  { emoji: "\u{1F61F}", name: "worried face", category: "Smileys & Emotion" },
  { emoji: "\u{1F624}", name: "face with steam from nose", category: "Smileys & Emotion" },
  { emoji: "\u{1F622}", name: "crying face", category: "Smileys & Emotion" },
  { emoji: "\u{1F62D}", name: "loudly crying face", category: "Smileys & Emotion" },
  { emoji: "\u{1F626}", name: "frowning face with open mouth", category: "Smileys & Emotion" },
  { emoji: "\u{1F627}", name: "anguished face", category: "Smileys & Emotion" },
  { emoji: "\u{1F628}", name: "fearful face", category: "Smileys & Emotion" },
  { emoji: "\u{1F629}", name: "weary face", category: "Smileys & Emotion" },
  { emoji: "\u{1F92F}", name: "exploding head", category: "Smileys & Emotion" },
  { emoji: "\u{1F62C}", name: "grimacing face", category: "Smileys & Emotion" },
  { emoji: "\u{1F630}", name: "anxious face with sweat", category: "Smileys & Emotion" },
  { emoji: "\u{1F631}", name: "face screaming in fear", category: "Smileys & Emotion" },
  { emoji: "\u{1F975}", name: "hot face", category: "Smileys & Emotion" },
  { emoji: "\u{1F976}", name: "cold face", category: "Smileys & Emotion" },
  { emoji: "\u{1F633}", name: "flushed face", category: "Smileys & Emotion" },
  { emoji: "\u{1F635}", name: "face with crossed out eyes", category: "Smileys & Emotion" },
  { emoji: "\u{1F621}", name: "pouting face", category: "Smileys & Emotion" },
  { emoji: "\u{1F620}", name: "angry face", category: "Smileys & Emotion" },
  { emoji: "\u{1F92C}", name: "face with symbols on mouth", category: "Smileys & Emotion" },

  // People & Gestures
  { emoji: "\u{1F44B}", name: "waving hand", category: "People & Gestures" },
  { emoji: "\u{1F91A}", name: "raised back of hand", category: "People & Gestures" },
  { emoji: "\u{1F590}\u{FE0F}", name: "hand with fingers splayed", category: "People & Gestures" },
  { emoji: "\u{270B}", name: "raised hand", category: "People & Gestures" },
  { emoji: "\u{1F596}", name: "vulcan salute", category: "People & Gestures" },
  { emoji: "\u{1F44C}", name: "ok hand", category: "People & Gestures" },
  { emoji: "\u{1F90C}", name: "pinched fingers", category: "People & Gestures" },
  { emoji: "\u{1F90F}", name: "pinching hand", category: "People & Gestures" },
  { emoji: "\u{270C}\u{FE0F}", name: "victory hand", category: "People & Gestures" },
  { emoji: "\u{1F91E}", name: "crossed fingers", category: "People & Gestures" },
  { emoji: "\u{1F91F}", name: "love you gesture", category: "People & Gestures" },
  { emoji: "\u{1F918}", name: "sign of the horns", category: "People & Gestures" },
  { emoji: "\u{1F919}", name: "call me hand", category: "People & Gestures" },
  { emoji: "\u{1F448}", name: "backhand index pointing left", category: "People & Gestures" },
  { emoji: "\u{1F449}", name: "backhand index pointing right", category: "People & Gestures" },
  { emoji: "\u{1F446}", name: "backhand index pointing up", category: "People & Gestures" },
  { emoji: "\u{1F447}", name: "backhand index pointing down", category: "People & Gestures" },
  { emoji: "\u{261D}\u{FE0F}", name: "index pointing up", category: "People & Gestures" },
  { emoji: "\u{1F44D}", name: "thumbs up", category: "People & Gestures" },
  { emoji: "\u{1F44E}", name: "thumbs down", category: "People & Gestures" },
  { emoji: "\u{270A}", name: "raised fist", category: "People & Gestures" },
  { emoji: "\u{1F44A}", name: "oncoming fist", category: "People & Gestures" },
  { emoji: "\u{1F91B}", name: "left facing fist", category: "People & Gestures" },
  { emoji: "\u{1F91C}", name: "right facing fist", category: "People & Gestures" },
  { emoji: "\u{1F44F}", name: "clapping hands", category: "People & Gestures" },
  { emoji: "\u{1F64C}", name: "raising hands", category: "People & Gestures" },
  { emoji: "\u{1F450}", name: "open hands", category: "People & Gestures" },
  { emoji: "\u{1F91D}", name: "handshake", category: "People & Gestures" },
  { emoji: "\u{1F64F}", name: "folded hands", category: "People & Gestures" },

  // Animals
  { emoji: "\u{1F436}", name: "dog face", category: "Animals" },
  { emoji: "\u{1F431}", name: "cat face", category: "Animals" },
  { emoji: "\u{1F42D}", name: "mouse face", category: "Animals" },
  { emoji: "\u{1F439}", name: "hamster", category: "Animals" },
  { emoji: "\u{1F430}", name: "rabbit face", category: "Animals" },
  { emoji: "\u{1F98A}", name: "fox", category: "Animals" },
  { emoji: "\u{1F43B}", name: "bear", category: "Animals" },
  { emoji: "\u{1F43C}", name: "panda", category: "Animals" },
  { emoji: "\u{1F428}", name: "koala", category: "Animals" },
  { emoji: "\u{1F42F}", name: "tiger face", category: "Animals" },
  { emoji: "\u{1F981}", name: "lion", category: "Animals" },
  { emoji: "\u{1F42E}", name: "cow face", category: "Animals" },
  { emoji: "\u{1F437}", name: "pig face", category: "Animals" },
  { emoji: "\u{1F438}", name: "frog", category: "Animals" },
  { emoji: "\u{1F435}", name: "monkey face", category: "Animals" },
  { emoji: "\u{1F414}", name: "chicken", category: "Animals" },
  { emoji: "\u{1F427}", name: "penguin", category: "Animals" },
  { emoji: "\u{1F426}", name: "bird", category: "Animals" },
  { emoji: "\u{1F986}", name: "duck", category: "Animals" },
  { emoji: "\u{1F985}", name: "eagle", category: "Animals" },
  { emoji: "\u{1F989}", name: "owl", category: "Animals" },
  { emoji: "\u{1F43A}", name: "wolf", category: "Animals" },
  { emoji: "\u{1F417}", name: "boar", category: "Animals" },
  { emoji: "\u{1F434}", name: "horse face", category: "Animals" },
  { emoji: "\u{1F984}", name: "unicorn", category: "Animals" },
  { emoji: "\u{1F41D}", name: "honeybee", category: "Animals" },
  { emoji: "\u{1FAB1}", name: "worm", category: "Animals" },
  { emoji: "\u{1F41B}", name: "bug", category: "Animals" },
  { emoji: "\u{1F98B}", name: "butterfly", category: "Animals" },
  { emoji: "\u{1F40C}", name: "snail", category: "Animals" },
  { emoji: "\u{1F41E}", name: "lady beetle", category: "Animals" },

  // Food & Drink
  { emoji: "\u{1F34E}", name: "red apple", category: "Food & Drink" },
  { emoji: "\u{1F350}", name: "pear", category: "Food & Drink" },
  { emoji: "\u{1F34A}", name: "tangerine", category: "Food & Drink" },
  { emoji: "\u{1F34B}", name: "lemon", category: "Food & Drink" },
  { emoji: "\u{1F34C}", name: "banana", category: "Food & Drink" },
  { emoji: "\u{1F349}", name: "watermelon", category: "Food & Drink" },
  { emoji: "\u{1F347}", name: "grapes", category: "Food & Drink" },
  { emoji: "\u{1F353}", name: "strawberry", category: "Food & Drink" },
  { emoji: "\u{1FAD0}", name: "blueberries", category: "Food & Drink" },
  { emoji: "\u{1F348}", name: "melon", category: "Food & Drink" },
  { emoji: "\u{1F352}", name: "cherries", category: "Food & Drink" },
  { emoji: "\u{1F351}", name: "peach", category: "Food & Drink" },
  { emoji: "\u{1F96D}", name: "mango", category: "Food & Drink" },
  { emoji: "\u{1F34D}", name: "pineapple", category: "Food & Drink" },
  { emoji: "\u{1F965}", name: "coconut", category: "Food & Drink" },
  { emoji: "\u{1F95D}", name: "kiwi fruit", category: "Food & Drink" },
  { emoji: "\u{1F345}", name: "tomato", category: "Food & Drink" },
  { emoji: "\u{1FAD2}", name: "olive", category: "Food & Drink" },
  { emoji: "\u{1F951}", name: "avocado", category: "Food & Drink" },
  { emoji: "\u{1F346}", name: "eggplant", category: "Food & Drink" },
  { emoji: "\u{1F954}", name: "potato", category: "Food & Drink" },
  { emoji: "\u{1F955}", name: "carrot", category: "Food & Drink" },
  { emoji: "\u{1F33D}", name: "ear of corn", category: "Food & Drink" },
  { emoji: "\u{1F336}\u{FE0F}", name: "hot pepper", category: "Food & Drink" },
  { emoji: "\u{1FAD1}", name: "bell pepper", category: "Food & Drink" },
  { emoji: "\u{1F952}", name: "cucumber", category: "Food & Drink" },
  { emoji: "\u{1F96C}", name: "leafy green", category: "Food & Drink" },
  { emoji: "\u{1F966}", name: "broccoli", category: "Food & Drink" },
  { emoji: "\u{1F9C4}", name: "garlic", category: "Food & Drink" },
  { emoji: "\u{1F9C5}", name: "onion", category: "Food & Drink" },
  { emoji: "\u{1F344}", name: "mushroom", category: "Food & Drink" },

  // Travel & Places
  { emoji: "\u{2708}\u{FE0F}", name: "airplane", category: "Travel & Places" },
  { emoji: "\u{1F680}", name: "rocket", category: "Travel & Places" },
  { emoji: "\u{1F697}", name: "automobile", category: "Travel & Places" },
  { emoji: "\u{1F695}", name: "taxi", category: "Travel & Places" },
  { emoji: "\u{1F699}", name: "sport utility vehicle", category: "Travel & Places" },
  { emoji: "\u{1F68C}", name: "bus", category: "Travel & Places" },
  { emoji: "\u{1F68E}", name: "trolleybus", category: "Travel & Places" },
  { emoji: "\u{1F3CE}", name: "racing car", category: "Travel & Places" },
  { emoji: "\u{1F693}", name: "police car", category: "Travel & Places" },
  { emoji: "\u{1F691}", name: "ambulance", category: "Travel & Places" },
  { emoji: "\u{1F692}", name: "fire engine", category: "Travel & Places" },
  { emoji: "\u{1F690}", name: "minibus", category: "Travel & Places" },
  { emoji: "\u{1F6FB}", name: "pickup truck", category: "Travel & Places" },
  { emoji: "\u{1F69A}", name: "delivery truck", category: "Travel & Places" },
  { emoji: "\u{1F69B}", name: "articulated lorry", category: "Travel & Places" },
  { emoji: "\u{1F3CD}", name: "motorcycle", category: "Travel & Places" },
  { emoji: "\u{1F6F5}", name: "motor scooter", category: "Travel & Places" },
  { emoji: "\u{1F6B2}", name: "bicycle", category: "Travel & Places" },
  { emoji: "\u{1F6F4}", name: "kick scooter", category: "Travel & Places" },
  { emoji: "\u{1F3E0}", name: "house", category: "Travel & Places" },
  { emoji: "\u{1F3E1}", name: "house with garden", category: "Travel & Places" },
  { emoji: "\u{1F3E2}", name: "office building", category: "Travel & Places" },
  { emoji: "\u{1F3E3}", name: "Japanese post office", category: "Travel & Places" },
  { emoji: "\u{1F3E4}", name: "post office", category: "Travel & Places" },
  { emoji: "\u{1F3E5}", name: "hospital", category: "Travel & Places" },
  { emoji: "\u{1F3E6}", name: "bank", category: "Travel & Places" },
  { emoji: "\u{1F3E8}", name: "hotel", category: "Travel & Places" },
  { emoji: "\u{1F3EA}", name: "convenience store", category: "Travel & Places" },
  { emoji: "\u{1F3EB}", name: "school", category: "Travel & Places" },

  // Objects
  { emoji: "\u{231A}", name: "watch", category: "Objects" },
  { emoji: "\u{1F4F1}", name: "mobile phone", category: "Objects" },
  { emoji: "\u{1F4BB}", name: "laptop", category: "Objects" },
  { emoji: "\u{2328}\u{FE0F}", name: "keyboard", category: "Objects" },
  { emoji: "\u{1F5A5}", name: "desktop computer", category: "Objects" },
  { emoji: "\u{1F5A8}", name: "printer", category: "Objects" },
  { emoji: "\u{1F5B1}", name: "computer mouse", category: "Objects" },
  { emoji: "\u{1F5B2}", name: "trackball", category: "Objects" },
  { emoji: "\u{1F579}", name: "joystick", category: "Objects" },
  { emoji: "\u{1F5DC}", name: "clamp", category: "Objects" },
  { emoji: "\u{1F4BE}", name: "floppy disk", category: "Objects" },
  { emoji: "\u{1F4BF}", name: "optical disk", category: "Objects" },
  { emoji: "\u{1F4C0}", name: "dvd", category: "Objects" },
  { emoji: "\u{1F4F7}", name: "camera", category: "Objects" },
  { emoji: "\u{1F4F9}", name: "video camera", category: "Objects" },
  { emoji: "\u{1F3A5}", name: "movie camera", category: "Objects" },
  { emoji: "\u{1F4FD}", name: "film projector", category: "Objects" },
  { emoji: "\u{1F39E}", name: "film frames", category: "Objects" },
  { emoji: "\u{1F4DE}", name: "telephone receiver", category: "Objects" },
  { emoji: "\u{260E}\u{FE0F}", name: "telephone", category: "Objects" },
  { emoji: "\u{1F4DF}", name: "pager", category: "Objects" },
  { emoji: "\u{1F4E0}", name: "fax machine", category: "Objects" },
  { emoji: "\u{1F4FA}", name: "television", category: "Objects" },
  { emoji: "\u{1F4FB}", name: "radio", category: "Objects" },
  { emoji: "\u{1F399}", name: "studio microphone", category: "Objects" },
  { emoji: "\u{1F39A}", name: "level slider", category: "Objects" },
  { emoji: "\u{1F39B}", name: "control knobs", category: "Objects" },
  { emoji: "\u{23F1}", name: "stopwatch", category: "Objects" },
  { emoji: "\u{23F2}", name: "timer clock", category: "Objects" },
  { emoji: "\u{23F0}", name: "alarm clock", category: "Objects" },
  { emoji: "\u{1F570}", name: "mantelpiece clock", category: "Objects" },
  { emoji: "\u{1F4A1}", name: "light bulb", category: "Objects" },
  { emoji: "\u{1F526}", name: "flashlight", category: "Objects" },

  // Symbols
  { emoji: "\u{2764}\u{FE0F}", name: "red heart", category: "Symbols" },
  { emoji: "\u{1F9E1}", name: "orange heart", category: "Symbols" },
  { emoji: "\u{1F49B}", name: "yellow heart", category: "Symbols" },
  { emoji: "\u{1F49A}", name: "green heart", category: "Symbols" },
  { emoji: "\u{1F499}", name: "blue heart", category: "Symbols" },
  { emoji: "\u{1F49C}", name: "purple heart", category: "Symbols" },
  { emoji: "\u{1F5A4}", name: "black heart", category: "Symbols" },
  { emoji: "\u{1F90D}", name: "white heart", category: "Symbols" },
  { emoji: "\u{1F90E}", name: "brown heart", category: "Symbols" },
  { emoji: "\u{1F494}", name: "broken heart", category: "Symbols" },
  { emoji: "\u{2763}\u{FE0F}", name: "heart exclamation", category: "Symbols" },
  { emoji: "\u{1F495}", name: "two hearts", category: "Symbols" },
  { emoji: "\u{1F49E}", name: "revolving hearts", category: "Symbols" },
  { emoji: "\u{1F493}", name: "beating heart", category: "Symbols" },
  { emoji: "\u{1F497}", name: "growing heart", category: "Symbols" },
  { emoji: "\u{1F496}", name: "sparkling heart", category: "Symbols" },
  { emoji: "\u{1F498}", name: "heart with arrow", category: "Symbols" },
  { emoji: "\u{1F49D}", name: "heart with ribbon", category: "Symbols" },
  { emoji: "\u{2728}", name: "sparkles", category: "Symbols" },
  { emoji: "\u{2B50}", name: "star", category: "Symbols" },
  { emoji: "\u{1F31F}", name: "glowing star", category: "Symbols" },
  { emoji: "\u{1F4AB}", name: "dizzy", category: "Symbols" },
  { emoji: "\u{1F525}", name: "fire", category: "Symbols" },
  { emoji: "\u{1F4A5}", name: "collision", category: "Symbols" },
  { emoji: "\u{2600}\u{FE0F}", name: "sun", category: "Symbols" },
  { emoji: "\u{1F308}", name: "rainbow", category: "Symbols" },
  { emoji: "\u{26A1}", name: "high voltage", category: "Symbols" },
  { emoji: "\u{2744}\u{FE0F}", name: "snowflake", category: "Symbols" },
  { emoji: "\u{1F4A7}", name: "droplet", category: "Symbols" },
  { emoji: "\u{1F4A8}", name: "dashing away", category: "Symbols" },
  { emoji: "\u{1F3B5}", name: "musical note", category: "Symbols" },
  { emoji: "\u{1F3B6}", name: "musical notes", category: "Symbols" },

  // Flags
  { emoji: "\u{1F3C1}", name: "chequered flag", category: "Flags" },
  { emoji: "\u{1F6A9}", name: "triangular flag", category: "Flags" },
  { emoji: "\u{1F38C}", name: "crossed flags", category: "Flags" },
  { emoji: "\u{1F3F4}", name: "black flag", category: "Flags" },
  { emoji: "\u{1F3F3}\u{FE0F}", name: "white flag", category: "Flags" },
  { emoji: "\u{1F1FA}\u{1F1F8}", name: "flag United States", category: "Flags" },
  { emoji: "\u{1F1EC}\u{1F1E7}", name: "flag United Kingdom", category: "Flags" },
  { emoji: "\u{1F1EB}\u{1F1F7}", name: "flag France", category: "Flags" },
  { emoji: "\u{1F1E9}\u{1F1EA}", name: "flag Germany", category: "Flags" },
  { emoji: "\u{1F1EA}\u{1F1F8}", name: "flag Spain", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F9}", name: "flag Italy", category: "Flags" },
  { emoji: "\u{1F1EF}\u{1F1F5}", name: "flag Japan", category: "Flags" },
  { emoji: "\u{1F1F0}\u{1F1F7}", name: "flag South Korea", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1F3}", name: "flag China", category: "Flags" },
  { emoji: "\u{1F1E7}\u{1F1F7}", name: "flag Brazil", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F3}", name: "flag India", category: "Flags" },
  { emoji: "\u{1F1F7}\u{1F1FA}", name: "flag Russia", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1E6}", name: "flag Canada", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1FA}", name: "flag Australia", category: "Flags" },
  { emoji: "\u{1F1F2}\u{1F1FD}", name: "flag Mexico", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1F7}", name: "flag Argentina", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1F4}", name: "flag Colombia", category: "Flags" },
];

const RECENT_KEY = "recent-emojis";

export default function EmojiPickerTool() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) {
        setRecentEmojis(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const filteredEmojis = useMemo(() => {
    let list = EMOJIS;

    if (activeCategory !== "All") {
      list = list.filter((e) => e.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((e) => e.name.toLowerCase().includes(q));
    }

    return list;
  }, [search, activeCategory]);

  const handleEmojiClick = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = emoji;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    toast(`Copied ${emoji}!`);

    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      10
    );
    setRecentEmojis(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const faqs = [
    { question: "Do emojis work in all browsers?", answer: "Yes. Emojis are Unicode characters supported by all modern browsers and operating systems. The visual appearance may vary slightly between platforms (Apple, Google, Microsoft, Samsung) since each uses its own emoji designs." },
    { question: "Can I use emojis in code?", answer: "Yes. Emojis are valid Unicode characters that work in HTML, CSS content properties, JavaScript strings, Python, and most programming languages. They can even be used in some variable names (though this is not recommended for readability)." },
    { question: "Why do some emojis look different on different devices?", answer: "Each operating system and platform designs its own emoji graphics. Apple, Google, Microsoft, and Samsung all have unique emoji styles. The Unicode standard defines the meaning and code point, but not the visual design." },
  ];

  return (
    <ToolLayout
      title="Emoji Picker & Search"
      description="Search, browse, and copy emojis to your clipboard instantly."
      slug="emoji-picker"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Find and Copy Emojis", content: "Browse emojis by category or search by name to find the perfect emoji. Click any emoji to copy it to your clipboard. The picker includes 200+ commonly used emojis organized into categories: smileys, gestures, animals, food, activities, travel, objects, and symbols. Each emoji shows its name on hover for easy identification." },
            { title: "Using Emojis in Web Development and Marketing", content: "Emojis improve engagement in social media posts, email subject lines, push notifications, and UI elements. Studies show emoji in email subject lines can increase open rates by 56%. In web development, emojis are Unicode characters that work everywhere without images \u2014 use them in HTML, CSS (content property), JavaScript strings, and even domain names (punycode). They're supported by all modern browsers and operating systems." },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis by name..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm"
        />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors btn-press ${
                activeCategory === cat
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border border-[var(--border)] hover:bg-[var(--muted)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recently used */}
        {recentEmojis.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-[var(--muted-foreground)]">
              Recently Copied
            </h3>
            <div className="flex flex-wrap gap-1">
              {recentEmojis.map((emoji, i) => (
                <button
                  key={`recent-${i}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-xl transition-all hover:scale-110 hover:bg-[var(--muted)] btn-press"
                  title="Click to copy"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emoji grid */}
        <div>
          {filteredEmojis.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">
              No emojis found matching &quot;{search}&quot;
            </p>
          ) : (
            <div className="grid grid-cols-8 gap-1 sm:grid-cols-10 md:grid-cols-12">
              {filteredEmojis.map((entry, i) => (
                <button
                  key={`${entry.emoji}-${i}`}
                  onClick={() => handleEmojiClick(entry.emoji)}
                  className="group relative flex flex-col items-center justify-center rounded-lg p-1.5 transition-all hover:scale-110 hover:bg-[var(--muted)] btn-press"
                  title={entry.name}
                >
                  <span className="text-2xl sm:text-3xl">{entry.emoji}</span>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--foreground)] px-1.5 py-0.5 text-[10px] text-[var(--card)] opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10">
                    {entry.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-[var(--muted-foreground)]">
          {filteredEmojis.length} emoji{filteredEmojis.length !== 1 ? "s" : ""}{" "}
          shown. Click any emoji to copy it to your clipboard.
        </p>
      </div>
    </ToolLayout>
  );
}
