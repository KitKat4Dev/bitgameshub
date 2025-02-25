const facts = [
    "A group of flamingos is called a 'flamboyance.'",
    "Bananas are berries, but strawberries aren't.",
    "There's a town in Norway called Hell.",
    "Wombat poop is cube-shaped.",
    "The inventor of the Frisbee was turned into a Frisbee after he died.",
    "Honey never spoils; archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
    "A day on Venus is longer than a year on Venus.",
    "Octopuses have three hearts.",
    "A snail can sleep for three years.",
    "Cows have best friends and can become stressed when separated.",
    "A blue whale's heart is so large that a human can swim through its arteries.",
    "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
    "Humans share 50% of their DNA with bananas.",
    "Sharks are the only fish that can blink with both eyes.",
    "Some cats are allergic to humans.",
    "In Switzerland, it's illegal to own just one guinea pig because they get lonely.",
    "The world's largest desert is Antarctica.",
    "A group of jellyfish is called a 'smack.'",
    "Cheetahs can't roar like other big cats; they can only make a series of high-pitched sounds.",
    "Sloths can hold their breath longer than dolphins can.",
    "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
    "Tigers have striped skin, not just striped fur.",
    "A lion's roar can be heard from up to 5 miles away.",
    "Dolphins have names for each other, using specific whistles to call each other.",
    "It rains diamonds on Jupiter and Saturn.",
    "Butterflies taste with their feet.",
    "The heart of a shrimp is located in its head.",
    "A group of owls is called a 'parliament.'",
    "Elephants are the only animals that can't jump.",
    "Penguins propose to their mates with pebbles.",
    "The world's oldest known living tree is over 4,800 years old and is a bristlecone pine.",
    "Humans are the only animals that blush.",
    "There are more stars in the universe than grains of sand on all of Earth’s beaches.",
    "The longest place name in the world is 85 letters long: Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu.",
    "A single strand of spaghetti is called a 'spaghetto.'",
    "The average person walks the equivalent of five times around the world in their lifetime.",
    "Coca-Cola would be green if coloring weren’t added.",
    "The unicorn is the national animal of Scotland.",
    "A group of pugs is called a 'grumble.'",
    "The shortest commercial flight in the world lasts just 57 seconds and covers a distance of 1.7 miles.",
    "It's impossible to hum while holding your nose closed.",
    "Mantis shrimp have the world's fastest punch, which can break glass.",
    "In terms of mass, a person's mouth is the largest cavity in the body.",
    "Koalas have fingerprints that are very similar to humans.",
    "The heart of a blue whale can weigh as much as a small car.",
    "The longest word in the English language is 189,819 letters long and is the chemical name for titin, a protein.",
    "Sharks have been around longer than trees.",
    "Wombats can run at speeds of up to 25 miles per hour.",
    "The average cloud weighs about 1.1 million pounds.",
    "A single cup of coffee can contain over 1,000 different chemical compounds.",
    "The world's largest snowflake on record was 15 inches wide.",
    "Scotland's national animal is a unicorn.",
    "A group of crows is called a 'murder.'",
    "Peanuts are not nuts; they are legumes.",
    "Banging your head against a wall burns 150 calories an hour.",
    "The world's largest living organism is a fungus in Oregon, covering over 2,385 acres.",
    "The original name for the butterfly was 'flutterby.'",
    "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
    "Kangaroos can't walk backward.",
    "Avocados are toxic to birds.",
    "A jiffy is an actual unit of time: 1/100th of a second.",
    "The dot over the letters 'i' and 'j' is called a tittle.",
    "The most expensive pizza in the world costs $12,000 and takes 72 hours to make.",
    "A day on Earth is not exactly 24 hours; it is approximately 23 hours, 56 minutes, and 4 seconds.",
    "A group of flamingos is called a 'flamboyance.'",
    "You can fit a whole of the human population in the city of Los Angeles.",
    "The world's smallest reptile was discovered in 2021, a chameleon about the size of a pea.",
    "The first alarm clock could only ring at 4 a.m.",
    "More than 1,000 birds a year die from smashing into windows.",
    "Honey bees can recognize human faces.",
    "The fingerprints of a koala are so similar to those of humans that they can taint crime scenes.",
    "The human nose can detect about 1 trillion different scents.",
    "An octopus has nine brains.",
    "The average person produces enough saliva in their lifetime to fill two swimming pools.",
    "Banging your head against a wall burns 150 calories an hour.",
    "Cats have over 20 muscles that control their ears.",
    "The first oranges weren't orange; they were green.",
    "In the 1830s, ketchup was sold as medicine.",
    "The tongue of a blue whale weighs as much as an elephant.",
    "An octopus has three hearts and blue blood.",
    "A goldfish can remember things for up to five months.",
    "Rats laugh when they are tickled.",
    "The longest time between two twins being born is 87 days.",
    "The majority of your brain is fat.",
    "The world's largest snowman was 122 feet tall.",
    "The human brain generates enough electricity to power a small light bulb.",
    "Some cats are allergic to humans.",
    "It's impossible to sneeze with your eyes open."
];

document.getElementById('generateFact').addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    document.getElementById('fact').textContent = facts[randomIndex];
});
