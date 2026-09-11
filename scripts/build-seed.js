// build-seed.js
// One-time script that turns the collection (transcribed from Somvanshi's two PDFs)
// into data/collection.json — the real, permanent data file the app reads and writes.
// Run again ONLY if you want to reset back to the original imported list
// (it will overwrite data/collection.json).

const fs = require("fs");
const path = require("path");

// Splits a comma list into items, but ignores commas that are inside ( ), [ ]
// e.g. "Ocean's(11,12,13), Back To The Future(1,2,3)" -> ["Ocean's(11,12,13)", "Back To The Future(1,2,3)"]
function splitTopLevel(text) {
  const items = [];
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      items.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) items.push(current);
  return items
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

let idCounter = 1;
function nextId() {
  return "seed-" + idCounter++;
}

const entries = [];

function addBlock({ category, subcategory = "", type, origin, text, splitOn = "comma" }) {
  const titles = splitOn === "comma" ? splitTopLevel(text) : text;
  for (const title of titles) {
    const clean = title.trim().replace(/\s+/g, " ");
    if (!clean) continue;
    entries.push({
      id: nextId(),
      title: clean,
      category,
      subcategory,
      type,
      origin,
      status: "collection",
      notes: "",
      dateAdded: "2026-08-19",
    });
  }
}

/* ===================== MOVIES PDF ===================== */

// --- SuperHero ---
addBlock({
  category: "SuperHero",
  subcategory: "Marvel",
  type: "movie",
  origin: "International",
  text: "Spiderman(1,2,3)(Tobey Maguire), Captain America The First Avenger, Avengers, Captain America Winter Soldier, Avengers Age of Ultron, The Amazing Spiderman(1,2)(Andrew Garfield), Captain America Civil War, Guardians Of The Galaxy Vol1, Thor Ragnarok, Spiderman Homecoming, Doctor Strange, Black Panther, Ant-Man, Guardians of The Galaxy Vol2, Avengers Infinity War, Ant-Man And The Wasp, Spiderman Far From Home, Black Widow, Avengers Endgame, Venom, Spiderman No Way Home, Venom Let There Be Carnage, Doctor Strange in The Multiverse of Madness, Black Panther Wakanda Forever, Eternals, Shang Chi and The Legend of Ten Rings, Spiderman Into The Spider Verse, Guardians of The Galaxy(Holiday Special), Guardians of The Galaxy Vol3, Ant Man and The Wasp: Quantumania, Spiderman Across The Spider Verse",
});

addBlock({
  category: "SuperHero",
  subcategory: "X-Men",
  type: "movie",
  origin: "International",
  text: "X-Men First Class, X-Men Origins Wolverine, X-Men Days of Future Past, X-Men Apocalypse, Deadpool 1, Logan, Deadpool 2, Werewolf By Night, Deadpool X Wolverine",
});

addBlock({
  category: "SuperHero",
  subcategory: "Marvel",
  type: "series",
  origin: "International",
  text: "Ultimate Spiderman(Animated), Falcon and The Winter Soldier, Loki, Wanda Vision, Hawkeye, Moon Knight, Secret Invasion, Daredevil, The Punisher",
});

addBlock({
  category: "SuperHero",
  subcategory: "DC",
  type: "movie",
  origin: "International",
  text: "The Dark Knight Trilogy, Man of Steel, Batman Vs Superman, Justice League(Snyder's Cut), The Aquaman, Joker, The Suicide Squad, Wonder Woman 1984, Shazam, The Suicide Squad 2, The Batman, The Flash, The Watchmen, V for Vendetta",
});

addBlock({
  category: "SuperHero",
  subcategory: "DC",
  type: "series",
  origin: "International",
  text: "Peacemaker, The Watchmen, The Sandman",
});

addBlock({
  category: "SuperHero",
  subcategory: "",
  type: "movie",
  origin: "Indian",
  text: "Ra.One, Koi Mil Gaya, Krrish, Krrish 3, Minnal Murali, Robot, Robot 2.0",
});

// --- Classics ---
addBlock({
  category: "Classics",
  type: "movie",
  origin: "International",
  text: "The Godfather, The Godfather 2, Scarface, Taxi Driver, Raging Bull, Goodfellas, Heat, Casino, Once Upon A Time In America, Cape Fear, Bronx Tale, The Untouchables, Jackie Brown, Awakenings, Midnight Run, The Deer Hunter, Mean Streets, Sleepers, The Irishman, Scent of A Woman, Insomnia, Fight Club, L.A. Confidentials, The Shawshank Redemption, Unforgiven, Rear Window, Gangs of New York, Psycho, A Clockwork Orange, The Shining, Pulp Fiction, The Good The Bad The Ugly, Magnolia, 48 Hours, Citizen Kane('41), To Kill A Mockingbird('62), The Maltese Falcon('41), 12 Angry Men('57), Lawrence of Arabia, Vertigo('58)",
});

// --- Sci-Fi / Fantasy / Mystery / Thrillers ---
addBlock({
  category: "Sci-Fi / Fantasy / Mystery / Thrillers",
  type: "series",
  origin: "International",
  text: "Star Wars(All parts)[Mandalorian: A Star Wars Series], The Matrix(1,2,3), Transformers, Harry Potter, The Hobbit[Extended Cut], Lord of The Rings[Extended Cut], Maze Runner, Hunger Games, Pirates of The Caribbean, Now You See Me, Ocean's(11,12,13), Back To The Future(1,2,3), Dune(1,2)",
});

addBlock({
  category: "Sci-Fi / Fantasy / Mystery / Thrillers",
  type: "movie",
  origin: "International",
  text: "2001: A Space Odyssey, Interstellar, The Martian, Moon, First Man, Gattaca, Gravity, The Passengers, Avatar, Avatar Way of Water, Arrival, District-9, Annihilation, 10 Cloverfield Lane, Predestination, Inception, Shutter Island, The Looper, The Butterfly Effect, The Sixth Sense, 12 Monkeys, The Prestige, Memento, The Triangle, Source Code, Timecrimes, Primer(2004), The Man From Earth, The Edge of Tommorow, Oblivion, Sicario, Lucy, Enemy(Jake Gyllenhaal), Mad Max Fury Road, Blade Runner 2049, The Adam Project, The Curious Case Of Benjamin Button, Don't Look Up, Everything Everwhere All At Once, TENET, Se7ven, Mulholland Drive, A Beautiful Mind, Good-Will Hunting, The Imitation Game, The Truman Show, The Social Network, Mr Nobody, A Quiet Place, K-PAX, Equilibrium('02), Chronicle('12), Jumper('08)",
});

// --- Applied Sciences / Life / Philosophy (mixed Indian + International, as originally grouped) ---
addBlock({
  category: "Applied Sciences / Life / Philosophy",
  type: "movie",
  origin: "Mixed",
  text: "The Square(2017), 3 Idiots, Taare Zameen Par, Pokharan, Super 30, Rocketry, Chichhore, P.K., Joker(A K), Soorarai Pottaru, Doctor G, Guzaarish(2010), Gran Torino('08), The Mirror('75), The Whale(2022), Look Who's Back(2015), Under The Silver Lake, To End All War, Oppenheimer: The Atomic Bomb(2023)(Documentary), A Million Miles Away('23), Oppenheimer('23), 12th Fail('23), Tetris('23), Radical('23), Laapataa Ladies('23)",
});

// --- War / Battle / War Areas ---
addBlock({
  category: "War / Battle / War Areas",
  type: "movie",
  origin: "International",
  text: "Schindlers List, 1917, Dunkirk, Saving Private Ryan, Forrest Gump, The Bridge of Spies, Jojo Rabbit, The Pianist, The American Sniper, The Last Samurai, All Quiet On Western Front, Munich, Full Metal Jacket, Top Gun, Top Gun Maverick, Troy, 300, Gladiator, The Last Duel, Black Hawk Down, A Few Good Men, Blood Diamond, Zero Dark Thirty, City of God, Seven Years in Tibet, The Hurt Locker, The Boy In The Striped Pajamas, Come and See('85)",
});

addBlock({
  category: "War / Battle / War Areas",
  type: "movie",
  origin: "Indian",
  text: "Border, Tango Charlie, Shershaah, LOC Kargil, Lakshya, Maa Tujhe Salaam, URI, Bajrangi Bhaijaan, Kesari, Ab Tumhare Hawale Watan Sathiyon, Madras Cafe, Airlift",
});

// --- Adventure / Survival / Animals ---
addBlock({
  category: "Adventure / Survival / Animals",
  type: "series",
  origin: "International",
  text: "Planet of The Apes(From 2011), Madagascar(Animated), Kung Fu Panda(Animated), How To Train Your Dragon[1,2,3](Animated), Despicable Me(Animated)",
});

addBlock({
  category: "Adventure / Survival / Animals",
  type: "movie",
  origin: "International",
  text: "Penguins of Madagascar('14)(Animated), Piper(Animated), The Emperor's New Groove(2000)[Animated], The Adventures of Tintin('11), The Iron Giant('99), Wall-e[Animated], Jaws, Jurassic Park, King Kong('05), The Anaconda, Prey(Lion), The Lion King(New Version), Brothers in Blood(Lions of Sabi Sand), Fantastic Mr Fox(Animated), Isle of Dogs(Animated), Into The Wild, Life of Pi, The Revenant, 127 Hours, Captain Fantastic, Cast Away, Thirteen Lives, The Secret Life of Walter Mitty, Point Break('91), Fall('22), Sisu('22), Dora and The Lost City of Gold('19), Home Alone('90), Godzilla('14), Godzilla Minus One('23), Pan's Labyrinth('06), Society of the Snow('23), Flow('24)",
});

addBlock({
  category: "Adventure / Survival / Animals",
  type: "movie",
  origin: "Indian",
  text: "Trapped",
});

// --- Romance / Drama / Musical ---
addBlock({
  category: "Romance / Drama / Musical",
  type: "series",
  origin: "International",
  text: "Twilight",
});

addBlock({
  category: "Romance / Drama / Musical",
  type: "movie",
  origin: "International",
  text: "Titanic, Romeo & Juliet, The Notebook, La La Land, Blue Valentine, The Place Beyond The Pines, Vanilla Sky, Silver Linings Playbook, Lars And The Real Girl, About Time, Where The Crawdads Sing, Perks of Being A Wallflower, 500 Days of Summer, Love-Rosie, The Edge of 17, Bohemian Rhapsody, Tick Tick ...Boom, The Handmaiden, Her, Mother!, Atonement, House Of Gucci, West Side Story, Eternal Sunshine of The Spotless Mind, Crazy Stupid Love, Whiplash, Sound of Metal, The Fault In Our Stars, Licorice Pizza, Last Night in Soho, My Sassy Girl, I Want To Eat Your Pancreas(Animated), American Beauty, Always(2011), Your Name(Anime), House of Hummingbird, 50/50, Bridge To Terebithia, Body Heat, Elvis(2022), Decision To Leave, Spirited Away(Anime), Triangle of Sadness, Cha Cha Real Smooth, One Day(2011), Babylon(2022), Shame(2011), The Age of Adaline, Monster(2003), Cruel Intentions('99), Man called Otto('22), Me Before You('16), A Walk to Remember('02), Groundhog Day('93), All the Bright Places('20), Better Days('19)",
});

addBlock({
  category: "Romance / Drama / Musical",
  subcategory: "",
  type: "series",
  origin: "Indian",
  text: "Jannat",
});

addBlock({
  category: "Romance / Drama / Musical",
  type: "movie",
  origin: "Indian",
  text: "My Name is Khan, Kuch Kuch Hota Hai, Kabhi Khushi Kabhi Gham, Kal Ho Na Ho, Om Shanti Om, Rab Ne Bana Di Jodi, DDLJ, Chalte Chalte, Sita Ramam, Dear Comrade, Shiddat, Laila Majnu(2018), Lekh(2022), Highway, Rockstar, Tere Naam, Dil Bechaara, Bareilly Ki Barfi, Shaadi Me Zarur Aana, Sanam Teri Kasam, October, Kabir Singh, Geetha Govindam, 96, Color Photo, Diljale, Dilwaale(Old), Mom(Sridevi), Hindi Medium, English Medium, Paa, Tamasha, Raanjhana, ABCD 1, New York, Mai Hoon Na, Ek Villain, Secret Superstar, Zindagi Na Milegi Dobara, 777 Charlie, Dil To Pagal Hai, Hasee Toh Phasee, Jaya Jaya Jaya Jaya Hey, Maqbool('03), The Dirty Picture, Dev.D, Jab We Met, Love Aaj Kal('09), Udaan('10)",
});

// --- Stressful / Melodrama ---
addBlock({
  category: "Stressful / Melodrama",
  type: "movie",
  origin: "Mixed",
  text: "Manchester By The Sea, Incendies, Oldboy(Korean), Funny Games, Seven Pounds, Nightcrawler, Silenced, Pursuit of Happyness, Grave of The Fireflies(Anime), A Silent Voice(Anime), It's Such A Beautiful Day(Anime), Lost In Translation, The Green Mile, A Serbian Film(Not Advised), Aftersun(2023), We Need To Talk About Kevin, Requiem For a Dream(2000), The White Ribbon('09), Miracle in Cell No 7('19), Maharaja('24)",
});

// --- Sports ---
addBlock({
  category: "Sports",
  type: "series",
  origin: "International",
  text: "Rocky, Creed, Cars(Animated)",
});

addBlock({
  category: "Sports",
  type: "movie",
  origin: "International",
  text: "Million Dollar Baby, Southpaw, King Richard, Peaceful Warrior, The Fighter(Cristian Bale), Ford V Ferrari, Goal, Boyka The Undisputed, The Karate Kid, I Tonya, The Blind Side, Remember The Titans, Invincible('06), Moneyball(2011), Shaolin Soccer('01), Gran Turismo('23), Coach Carter",
});

addBlock({
  category: "Sports",
  type: "movie",
  origin: "Indian",
  text: "Dangal, Race 2, Sultaan(Salman), Mary Kom, Bhaag Milkha Bhaag, Gold, Dhan Dhana Dhan Goal, M.S. Dhoni, Soorma, Brothers(A K), Patiala House, Jersey(South), Mukkabaaz, Chak De India, Maidaan('24)",
});

// --- Comedy ---
addBlock({
  category: "Comedy",
  type: "series",
  origin: "International",
  text: "Rush Hour, The Hangover, American Pie, TED, Jump Street",
});

addBlock({
  category: "Comedy",
  type: "movie",
  origin: "International",
  text: "Kung Fu Hustle, Once Upon A Time In Hollywood, The Nice Guys, Four Lions, The 40 Y/O Virgin, Free Guy, Game Night, Scott Pilgrim Vs The World, Hot Fuzz, This Is The End, The Interview(2014), War Dogs, Seven Psychopaths, Horrible Bosses, Knocked Up, Superbad, The Big Lebowski, Pineapple Express, Borat Part 1, Meet The Parents, Good Boys, Not Another Teen Movie, 30 Minutes Or Less, Scary Movie(2000), The Dictator(2012), We're The Millers, Vacation(2015), The Other Guys, Money Talks('97), Airplane(1980), They Cloned Tyrone('23), Stepbrothers('08), Central Intelligence('16), Shaun of The Dead('04), Ricky Gervais-Armageddon, White Chicks('04), Nacho Libre('06)",
});

addBlock({
  category: "Comedy",
  type: "movie",
  origin: "Indian",
  text: "Hera Pheri, Jolly LLB, Govinda No.1 collection, Ready(Salman), Golmaal 1, Bhagam Bhaag, Welcome, Khatta Meetha, Dhol, Malamaal Weekly, De Dana Dan, Awara Pagal Deewana, Deewane Huye Pagal, Garam Masala, Baby(A K), Entertainment, Tathastu(Zakir Khan), Munna Bhai MBBS, Desi Boyz, Dhamaal, God Tussi Great Ho, Mujhse Shaadi Karogi, Jo Bole So Nihal, Chandni Chowk To China, Housefull 1, Delhi Belly, Badshah(SRK), Fukrey, Ludo",
});

// --- Action / Suspense / Mystery / Thrillers ---
addBlock({
  category: "Action / Suspense / Mystery / Thrillers",
  type: "series",
  origin: "International",
  text: "Jason Bourne, John Wick(& The Continental-Spinoff), James Bond(Daniel Craig), Die Hard(1,2,3), The Transporter(1,2,3), Kill Bill, Mission Impossible, Fast & Furious(1-8), The Raid(Indonesian), Men In Black, The Terminator(1,2,3), Trainspotting, Train To Busan(1,2), Zombieland(1,2), Kingsman(1,2), Extraction(1,2)",
});

addBlock({
  category: "Action / Suspense / Mystery / Thrillers",
  type: "movie",
  origin: "International",
  text: "Django Unchained, Catch Me If You Can, The Aviator, The Departed, Drive(Ryan Gosling), The Gray Man, Revolutionary Road, The Great Gatsby, Limitless, I Saw The Devil, The Foreigner, Memories of Murder, Zodiac, Se7en, There Will Be Blood, Parasite(Korean), The Harder They Fall, Hell Or High Water, Wind River, No Country For Old Men, The Warrior, Bronson, The Machinist, American Hustle, American Psycho, Hostiles, Argo, CODA, The Big Short(Economics), Focus, Knives Out, True Grit, Mindhunter, Guilty, Baywatch, A Beautiful Boy, Reservoir Dogs, The Usual Suspects, Inglorious Basterds, Taken(2008), Red Notice, Baby Driver, Deep Water, The Father, Fresh, Silence of The Lambs, Fracture(Jake Gyl), Gone Girl, Girl With The Dragon Tatto, Wrath of Man, Nobody, The Italian Job, Nocturnal Animals, Jurassic And The Black Messiah, The Gangster The Cop The Devil, The Grand Budapest Hotel, Bad Times At El Royale, Druk Another Round, Dallas Buyers Club, Riders of Justice, Law Abiding Citizen, Demolition, Brothers(Jake Gyll), The Bank Job, The Hunt, The Power of The Dog, The Game, The Life Of David Gale, The Man from U.N.C.L.E., Pain And Gain, Man on Fire, A Bittersweet Life, Army of Thieves, The Man from Nowhere, Lady Vengeance, 3-Iron, The Talented Mr Ripley, Burning(2018), Forgotten, Leon The Professional, Braveheart, The Unbearable Weight of Massive Talent, The Outfit, In Brudges, The Outlaws, Searching(2018), Bullet Train(2022), Collateral(2004), Chungking Express, The Age of Shadows, Vengeance(2022), Capernaum, Closer(2004), Room(2015), Masterminds(2016), Uncut Gems, Mother(2009), Gifted, Primal Fear, Glass Onion(2022), Violent Night(2022), The Hateful Eight, The Den(2013), The Pale Blue Eye(2022), El Cuerpo(2012), Triple Frontier, Wild Tales(2014), The Hitman's Bodyguard('17), Snowpiercer('13), The Chaser('08), 3:10 To Yuma('07), Training Day('01), Monkey Man('24), Den of Thieves('18), The White Tiger('21), A Separation('11), One Battle after Another, American Gangster('07)",
});

addBlock({
  category: "Action / Suspense / Mystery / Thrillers",
  subcategory: "",
  type: "series",
  origin: "Indian",
  text: "Dhoom, K.G.F., Khiladi, Force, Singham, Tiger, Bahubali, Murder(Emraan), Gangs of Wasseypur, Pushpa, Dangerous, Khiladi(1,2,3), Commando, Dabanng, Lokesh Kangraj Universe, Shootout(At Wadala, At Lokhandwala), Drishyam(1,2 Ajay Devgan), Once Upon A Time in Mumbai(1, Dobaara), Dhurandhar",
});

addBlock({
  category: "Action / Suspense / Mystery / Thrillers",
  type: "movie",
  origin: "Indian",
  text: "Don(SRK), Don 2, Happy New Year, Raees, Ghajini, Sarfarosh, Mohra, Ratsasan, Newton, Ugly, Thadam, Badlapur, Tanhaji, DJ, Son Of Sathyamurthy, Puli, Holiday(A K), 16 December, China Town, Aan Men At Work, Indian, Ghatak, Salakhen, Don No. 1(Chiranjeevi), Raid, Dhamaka, Sivaji The Boss, Masaan, Maanjhi, Nayak, Khalnayak, Kahaani(Vidya), Wanted(S K), Table No. 21, Singh Saab The Great, Jai Bhim, Jackpot, Ajnabee, Vinashak(Sunil), Vikram Vedha(Madhavan, Hrithik), Batla House, Raman Raghav 2.0, Bhavesh Joshi SuperHero, Gabbar Is Back, No Smoking, Detective Byomkesh Bakshy, Go Goa Gone, Darlings(2022), Omkara, Karthik Calling Karthik, Johnny Gaddar, Monica O My Darling, RRR, Runway 34, Kantara, Thar(2022), Freddy(2022), Stoneman Murders, Singh Is Bling, Boss(A K), R.A.W., Special 26, Naam Shabana, A Wednesday, Rowdy Rathore, Kaabil, Udta Punjab, Haider, Garv, Players, Luck, Dus, Andhadhun, An Action Hero(2022), Bajirao Mastaani, Kai Po Che, Prince(Vivek), Son of Sardaar, War(2022), Ponniyin Selvan I, Mukundan Unni Associates, Talaash('12), Welcome Home(2020, SonyLiv), Kaminey(SK), Gulaal(2009), Kuttey('23), Chor Nikal Ke Bhaga('23), Vikram Vedha(2022), Por Thozhil('23), Jigarthanda Double X('23), Theeran('17), Maaveeran('23), Kill('23), 8X10 Tasveer('09), Chup",
});

// --- Horror ---
addBlock({
  category: "Horror",
  type: "series",
  origin: "International",
  text: "Conjuring Universe(Anabelle, Nun)",
});

addBlock({
  category: "Horror",
  type: "movie",
  origin: "International",
  text: "REC('07), Veronica(Spanish), Get Out, It, The Witch(Sub Version), Midsommar, Hereditary, The Medium('21), The Autopsy of Jane Doe('16), Obsession('26)",
});

addBlock({
  category: "Horror",
  type: "movie",
  origin: "Indian",
  text: "Creature, Bhool Bhulaiya(A K), Tumbaad, Stree, N.H. 10, Kaalo",
});

/* ===================== WEB SERIES PDF ===================== */
// This PDF listed one title per line rather than comma lists, so we pass arrays directly.

addBlock({
  category: "Miniseries",
  type: "series",
  origin: "International",
  splitOn: "array",
  text: [
    "Chernobyl", "Cosmos: A Space-time Odyssey", "Cosmos: Possible Worlds", "The Lost Room(2006)",
    "11.22.63", "The Night Manager", "Mare of Easttown", "Band of Brothers", "The Queen's Gambit",
    "Fleabag", "Normal People", "Behind her eyes", "The Night Of", "Beef(2023)", "Hijack(2023)",
    "The Afterparty", "Looking for Alaska", "The Day of the Jackal", "Mr and Mrs Smith",
    "Presumed Innocent", "Pluribus",
  ],
});

addBlock({
  category: "Western / Drama / Action / Crime / Thriller",
  type: "series",
  origin: "International",
  splitOn: "array",
  text: [
    "Breaking Bad(El Camino-Follow Up Movie)", "Better Call Saul", "Narcos", "Hannibal", "Money Heist",
    "True Detective", "Peaky Blinders", "Sons of Anarchy", "The Walking Dead(Upto season 6)",
    "The Sopranos", "The Wire", "Succession", "Banshee", "Mindhunter", "Sherlock", "Ozark",
    "Lupin", "Reacher",
  ],
});

addBlock({
  category: "Sci-Fi / Cyber",
  type: "series",
  origin: "International",
  splitOn: "array",
  text: ["Dark", "1899", "Mr Robot", "Black Mirror"],
});

addBlock({
  category: "Fantasy / War / SuperHero / Sports / Zombies",
  type: "series",
  origin: "International",
  splitOn: "array",
  text: [
    "House of The Dragon", "Game of Thrones", "Vikings", "The Witcher", "The Umbrella Academy",
    "The Boys", "Locke and Key", "Stranger Things", "Ted Lasso(upto s2)", "Cobra Kai", "Barry",
    "Alice in Borderland", "The Last Of Us", "From(2023)", "Invincible",
  ],
});

addBlock({
  category: "Anime",
  type: "series",
  origin: "International",
  splitOn: "array",
  text: [
    "Naruto", "Death Note", "Attack on Titan", "Jujutsu Kaisen(Jujutsu Kaisen 0-Movie)",
    "Arcane League of Legends", "Chainsaw Man", "Solo Leveling",
  ],
});

addBlock({
  category: "Korean Drama / Thriller",
  type: "series",
  origin: "International",
  splitOn: "array",
  text: [
    "It's Okay Not To Be Okay", "True Beauty", "School 2017", "Boys over Flowers", "My Mister",
    "Business Proposal", "Hometown Cha Cha Cha", "Squid Games", "All of Us Are Dead",
  ],
});

addBlock({
  category: "Indian Web Series",
  type: "series",
  origin: "Indian",
  splitOn: "array",
  text: [
    "Mirzapur", "Sacred Games(S1)", "Asur", "Matsya Kaand", "Kota Factory", "Family Man",
    "Scam 1992", "Campus Diaries", "Taaza Khabar", "Panchayat", "Chacha Vidhayak Hai Humare",
    "Special Ops", "Bambai Meri Jaan", "Kaala Paani", "The Railway Men('23)", "Dhootha('23)",
    "Apharan(S1)",
  ],
});

/* ===================== WRITE FILE ===================== */

const outPath = path.join(__dirname, "..", "data", "collection.json");
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), "utf-8");

const movieCount = entries.filter((e) => e.type === "movie").length;
const seriesCount = entries.filter((e) => e.type === "series").length;
const indianCount = entries.filter((e) => e.origin === "Indian").length;

console.log(`Wrote ${entries.length} entries to ${outPath}`);
console.log(`  Movies: ${movieCount}`);
console.log(`  Series: ${seriesCount}`);
console.log(`  Indian-tagged: ${indianCount}`);
