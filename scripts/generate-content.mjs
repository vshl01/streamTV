/**
 * Seed generator for the StreamTV catalog.
 *
 * Emits `public/content.json` in a Contentful-Delivery-API-shaped envelope
 * (`{ total, items: [{ sys, fields }] }`) so the local fallback and the real
 * Contentful response can share one transformer.
 *
 * Run with:  node scripts/generate-content.mjs
 *
 * Poster/backdrop imagery uses picsum.photos seeded URLs — deterministic,
 * license-free, and trivially swappable for TMDB paths in production.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const HLS_A = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const HLS_B =
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const poster = (slug) => `https://picsum.photos/seed/${slug}-poster/480/720`;
const backdrop = (slug) => `https://picsum.photos/seed/${slug}-back/1600/900`;

// [name, kind, year, runtime, maturity, rating, genres[], categories[], featured, director, cast[], tagline, synopsis]
const DATA = [
  ["Neon Horizon", "movie", 2024, 128, "U/A 16+", 8.6, ["Sci-Fi", "Action"], ["trending", "action", "new-releases"], true, "Ava Reynard", ["Marlowe Quinn", "Sahana Iyer", "Dexter Cole"], "The future has a frequency. Tune in.", "In a megacity wired into a single failing AI, a signal engineer races to stop a blackout that would erase a billion memories."],
  ["The Silent Tide", "movie", 2023, 116, "U/A 13+", 8.1, ["Drama"], ["drama", "trending"], true, "Imre Vásquez", ["Nadia Brandt", "Tomas Okafor"], "Some storms arrive without a sound.", "A widowed lighthouse keeper and a runaway teenager weather a season that forces both to choose between the past and the shore ahead."],
  ["Midnight Circuit", "movie", 2024, 109, "U/A 16+", 7.7, ["Action", "Thriller"], ["action", "trending"], false, "Joon-ho Park", ["Reese Calloway", "Mira Solace"], "One night. One lap. No brakes.", "An underground street racer is blackmailed into one last run across a city that wants her gone by sunrise."],
  ["Paper Lanterns", "movie", 2022, 121, "U/A 7+", 7.9, ["Drama", "Romance"], ["drama"], false, "Lina Maresults", ["Hiro Tanaka", "Elise Moreau"], "Light travels further than we think.", "Two strangers meet at a riverside festival and spend a decade almost finding each other again."],
  ["Quantum Drift", "series", 2024, 47, "U/A 13+", 8.8, ["Sci-Fi", "Action"], ["trending", "new-releases", "action"], true, "Cass Whitfield", ["Dev Anand", "Priya Roy", "Soren Vale"], "Reality is the variable.", "A disgraced physicist discovers her lab notebook is rewriting itself — predicting disasters she hasn't caused yet."],
  ["The Last Comedian", "movie", 2023, 104, "U/A 13+", 7.6, ["Comedy", "Drama"], ["comedy", "drama"], false, "Greta Lindqvist", ["Mo Castellano", "Bea Hartley"], "The funniest people are always running from something.", "An aging stand-up takes one final residency in a town that hasn't laughed in years."],
  ["Velvet Underground City", "series", 2021, 52, "A", 8.3, ["Drama", "Crime"], ["drama", "trending"], false, "Hassan Rahimi", ["Lior Adler", "Camille Foss"], "Every neon sign hides a debt.", "A jazz club owner navigates loyalty and rot in a city that never quite sleeps."],
  ["Iron Monsoon", "movie", 2024, 137, "U/A 16+", 7.4, ["Action", "Adventure"], ["action", "new-releases"], false, "Aditi Menon", ["Karan Vex", "Tamsin Roe"], "When the rains come, so do they.", "A salvage crew defends a flooded coastal city from raiders during the longest monsoon on record."],
  ["Laugh Track", "series", 2023, 28, "U/A 13+", 8.0, ["Comedy"], ["comedy", "trending"], false, "Wes Dunmore", ["Polly Nguyen", "Frankie Boon"], "Canned laughter, real problems.", "The writers' room of a dying sitcom tries to save the show — and possibly each other."],
  ["Beyond the Reef", "movie", 2022, 92, "U", 8.5, ["Documentary"], ["documentary"], false, "Océane Pruitt", ["Narrated by Idris Vale"], "An ocean we thought we knew.", "A four-year expedition films the secret architecture of the world's last untouched coral reefs."],
  ["Echoes of Tomorrow", "series", 2024, 49, "U/A 13+", 8.2, ["Sci-Fi", "Drama"], ["new-releases", "drama"], true, "Mara Eklund", ["Niko Pereira", "Asha Verma"], "We remembered the future wrong.", "Survivors of a time-displacement experiment reunite to repair the year they accidentally deleted."],
  ["City of Glass", "movie", 2023, 118, "U/A 16+", 7.8, ["Drama", "Thriller"], ["drama", "trending"], false, "Quentin Dahl", ["Eve Lindberg", "Rashid Noor"], "Transparency is the perfect disguise.", "An architect designing the world's most surveilled tower realizes the building is watching her too."],
  ["Wild Frequencies", "movie", 2023, 88, "U", 8.4, ["Documentary", "Music"], ["documentary", "new-releases"], false, "Bao Tran", ["Narrated by Selah Monroe"], "Listen to what the wilderness plays.", "Field recordists chase the vanishing soundscapes of six ecosystems before they fall silent."],
  ["The Heist Equation", "movie", 2024, 113, "U/A 13+", 7.9, ["Action", "Thriller"], ["action", "trending", "new-releases"], false, "Sven Halloran", ["Dax Romero", "Ingrid Sol"], "Crime is just math you can get caught doing.", "A mathematician assembles a crew to rob a bank that technically does not exist."],
  ["Sunday Roast", "series", 2022, 31, "U/A 7+", 7.5, ["Comedy"], ["comedy"], false, "Penny Achebe", ["Marcus Bell", "Lottie Frey"], "Family. Gravy. Chaos.", "Three generations crowd one tiny kitchen every Sunday, and somehow no one starves."],
  ["Frostbite Ridge", "movie", 2023, 124, "U/A 13+", 7.7, ["Action", "Adventure"], ["action"], false, "Tova Lindgren", ["Cole Varga", "Sun-hee Lim"], "The mountain keeps its dead.", "A rescue climber returns to the peak that took her team to recover a secret buried in the ice."],
  ["The Cartographer", "series", 2024, 54, "U/A 13+", 8.7, ["Drama", "Mystery"], ["drama", "new-releases", "trending"], true, "Felix Brenner", ["Yara Costa", "Emmett Shaw"], "Every map leaves something out on purpose.", "A mapmaker for a secretive empire discovers her charts are erasing real towns from the world."],
  ["Static Bloom", "movie", 2022, 99, "U/A 13+", 7.3, ["Sci-Fi"], ["action"], false, "Rune Aaltonen", ["Petra Vance", "Omar Diallo"], "Growth, but make it electric.", "A botanist's experimental garden begins broadcasting on frequencies that rewrite anyone who listens."],
  ["Office Politics", "series", 2023, 26, "U/A 13+", 7.8, ["Comedy"], ["comedy", "new-releases"], false, "Dana Whitlock", ["Gus Pemberton", "Naomi Ferro"], "The real work is surviving the meetings.", "A mild-mannered analyst gets promoted into a department openly trying to destroy itself."],
  ["Deep Field", "movie", 2024, 96, "U", 8.9, ["Documentary"], ["documentary", "new-releases", "trending"], true, "Hana Sørensen", ["Narrated by Aria Bennett"], "Look long enough and the dark looks back.", "Astronomers point the newest telescope at the emptiest patch of sky — and find it full."],
  ["Crimson Avenue", "series", 2021, 50, "A", 8.0, ["Action", "Crime"], ["action", "drama"], false, "Marco Belli", ["Rey Okonkwo", "Stella Marsh"], "Justice takes the long way down this street.", "Two detectives on opposite sides of a corruption case learn they're chasing the same ghost."],
  ["Letters to Nowhere", "movie", 2022, 107, "U/A 7+", 7.6, ["Drama", "Romance"], ["drama"], false, "Aiko Ueda", ["Theo Marsh", "Vera Lind"], "Some words wait years to be read.", "A postal sorter begins answering the undeliverable letters that pass through her station."],
  ["The Improv", "series", 2024, 24, "U/A 13+", 7.7, ["Comedy"], ["comedy", "new-releases"], false, "Cleo Banks", ["Jonah Pike", "Remy Saint"], "No script. No mercy.", "A failing improv troupe bets their theater on one impossibly long-form show."],
  ["Tectonic", "movie", 2023, 84, "U", 8.3, ["Documentary"], ["documentary"], false, "Ravi Deshpande", ["Narrated by Cormac Ailes"], "The ground is never still.", "A decade of seismographs and storytellers reveal how the planet quietly rebuilds itself."],
  ["Phantom Protocol", "movie", 2024, 131, "U/A 16+", 8.1, ["Action", "Spy"], ["action", "trending", "new-releases"], true, "Lena Ostrovsky", ["Bram Holt", "Indira Saxe", "Cyrus Penn"], "The best agents were never on file.", "An intelligence officer erased from every database must prove she exists before her own agency kills her."],
  ["Rooftop Gardens", "series", 2022, 44, "U/A 7+", 7.9, ["Drama"], ["drama"], false, "Mei Lin Cho", ["Sabine Ortega", "Dev Patil"], "Growing something out of nothing.", "Neighbors in a crumbling tower turn its roof into a garden — and a fragile community."],
  ["Punchline", "movie", 2023, 101, "U/A 13+", 7.4, ["Comedy"], ["comedy"], false, "Hank Mercer", ["Toby Frost", "Gita Rao"], "Timing is everything. He has none.", "A literal-minded engineer enters a comedy contest to win back his estranged brother's respect."],
  ["Orbital", "series", 2024, 41, "U/A 7+", 8.2, ["Sci-Fi", "Documentary"], ["new-releases", "documentary"], false, "Pia Lindgren", ["Cast of Station Helios"], "Home is a window away.", "A docu-drama follows the six-person crew of a research station watching Earth from above."],
  ["The Long Drive Home", "movie", 2021, 110, "U/A 13+", 7.8, ["Drama"], ["drama"], false, "Eamon Walsh", ["Cora Bishop", "Lou Tran"], "Some roads only go one way.", "An estranged father and daughter cross a continent in a borrowed car and a closing window of time."],
  ["Blackout District", "movie", 2024, 119, "U/A 16+", 7.6, ["Action", "Thriller"], ["action", "new-releases"], false, "Yusuf Demir", ["Kade Olsson", "Rhea Sterling"], "When the lights die, the city wakes up.", "A grid technician is the only one who can see what moves through the city during its rolling blackouts."],
  ["Stand-Up Saturday", "series", 2023, 33, "U/A 16+", 7.5, ["Comedy"], ["comedy", "trending"], false, "Bex Carver", ["Various comedians"], "Five minutes to kill. Or die.", "A weekly showcase follows hungry comics fighting for the closing spot at a legendary club."],
  ["Ocean's Whisper", "movie", 2022, 90, "U", 8.6, ["Documentary"], ["documentary", "trending"], false, "Sol Marin", ["Narrated by Greta Yi"], "The largest voices are the quietest.", "Marine biologists decode the long-distance songs whales use to hold their families together."],
  ["Vanishing Point", "series", 2024, 48, "U/A 16+", 8.4, ["Thriller", "Drama"], ["trending", "drama", "new-releases"], true, "Noor Habib", ["Esme Wren", "Caleb Frost"], "People don't just disappear. Usually.", "A cold-case journalist reopens a string of vanishings that all happened at the exact same mile marker."],
  ["The Roast Master", "movie", 2023, 97, "U/A 16+", 7.3, ["Comedy"], ["comedy"], false, "Vince Carbone", ["Sal Romano", "Dot Pierce"], "He insults for a living. Then he met her.", "A washed-up roast comic falls for the one person in town immune to his jokes."],
  ["Solar Flare", "movie", 2024, 126, "U/A 13+", 7.9, ["Sci-Fi", "Action"], ["action", "new-releases", "trending"], false, "Tariq Nasser", ["Lyle Brooks", "Anika Sharma"], "The sun is sending a message.", "A solar physicist has eighteen hours to convince the world that the next flare is not an accident."],
  ["Quiet Frames", "movie", 2024, 102, "U/A 7+", 8.0, ["Drama"], ["drama", "new-releases"], false, "Sofia Marchetti", ["Bruno Adler", "Yuki Mori"], "A life measured in still photographs.", "A street photographer revisits forty years of negatives and the city that changed around them."],
];

const items = DATA.map(([name, kind, year, runtime, maturity, rating, genres, categories, featured, director, cast, tagline, synopsis], i) => {
  const slug = slugify(name);
  return {
    sys: { id: `t-${String(i + 1).padStart(2, "0")}`, contentType: { sys: { id: "title" } } },
    fields: {
      slug,
      name,
      tagline,
      synopsis,
      kind,
      year,
      runtimeMinutes: runtime,
      maturity,
      rating,
      genres,
      categories,
      posterUrl: poster(slug),
      backdropUrl: backdrop(slug),
      streamUrl: i % 2 === 0 ? HLS_A : HLS_B,
      cast,
      director,
      featured,
    },
  };
});

const payload = { total: items.length, items };

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "content.json"), JSON.stringify(payload, null, 2) + "\n");
console.log(`Wrote public/content.json with ${items.length} titles.`);
