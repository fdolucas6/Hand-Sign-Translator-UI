import { AlphabetGuideItem } from '../types/asl';

const RAW_ALPHABET: AlphabetGuideItem[] = [
  {
    letter: 'A',
    name: 'Letter A',
    description: 'Fist closed, all four fingers curled into the palm, with the thumb resting straight upright against the side of the index finger.',
    fingerPositions: [
      'Thumb: Upright, flush against the radial edge of index finger',
      'Index, Middle, Ring, Pinky: Fully curled into a tight fist',
      'Wrist: Neutral, palm facing forward'
    ],
    tips: 'Do not tuck the thumb over your fingers—that is the letter S. The thumb must remain alongside the index finger.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['S', 'T', 'E'],
    svgPath: 'M 35 70 C 35 50, 45 40, 50 40 C 55 40, 60 50, 60 70 L 60 85 C 60 95, 40 95, 40 85 Z M 25 50 C 25 35, 35 30, 38 45 L 38 75'
  },
  {
    letter: 'B',
    name: 'Letter B',
    description: 'Four fingers held vertically upright, pressed tightly together, with the thumb tucked across the lower palm.',
    fingerPositions: [
      'Thumb: Bent across the base of the palm',
      'Index, Middle, Ring, Pinky: Extended straight up, touching each other',
      'Palm: Facing directly forward toward camera'
    ],
    tips: 'Keep all four fingers glued together. If they spread, it resembles the number 4.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['4', 'D'],
    svgPath: 'M 30 90 L 30 25 C 30 20, 36 20, 36 25 L 36 90 M 40 90 L 40 20 C 40 15, 46 15, 46 20 L 46 90 M 50 90 L 50 22 C 50 17, 56 17, 56 22 L 56 90 M 60 90 L 60 30 C 60 25, 66 25, 66 30 L 66 90'
  },
  {
    letter: 'C',
    name: 'Letter C',
    description: 'All fingers and thumb curved into an open arc, forming the shape of the Roman letter "C".',
    fingerPositions: [
      'Thumb: Curved outward from lower palm',
      'Index, Middle, Ring, Pinky: Curved together in an overarching semi-circle',
      'Palm: Facing slightly to the side to showcase the arc'
    ],
    tips: 'Think of cupping a baseball or coffee mug. Keep the curve natural and rounded.',
    difficulty: 'Easy',
    palmOrientation: 'Sideways',
    confusedWith: ['O'],
    svgPath: 'M 60 30 C 40 25, 25 45, 25 60 C 25 75, 40 95, 60 90 C 50 82, 38 72, 38 60 C 38 48, 50 38, 60 30 Z'
  },
  {
    letter: 'D',
    name: 'Letter D',
    description: 'Index finger extended straight up into the air; thumb, middle, ring, and pinky touch at fingertips forming a ring.',
    fingerPositions: [
      'Index: Pointed straight up',
      'Thumb: Tips touch middle, ring, and pinky fingers',
      'Palm: Facing forward or slightly inward'
    ],
    tips: 'Only ONE finger stands straight up. The other three fingertips touch the thumb tip to form the round stem of a lowercase "d".',
    difficulty: 'Medium',
    palmOrientation: 'Forward',
    confusedWith: ['1', 'F', 'B'],
    svgPath: 'M 45 90 L 45 20 C 45 15, 52 15, 52 20 L 52 65 C 62 65, 68 75, 68 85 C 68 95, 55 95, 45 90 Z'
  },
  {
    letter: 'E',
    name: 'Letter E',
    description: 'Fingers curled inward so the tips rest on or near the thumb, which is tucked horizontally beneath them.',
    fingerPositions: [
      'Thumb: Folded flat across the palm beneath the knuckles',
      'Index, Middle, Ring, Pinky: Curled down so fingertips hover over or rest on thumb edge',
      'Palm: Facing forward'
    ],
    tips: 'Make sure your fingertips do not touch the palm; they curl onto the thumb.',
    difficulty: 'Medium',
    palmOrientation: 'Forward',
    confusedWith: ['A', 'S'],
    svgPath: 'M 30 75 C 30 50, 70 50, 70 75 C 70 85, 30 85, 30 75 Z M 32 60 L 32 45 M 44 60 L 44 45 M 56 60 L 56 45 M 68 60 L 68 45'
  },
  {
    letter: 'F',
    name: 'Letter F',
    description: 'Index fingertip touches thumb tip to form a circle (like the "OK" gesture); middle, ring, and pinky stand straight up and spread.',
    fingerPositions: [
      'Index + Thumb: Tips touch, forming an open circle',
      'Middle, Ring, Pinky: Extended straight up and slightly separated',
      'Palm: Facing forward'
    ],
    tips: 'Do not confuse with D. In F, the three outer fingers are UP. In D, only the index is up.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['D', '9'],
    svgPath: 'M 35 65 C 35 55, 45 55, 45 65 C 45 75, 35 75, 35 65 Z M 52 90 L 52 25 M 62 90 L 62 28 M 72 90 L 72 35'
  },
  {
    letter: 'G',
    name: 'Letter G',
    description: 'Index finger and thumb extend parallel horizontally pointing sideways, spaced about one inch apart, other fingers folded.',
    fingerPositions: [
      'Index: Extended horizontally to the side',
      'Thumb: Parallel to index finger, forming a horizontal pinch',
      'Middle, Ring, Pinky: Curled closed into the palm'
    ],
    tips: 'Orient your hand so your knuckles face your non-dominant side.',
    difficulty: 'Medium',
    palmOrientation: 'Inward',
    confusedWith: ['H', 'L'],
    svgPath: 'M 25 75 L 75 75 M 25 60 L 75 60 C 80 60, 80 75, 75 75'
  },
  {
    letter: 'H',
    name: 'Letter H',
    description: 'Index and middle fingers extended straight horizontally together pointing sideways, thumb tucked beside them.',
    fingerPositions: [
      'Index & Middle: Extended horizontally together',
      'Ring & Pinky: Folded into the palm',
      'Thumb: Folded along the side of the hand'
    ],
    tips: 'H is just G with TWO fingers extended horizontally instead of one.',
    difficulty: 'Medium',
    palmOrientation: 'Inward',
    confusedWith: ['G', 'U', 'V'],
    svgPath: 'M 25 55 L 78 55 M 25 68 L 78 68 M 25 80 L 50 80'
  },
  {
    letter: 'I',
    name: 'Letter I',
    description: 'Pinky finger extended straight up; index, middle, ring, and thumb folded into a closed fist.',
    fingerPositions: [
      'Pinky: Extended straight up into the air',
      'Thumb: Folded over the curled index, middle, and ring fingers',
      'Palm: Facing forward'
    ],
    tips: 'Only the pinky is up. If you add the thumb pointing out, it becomes the sign for "I love you" (with index).',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['J', 'Y'],
    svgPath: 'M 35 85 C 35 65, 65 65, 65 85 L 65 95 L 35 95 Z M 65 85 L 65 30 C 65 25, 72 25, 72 30 L 72 85'
  },
  {
    letter: 'J',
    name: 'Letter J',
    description: 'Pinky finger extended (like "I"), then trace the letter "J" in the air by curving the pinky downward and inward.',
    fingerPositions: [
      'Pinky: Extended, drawing a "J" hook motion',
      'Other fingers: Curled in fist with thumb over knuckles',
      'Motion: Dynamic hook swoop'
    ],
    tips: 'J is one of two dynamic moving letters in fingerspelling (the other is Z).',
    difficulty: 'Advanced',
    palmOrientation: 'Forward',
    confusedWith: ['I', 'Z'],
    svgPath: 'M 65 30 L 65 70 C 65 90, 45 95, 35 85'
  },
  {
    letter: 'K',
    name: 'Letter K',
    description: 'Index and middle fingers form a "V" standing upright, with the thumb placed upright between them touching the middle finger knuckle.',
    fingerPositions: [
      'Index: Straight up',
      'Middle: Angled slightly forward and up',
      'Thumb: Standing upright between index and middle fingers',
      'Ring & Pinky: Curled into palm'
    ],
    tips: 'Your thumb should form the diagonal lower leg of the letter K.',
    difficulty: 'Advanced',
    palmOrientation: 'Forward',
    confusedWith: ['V', 'P'],
    svgPath: 'M 35 90 L 35 70 M 42 70 L 42 25 M 54 70 L 62 30 M 48 70 L 48 50'
  },
  {
    letter: 'L',
    name: 'Letter L',
    description: 'Thumb and index finger held perpendicular to form a crisp capital letter "L".',
    fingerPositions: [
      'Index: Straight up',
      'Thumb: Extended fully to the side at 90 degrees',
      'Middle, Ring, Pinky: Folded into the palm',
      'Palm: Facing forward'
    ],
    tips: 'One of the easiest letters. Make sure the angle between thumb and index is a crisp 90 degrees.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['G'],
    svgPath: 'M 48 90 L 48 25 C 48 20, 54 20, 54 25 L 54 75 L 85 75 C 90 75, 90 82, 85 82 L 48 82'
  },
  {
    letter: 'M',
    name: 'Letter M',
    description: 'Three fingers (index, middle, ring) folded over the thumb, which peeks out between the ring and pinky fingers.',
    fingerPositions: [
      'Thumb: Tucked under index, middle, and ring fingers',
      'Index, Middle, Ring: Folded over the thumb (3 knuckles visible)',
      'Pinky: Curled against the palm'
    ],
    tips: 'Count three finger humps over the thumb for M (like the 3 downward stems of M).',
    difficulty: 'Medium',
    palmOrientation: 'Forward',
    confusedWith: ['N', 'T', 'A', 'S'],
    svgPath: 'M 30 90 C 30 60, 75 60, 75 90 M 42 60 L 42 90 M 55 60 L 55 90 M 68 60 L 68 90'
  },
  {
    letter: 'N',
    name: 'Letter N',
    description: 'Two fingers (index and middle) folded over the thumb, which peeks out between the middle and ring fingers.',
    fingerPositions: [
      'Thumb: Tucked under index and middle fingers',
      'Index & Middle: Folded over thumb (2 knuckles visible)',
      'Ring & Pinky: Folded into palm'
    ],
    tips: 'Two finger humps over the thumb = N (2 stems of letter N).',
    difficulty: 'Medium',
    palmOrientation: 'Forward',
    confusedWith: ['M', 'T', 'H'],
    svgPath: 'M 32 90 C 32 60, 68 60, 68 90 M 45 60 L 45 90 M 58 60 L 58 90'
  },
  {
    letter: 'O',
    name: 'Letter O',
    description: 'All fingers curved smoothly downward to touch the curved thumb, forming a complete circle or oval "O".',
    fingerPositions: [
      'All 4 fingers: Curved to meet the thumb tip',
      'Thumb: Curved to complete the oval',
      'Palm: Facing forward or 3/4 angle'
    ],
    tips: 'Ensure the tips touch to complete a hollow circular silhouette.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['C', 'E'],
    svgPath: 'M 50 30 C 35 30, 30 50, 30 65 C 30 80, 35 90, 50 90 C 65 90, 70 80, 70 65 C 70 50, 65 30, 50 30 Z'
  },
  {
    letter: 'P',
    name: 'Letter P',
    description: 'Similar to the letter K, but pointed downwards with the wrist tilted downward.',
    fingerPositions: [
      'Index: Pointed straight forward / horizontally',
      'Middle: Pointed straight down',
      'Thumb: Resting on the middle finger joint',
      'Wrist: Dropped downward at angle'
    ],
    tips: 'P is essentially an upside-down K directed toward the floor.',
    difficulty: 'Advanced',
    palmOrientation: 'Inward',
    confusedWith: ['K', 'Q'],
    svgPath: 'M 40 45 L 75 45 M 40 45 L 40 85 M 48 45 L 48 65'
  },
  {
    letter: 'Q',
    name: 'Letter Q',
    description: 'Similar to the letter G, but pointed straight down toward the ground.',
    fingerPositions: [
      'Index: Pointed straight down',
      'Thumb: Parallel to index pointing down',
      'Other fingers: Curled in fist'
    ],
    tips: 'Q is simply G rotated downward so fingers point to the floor.',
    difficulty: 'Advanced',
    palmOrientation: 'Inward',
    confusedWith: ['G', 'P'],
    svgPath: 'M 45 40 L 45 85 M 58 40 L 58 85'
  },
  {
    letter: 'R',
    name: 'Letter R',
    description: 'Index and middle fingers extended upright and crossed over each other (like crossing your fingers for good luck).',
    fingerPositions: [
      'Index & Middle: Extended and crossed (middle behind index)',
      'Thumb: Holds down the curled ring and pinky fingers',
      'Palm: Facing forward'
    ],
    tips: 'Think "fingers crossed for good luck" to remember R.',
    difficulty: 'Medium',
    palmOrientation: 'Forward',
    confusedWith: ['U', 'V'],
    svgPath: 'M 48 90 L 48 55 L 56 25 M 56 90 L 56 55 L 46 25'
  },
  {
    letter: 'S',
    name: 'Letter S',
    description: 'A tight fist with the thumb wrapped firmly across the front of all curled fingers.',
    fingerPositions: [
      'All 4 fingers: Curled tightly into a fist',
      'Thumb: Folded horizontally across the front of the fingers',
      'Palm: Facing forward'
    ],
    tips: 'Compare to A: for A, thumb is on the side. For S, thumb crosses right over the front of the fingers.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['A', 'E', 'T'],
    svgPath: 'M 30 85 C 30 55, 70 55, 70 85 L 70 92 L 30 92 Z M 25 72 L 75 72'
  },
  {
    letter: 'T',
    name: 'Letter T',
    description: 'Fist with thumb tucked between index and middle fingers, peeking out on top.',
    fingerPositions: [
      'Thumb: Tucked under index finger, emerging between index and middle',
      'Index: Folded over the thumb',
      'Middle, Ring, Pinky: Curled into palm'
    ],
    tips: 'One finger over the thumb = T. Two fingers = N. Three fingers = M.',
    difficulty: 'Medium',
    palmOrientation: 'Forward',
    confusedWith: ['A', 'S', 'M', 'N'],
    svgPath: 'M 32 90 C 32 60, 68 60, 68 90 M 42 60 L 42 90 M 42 75 L 55 75'
  },
  {
    letter: 'U',
    name: 'Letter U',
    description: 'Index and middle fingers extended straight up and held tightly together, thumb folded over ring and pinky.',
    fingerPositions: [
      'Index & Middle: Straight up, touching side by side',
      'Ring & Pinky: Folded into palm',
      'Thumb: Tucked over curled fingers'
    ],
    tips: 'Keep index and middle tightly pressed together. If you separate them, it becomes V.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['V', 'H', 'R'],
    svgPath: 'M 44 90 L 44 25 M 54 90 L 54 25 M 34 85 C 34 65, 64 65, 64 85'
  },
  {
    letter: 'V',
    name: 'Letter V',
    description: 'Index and middle fingers extended straight up and separated into a "V" shape (peace sign).',
    fingerPositions: [
      'Index & Middle: Straight up and spread apart in a V',
      'Ring & Pinky: Folded into palm',
      'Thumb: Holding down ring and pinky'
    ],
    tips: 'The classic peace sign. Make sure fingers are spread wide.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['U', 'K', '2'],
    svgPath: 'M 38 90 L 32 25 M 58 90 L 68 25 M 35 85 C 35 65, 65 65, 65 85'
  },
  {
    letter: 'W',
    name: 'Letter W',
    description: 'Index, middle, and ring fingers extended straight up and spread apart, forming the shape of a "W".',
    fingerPositions: [
      'Index, Middle, Ring: Straight up and spread evenly',
      'Pinky: Held down by the thumb tip',
      'Palm: Facing forward'
    ],
    tips: 'Three fingers spread wide. Looks just like the letter W.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['3', '6', 'F'],
    svgPath: 'M 32 90 L 26 25 M 48 90 L 48 22 M 64 90 L 70 25'
  },
  {
    letter: 'X',
    name: 'Letter X',
    description: 'Fist with index finger raised and hooked/curved forward into a hook shape (like Captain Hook).',
    fingerPositions: [
      'Index: Extended and bent at the first and second knuckles like a hook',
      'Other fingers: Closed in a fist',
      'Thumb: Resting across the curled fingers'
    ],
    tips: 'Think of a pirate’s hook for X.',
    difficulty: 'Medium',
    palmOrientation: 'Forward',
    confusedWith: ['D', '1'],
    svgPath: 'M 35 85 C 35 65, 65 65, 65 85 L 65 92 L 35 92 Z M 48 65 L 48 35 C 48 25, 60 25, 60 38'
  },
  {
    letter: 'Y',
    name: 'Letter Y',
    description: 'Thumb and pinky fingers extended wide apart; index, middle, and ring fingers curled into the palm.',
    fingerPositions: [
      'Thumb & Pinky: Extended fully outward to each side',
      'Index, Middle, Ring: Folded into the palm',
      'Palm: Facing forward'
    ],
    tips: 'Like the "hang loose" or "shaka" sign or a telephone gesture.',
    difficulty: 'Easy',
    palmOrientation: 'Forward',
    confusedWith: ['I', 'J'],
    svgPath: 'M 25 45 L 38 75 M 75 45 L 62 75 M 38 75 C 38 60, 62 60, 62 75 L 62 90 L 38 90 Z'
  },
  {
    letter: 'Z',
    name: 'Letter Z',
    description: 'Index finger extended, other fingers in a fist. Trace the letter "Z" in the air (across, diagonal down, across).',
    fingerPositions: [
      'Index: Pointed straight out',
      'Movement: Trace a "Z" path in the air',
      'Other fingers: Curled in fist with thumb across'
    ],
    tips: 'Z is drawn in the air like Zorro!',
    difficulty: 'Advanced',
    palmOrientation: 'Forward',
    confusedWith: ['1', 'D', 'J'],
    svgPath: 'M 35 35 L 65 35 L 35 70 L 65 70'
  }
];

export const ASL_ALPHABET: AlphabetGuideItem[] = RAW_ALPHABET.map((item) => ({
  ...item,
  image: `/asl-sketches/${item.letter}.svg`,
}));

