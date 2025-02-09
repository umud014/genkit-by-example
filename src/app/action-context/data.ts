export const ANIMAL_USERS = [
  {
    uid: "sloth",
    emoji: "🦥",
    name: "Sloth",
    favoriteFoods: ["Blueberries", "Leaves"],
  },
  {
    uid: "koala",
    emoji: "🐨",
    name: "Koala",
    favoriteFoods: ["Eucalyptus Leaves"],
  },
  {
    uid: "turtle",
    emoji: "🐢",
    name: "Turtle",
    favoriteFoods: ["Strawberries", "Crickets"],
  },
  { uid: "panda", emoji: "🐼", name: "Panda", favoriteFoods: ["Bamboo"] },
];

export const GROUPS = {
  mammals: ["sloth", "koala", "panda"],
  slowpokes: ["sloth", "turtle"],
  bearish: ["koala", "panda"],
} as Record<string, string[]>;

const TODAY = Date.now();
const DAYS = 60000 * 60 * 24;
function futureDate(n: number) {
  return new Date(TODAY + n * DAYS).toISOString().substring(0, 10);
}

export const UPCOMING_EVENTS = [
  {
    group: "bearish",
    name: "Roundtable: We aren't bears (or are we?)",
    date: futureDate(1),
  },
  { group: "slowpokes", name: "Extra slow dance party", date: futureDate(3) },
  {
    public: true,
    name: "Animals Unite (for bar trivia)!",
    date: futureDate(3),
  },
  {
    group: "mammals",
    name: "The fur we were, a retrospective.",
    date: futureDate(5),
  },
  {
    group: "mammals",
    name: "Mammal Movie Night: March of the Penguins",
    date: futureDate(7),
  },
  {
    group: "slowpokes",
    name: "Snail Mail Social",
    date: futureDate(9),
  },
  {
    public: true,
    name: "Inter-Species Field Day!",
    date: futureDate(11),
  },
  {
    group: "bearish",
    name: "Bear Market Analysis (and Honey Tasting)",
    date: futureDate(13),
  },
  {
    group: "mammals",
    name: "Fur and Feathers Fashion Show",
    date: futureDate(15),
  },
  {
    public: true,
    name: "Wildlife Photography Workshop",
    date: futureDate(17),
  },
  {
    group: "slowpokes",
    name: "Zen Garden Design Workshop",
    date: futureDate(19),
  },
  {
    group: "bearish",
    name: "Hibernation Preparation Seminar",
    date: futureDate(21),
  },
  {
    public: true,
    name: "Animal Talent Show",
    date: futureDate(23),
  },
  {
    group: "mammals",
    name: "The Great Mammal Migration Simulation",
    date: futureDate(25),
  },
];
