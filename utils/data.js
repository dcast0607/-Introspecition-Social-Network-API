// TODO: If enough time find a way to add data to the DB. 

const usernames = [
    'testUser1',
    'testUser2',
    'johnnyTest',
    'spongeBob',
    'jimmyNeutron',
    'tomRiddle'
]

const thoughts = [
    "People laugh about how cats love boxes, but if there was suddenly a box bigger than you in your living room, you’d probably go in it too.",
    "It's disappointing to think that human babies stay small for many annoying years, but pets go through their cute and small phase in less than a year.",
    'Vampires dress really well for not seeing themselves in the mirror.',
    'Many of us are uncomfortable giving out our address to strangers, unless they bring food.',
    'Danny Phantom might be short for Daniel Phantasmal.',
    'Cereals like Lucky Charms and Coco Pops are closer to desserts than a breakfast cereal.',
    'You only know about the bugs crawling on you while you sleep if they bite and you see the mark.',
    'Vacuuming the carpet is mowing the lawn indoors.',
    'We are causing a change for the further evolved versions of our own species.',
    'Subs from Subway actually look like subways.',
    'When making a sandwich you can use the same knife for every condiment as long as you apply them in the right order.',
    'Dozens of strangers have photographed your front door.',
]


// TODO: Maybe add a way to seed this data as well
const reactions = [
    "OMG that's so funny",
    "Wow hadn't thought of that before",
    "Hahahaha",
    "😂",
    "That really makes you think!",
    "Great points!",
    "😭",
    "🤣",
    "🧠",
    "🤯"
]

const getRandomThought = (index) => thoughts[index]; 

const getUserName = (index) => usernames[index];

const getRandomReaction = (index) => reactions[index];

module.exports = { getRandomThought, getUserName, getRandomReaction };