export type TradeId =
  | 'plumbing' | 'electrical' | 'carpentry' | 'painting'
  | 'masonry' | 'auto' | 'ac' | 'cleaning'
  | 'welding' | 'solar' | 'pest' | 'appliance';

export interface Task { id: string; label: string; price: number; unit: string }
export interface Service {
  id: TradeId; name: string; twi: string; tagline: string;
  icon: string; image?: string; baseFrom: number;
  tasks: Task[]; popular?: boolean;
}
export interface Artisan {
  id: string; name: string; trade: TradeId; tradeLabel: string;
  city: string; areas: string[]; rating: number; reviewsCount: number;
  jobsDone: number; yearsExp: number; priceFrom: number;
  verified: boolean; availableNow: boolean; topRated?: boolean;
  languages: string[]; phone: string; bio: string; skills: string[];
  color: string; initials: string; image?: string; responseMins: number;
}
export interface Review { id: string; artisanId: string; name: string; city: string; rating: number; text: string; date: string }

export const CITIES = ['Accra','Kumasi','Takoradi','Tamale','Cape Coast','Ho','Sunyani','Koforidua','Tema','Kasoa'];

export const SERVICES: Service[] = [
  { id: 'plumbing', name: 'Plumbing', twi: 'Nsuo dwumadi', tagline: 'Leaks, tanks, heaters & fittings', icon: 'wrench', image: '/images/plumber.jpg', baseFrom: 80, popular: true,
    tasks: [
      { id: 'p1', label: 'Leaking tap / faucet repair', price: 80, unit: 'per tap' },
      { id: 'p2', label: 'Toilet cistern / WC fix', price: 150, unit: 'per unit' },
      { id: 'p3', label: 'Water heater installation', price: 350, unit: 'per unit' },
      { id: 'p4', label: 'Polytank & pump setup', price: 600, unit: 'per job' },
      { id: 'p5', label: 'Full bathroom repiping', price: 1200, unit: 'per bath' },
      { id: 'p6', label: 'Blocked drain unclogging', price: 120, unit: 'per drain' },
    ] },
  { id: 'electrical', name: 'Electrical', twi: 'Anyinam dwumadi', tagline: 'Wiring, fans, lights & faults', icon: 'zap', image: '/images/electrician.jpg', baseFrom: 70, popular: true,
    tasks: [
      { id: 'e1', label: 'Ceiling fan installation', price: 120, unit: 'per fan' },
      { id: 'e2', label: 'Chandelier / light fitting', price: 90, unit: 'per point' },
      { id: 'e3', label: 'Full house wiring (2-bed)', price: 2500, unit: 'per house' },
      { id: 'e4', label: 'Fault tracing & repair', price: 150, unit: 'per visit' },
      { id: 'e5', label: 'DB board / breaker change', price: 400, unit: 'per board' },
      { id: 'e6', label: 'DSTV / wall mounting', price: 180, unit: 'per set' },
    ] },
  { id: 'auto', name: 'Auto Mechanic', twi: 'Ka dwumadi', tagline: 'Diagnostics, service & roadside', icon: 'car', image: '/images/mechanic.jpg', baseFrom: 100, popular: true,
    tasks: [
      { id: 'a1', label: 'Engine diagnostics scan', price: 150, unit: 'per car' },
      { id: 'a2', label: 'Full service (oil + filters)', price: 450, unit: 'per car' },
      { id: 'a3', label: 'Brake pads replacement', price: 300, unit: 'per axle' },
      { id: 'a4', label: 'Roadside rescue / towing assist', price: 250, unit: 'per trip' },
      { id: 'a5', label: 'AC regas & cooling fix', price: 350, unit: 'per car' },
    ] },
  { id: 'cleaning', name: 'Home Cleaning', twi: 'Efie hohoro', tagline: 'Deep cleans & move-in sparkle', icon: 'sparkles', image: '/images/cleaner.jpg', baseFrom: 150, popular: true,
    tasks: [
      { id: 'c1', label: '2-bedroom deep clean', price: 350, unit: 'per flat' },
      { id: 'c2', label: '3-bedroom deep clean', price: 500, unit: 'per flat' },
      { id: 'c3', label: 'Sofa & carpet shampoo', price: 280, unit: 'per set' },
      { id: 'c4', label: 'Post-construction cleanup', price: 800, unit: 'per site' },
      { id: 'c5', label: 'Office / shop cleaning', price: 400, unit: 'per visit' },
    ] },
  { id: 'carpentry', name: 'Carpentry', twi: 'Nnwom dwumadi', tagline: 'Doors, wardrobes & repairs', icon: 'hammer', image: '/images/craft.jpg', baseFrom: 120,
    tasks: [
      { id: 'w1', label: 'Door hanging / lock fix', price: 180, unit: 'per door' },
      { id: 'w2', label: 'Wardrobe build (3-door)', price: 2200, unit: 'per unit' },
      { id: 'w3', label: 'Kitchen cabinet repair', price: 400, unit: 'per job' },
      { id: 'w4', label: 'Roofing woodwork fix', price: 900, unit: 'per job' },
    ] },
  { id: 'painting', name: 'Painting', twi: 'Nkosua', tagline: 'Interior, exterior & designs', icon: 'paint', baseFrom: 500,
    tasks: [
      { id: 'pt1', label: 'Single room repaint', price: 600, unit: 'per room' },
      { id: 'pt2', label: '2-bedroom full repaint', price: 1800, unit: 'per flat' },
      { id: 'pt3', label: 'Exterior (storey building)', price: 4500, unit: 'per house' },
      { id: 'pt4', label: 'Screeding + painting', price: 950, unit: 'per room' },
    ] },
  { id: 'masonry', name: 'Masonry & Tiling', twi: 'Si dwumadi', tagline: 'Blocks, plaster & floor tiles', icon: 'brick', baseFrom: 200,
    tasks: [
      { id: 'm1', label: 'Floor tiling (per m²)', price: 90, unit: 'per m²' },
      { id: 'm2', label: 'Wall crack & plaster repair', price: 350, unit: 'per job' },
      { id: 'm3', label: 'Bathroom re-tiling', price: 1500, unit: 'per bath' },
      { id: 'm4', label: 'Block wall erection', price: 1800, unit: 'per job' },
    ] },
  { id: 'ac', name: 'AC & Refrigeration', twi: 'Mframa', tagline: 'Install, service & gas refill', icon: 'snow', baseFrom: 150,
    tasks: [
      { id: 'ac1', label: 'Split-unit installation', price: 500, unit: 'per unit' },
      { id: 'ac2', label: 'AC servicing / wash', price: 200, unit: 'per unit' },
      { id: 'ac3', label: 'Fridge / freezer repair', price: 250, unit: 'per unit' },
      { id: 'ac4', label: 'Gas refill + leak fix', price: 450, unit: 'per unit' },
    ] },
  { id: 'welding', name: 'Welding & Fabrication', twi: 'Dade dwumadi', tagline: 'Gates, burglar-proof & tanks', icon: 'flame', baseFrom: 250,
    tasks: [
      { id: 'wd1', label: 'Burglar-proof window', price: 650, unit: 'per window' },
      { id: 'wd2', label: 'Metal gate fabrication', price: 3800, unit: 'per gate' },
      { id: 'wd3', label: 'Polytank stand', price: 1200, unit: 'per stand' },
      { id: 'wd4', label: 'Gate / hinge repair', price: 250, unit: 'per job' },
    ] },
  { id: 'solar', name: 'Solar & Generator', twi: 'Owia ahoɔden', tagline: 'Inverters, panels & backup', icon: 'sun', baseFrom: 300,
    tasks: [
      { id: 's1', label: 'Inverter + battery setup', price: 1500, unit: 'per job' },
      { id: 's2', label: 'Solar panel installation', price: 2800, unit: 'per kW' },
      { id: 's3', label: 'Generator servicing', price: 300, unit: 'per unit' },
      { id: 's4', label: 'Changeover switch install', price: 550, unit: 'per unit' },
    ] },
  { id: 'pest', name: 'Pest Control', twi: 'Mbubui', tagline: 'Fumigation & disinfection', icon: 'shield', baseFrom: 250,
    tasks: [
      { id: 'pc1', label: '2-bedroom fumigation', price: 400, unit: 'per flat' },
      { id: 'pc2', label: 'Full house + compound', price: 750, unit: 'per house' },
      { id: 'pc3', label: 'Bedbug treatment', price: 500, unit: 'per room' },
    ] },
  { id: 'appliance', name: 'Appliance Repair', twi: 'Nnoɔma nsiesie', tagline: 'TVs, washers, cookers & more', icon: 'tv', baseFrom: 100,
    tasks: [
      { id: 'ap1', label: 'Washing machine repair', price: 250, unit: 'per unit' },
      { id: 'ap2', label: 'Smart TV / screen fix', price: 300, unit: 'per unit' },
      { id: 'ap3', label: 'Gas cooker / oven fix', price: 200, unit: 'per unit' },
      { id: 'ap4', label: 'Microwave / blender fix', price: 120, unit: 'per unit' },
    ] },
];

export const ARTISANS: Artisan[] = [
  { id: 'kwame-plumb', name: 'Kwame Mensah', trade: 'plumbing', tradeLabel: 'Master Plumber', city: 'Accra', areas: ['East Legon','Osu','Spintex','Adenta'], rating: 4.9, reviewsCount: 214, jobsDone: 640, yearsExp: 11, priceFrom: 80, verified: true, availableNow: true, topRated: true, languages: ['English','Twi','Ga'], phone: '024 412 8890', bio: 'Certified plumber with 11 years across estates in Accra. Polytank, pump automation and bathroom fittings are my speciality. I come with my own tools and leave your place clean.', skills: ['Polytank setup','Water heaters','Bathroom fittings','Leak detection'], color: '#0b3d2e', initials: 'KM', image: '/images/plumber.jpg', responseMins: 8 },
  { id: 'ama-elec', name: 'Ama Owusu', trade: 'electrical', tradeLabel: 'Licensed Electrician', city: 'Kumasi', areas: ['Asokwa','Ahodwo','Kwadaso','Ejisu'], rating: 4.9, reviewsCount: 187, jobsDone: 520, yearsExp: 9, priceFrom: 70, verified: true, availableNow: true, topRated: true, languages: ['English','Twi'], phone: '055 238 1145', bio: 'Energy Commission certified electrician. House wiring, fault tracing and smart fittings. Safety first — every job tested and guaranteed for 6 months.', skills: ['House wiring','Fault tracing','Smart switches','DB boards'], color: '#b97f06', initials: 'AO', image: '/images/electrician.jpg', responseMins: 12 },
  { id: 'yaw-auto', name: 'Yaw Asante', trade: 'auto', tradeLabel: 'Auto Mechanic', city: 'Accra', areas: ['Suame','Circle','Achimota','Tema'], rating: 4.8, reviewsCount: 342, jobsDone: 980, yearsExp: 14, priceFrom: 100, verified: true, availableNow: true, topRated: true, languages: ['English','Twi','Hausa'], phone: '020 815 6632', bio: '14 years on Toyota, Honda, Kia & Benz. Computerised diagnostics at your home or office, plus 24/7 roadside rescue inside Accra.', skills: ['Diagnostics','Brake systems','Full service','Roadside rescue'], color: '#ce1126', initials: 'YA', image: '/images/mechanic.jpg', responseMins: 15 },
  { id: 'efua-clean', name: 'Efua Adu', trade: 'cleaning', tradeLabel: 'Cleaning Lead', city: 'Accra', areas: ['Cantonments','Airport','Labone','Dzorwulu'], rating: 5.0, reviewsCount: 268, jobsDone: 720, yearsExp: 7, priceFrom: 150, verified: true, availableNow: true, topRated: true, languages: ['English','Twi','Ga','Ewe'], phone: '059 774 2091', bio: 'I lead a 6-lady team for deep cleans, move-ins and offices. We bring machines, chemicals and fresh linen scent. Your keys are safe with us.', skills: ['Deep cleaning','Sofa shampoo','Move-in/out','Office contracts'], color: '#147a5b', initials: 'EA', image: '/images/cleaner.jpg', responseMins: 6 },
  { id: 'kofi-carp', name: 'Kofi Boateng', trade: 'carpentry', tradeLabel: 'Carpenter & Joiner', city: 'Kumasi', areas: ['Suame Magazine','Asafo','Mampong'], rating: 4.8, reviewsCount: 156, jobsDone: 410, yearsExp: 12, priceFrom: 120, verified: true, availableNow: false, languages: ['English','Twi'], phone: '054 990 3318', bio: 'Second-generation carpenter from Anloga wood market. Wardrobes, kitchen cabinets and solid doors that last decades.', skills: ['Wardrobes','Kitchen cabinets','Doors','Roofing wood'], color: '#7c4a12', initials: 'KB', image: '/images/craft.jpg', responseMins: 25 },
  { id: 'akua-paint', name: 'Akua Frimpong', trade: 'painting', tradeLabel: 'Painter & Decorator', city: 'Tema', areas: ['Tema C25','Sakumono','Nungua','Ashaiman'], rating: 4.9, reviewsCount: 129, jobsDone: 300, yearsExp: 8, priceFrom: 500, verified: true, availableNow: true, languages: ['English','Twi','Ga'], phone: '053 221 8874', bio: 'Neat lines, no mess. Screeding, wallpaper and 3D wall designs. Free colour consultation before every job.', skills: ['Screeding','Interior repaint','Wallpaper','3D designs'], color: '#ce1126', initials: 'AF', responseMins: 18 },
  { id: 'ibrahim-mason', name: 'Ibrahim Yakubu', trade: 'masonry', tradeLabel: 'Mason & Tiler', city: 'Tamale', areas: ['Tamale Central','Lamashegu','Kukuo'], rating: 4.7, reviewsCount: 98, jobsDone: 260, yearsExp: 10, priceFrom: 200, verified: true, availableNow: true, languages: ['English','Dagbani','Hausa'], phone: '024 665 1029', bio: 'Tiling with laser precision. Bathrooms, kitchens and full floors — plus block work and plastering.', skills: ['Floor tiling','Bathroom re-tile','Plastering','Block work'], color: '#0b3d2e', initials: 'IY', responseMins: 20 },
  { id: 'selasie-ac', name: 'Selasie Kpeglo', trade: 'ac', tradeLabel: 'AC & Fridge Tech', city: 'Accra', areas: ['Madina','Haatso','Legon','Dodowa'], rating: 4.8, reviewsCount: 176, jobsDone: 540, yearsExp: 9, priceFrom: 150, verified: true, availableNow: true, languages: ['English','Ewe','Twi'], phone: '050 339 7712', bio: 'Samsung & LG trained. Split-unit installs, servicing and honest gas refills — I show you the gauge before and after.', skills: ['AC install','Servicing','Fridge repair','Gas refill'], color: '#0e5aa7', initials: 'SK', responseMins: 10 },
  { id: 'osei-weld', name: 'Osei Darko', trade: 'welding', tradeLabel: 'Welder & Fabricator', city: 'Takoradi', areas: ['Takoradi','Sekondi','Kojokrom'], rating: 4.7, reviewsCount: 84, jobsDone: 210, yearsExp: 13, priceFrom: 250, verified: true, availableNow: false, languages: ['English','Twi','Nzema'], phone: '027 410 5566', bio: 'Heavy-duty gates, burglar-proof and tank stands built to survive coastal weather. Free measurement within Takoradi.', skills: ['Metal gates','Burglar-proof','Tank stands','Repairs'], color: '#3d3d3d', initials: 'OD', responseMins: 30 },
  { id: 'nana-solar', name: 'Nana Kojo Prah', trade: 'solar', tradeLabel: 'Solar & Inverter Pro', city: 'Cape Coast', areas: ['Cape Coast','Elmina','Mankessim'], rating: 4.9, reviewsCount: 112, jobsDone: 190, yearsExp: 7, priceFrom: 300, verified: true, availableNow: true, languages: ['English','Fante','Twi'], phone: '055 812 0043', bio: 'Beat dumsor for good. Right-sized inverter, solar and changeover packages with load audit before you pay a pesewa.', skills: ['Inverters','Solar sizing','Changeover','Load audit'], color: '#b97f06', initials: 'NK', responseMins: 14 },
  { id: 'abena-pest', name: 'Abena Serwaa', trade: 'pest', tradeLabel: 'Pest Control Officer', city: 'Kumasi', areas: ['Kumasi','Obuasi','Konongo'], rating: 4.8, reviewsCount: 91, jobsDone: 330, yearsExp: 6, priceFrom: 250, verified: true, availableNow: true, languages: ['English','Twi'], phone: '059 102 4487', bio: 'EPA-approved chemicals, child & pet safe methods. Bedbugs, cockroaches, termites — gone, with 3-month re-treat warranty.', skills: ['Fumigation','Bedbugs','Termites','Disinfection'], color: '#147a5b', initials: 'AS', responseMins: 16 },
  { id: 'emma-appl', name: 'Emmanuel Tetteh', trade: 'appliance', tradeLabel: 'Appliance Doctor', city: 'Accra', areas: ['Kaneshie','Dansoman','Weija','Kasoa'], rating: 4.7, reviewsCount: 143, jobsDone: 480, yearsExp: 8, priceFrom: 100, verified: true, availableNow: true, languages: ['English','Ga','Twi'], phone: '024 778 9902', bio: 'Washers, fridges, TVs, cookers — board-level repairs, not guesswork. 90-day warranty on parts I replace.', skills: ['Washers','TVs','Cookers','Boards'], color: '#0e5aa7', initials: 'ET', responseMins: 11 },
  { id: 'dela-elec', name: 'Dela Agbeko', trade: 'electrical', tradeLabel: 'Electrician', city: 'Ho', areas: ['Ho','Hohoe','Sogakope'], rating: 4.8, reviewsCount: 76, jobsDone: 220, yearsExp: 6, priceFrom: 70, verified: false, availableNow: true, languages: ['English','Ewe'], phone: '050 667 2210', bio: 'Young, fast and tidy. Fans, lights, wiring extensions and prepaid meter issues around Volta Region.', skills: ['Fans & lights','Wiring','Prepaid meters'], color: '#0b3d2e', initials: 'DA', responseMins: 22 },
  { id: 'kwabena-auto', name: 'Kwabena Sarpong', trade: 'auto', tradeLabel: 'Mobile Mechanic', city: 'Kumasi', areas: ['Suame','Tech','Abuakwa'], rating: 4.6, reviewsCount: 119, jobsDone: 390, yearsExp: 10, priceFrom: 100, verified: true, availableNow: false, languages: ['English','Twi'], phone: '054 334 8899', bio: 'I come to you — home, office or roadside. Honest quotes with photos of every worn part before replacement.', skills: ['Mobile service','Suspension','Electrical faults'], color: '#ce1126', initials: 'KS', responseMins: 28 },
  { id: 'akosua-plumb', name: 'Akosua Nyarko', trade: 'plumbing', tradeLabel: 'Plumber', city: 'Sunyani', areas: ['Sunyani','Berekum','Techiman'], rating: 4.9, reviewsCount: 88, jobsDone: 240, yearsExp: 7, priceFrom: 80, verified: true, availableNow: true, languages: ['English','Twi','Ga'], phone: '053 445 7719', bio: 'One of few female master plumbers in Bono. Bathrooms, kitchens and polytank systems — meticulous and on time.', skills: ['Bathrooms','Kitchens','Polytanks'], color: '#147a5b', initials: 'AN', responseMins: 13 },
  { id: 'fiifi-clean', name: 'Fiifi Annan', trade: 'cleaning', tradeLabel: 'Cleaner & Gardener', city: 'Takoradi', areas: ['Takoradi','Effia','Anaji'], rating: 4.7, reviewsCount: 64, jobsDone: 180, yearsExp: 5, priceFrom: 150, verified: false, availableNow: true, languages: ['English','Fante'], phone: '027 990 1123', bio: 'Homes, Airbnbs and short-lets. Linen change, compound sweeping and post-party rescue on weekends.', skills: ['Airbnb turns','Compounds','Post-party'], color: '#0b3d2e', initials: 'FA', responseMins: 19 },
];

export const REVIEWS: Review[] = [
  { id: 'r1', artisanId: 'kwame-plumb', name: 'Nana Ama D.', city: 'East Legon, Accra', rating: 5, text: 'Kwame arrived in 40 minutes, fixed two leaking WCs and a heater. Very neat, wore shoe covers. Highly recommended!', date: 'Aug 2026' },
  { id: 'r2', artisanId: 'kwame-plumb', name: 'Yaw Osei', city: 'Spintex, Accra', rating: 5, text: 'Polytank + automatic pump. Explained everything, fair price, no stories. My water pressure is now amazing.', date: 'Jul 2026' },
  { id: 'r3', artisanId: 'ama-elec', name: 'Kwesi B.', city: 'Asokwa, Kumasi', rating: 5, text: 'Full 3-bedroom wiring. Labelled every breaker. ECG inspection passed first try. Worth every cedi.', date: 'Aug 2026' },
  { id: 'r4', artisanId: 'yaw-auto', name: 'Adjoa M.', city: 'Achimota, Accra', rating: 5, text: 'Car refused to start at 6am. Yaw came, scanned, replaced a sensor and I drove to work by 8. Lifesaver.', date: 'Sep 2026' },
  { id: 'r5', artisanId: 'efua-clean', name: 'Mr. & Mrs. Lartey', city: 'Cantonments, Accra', rating: 5, text: 'Move-in deep clean for a 4-bed. The team was on time, thorough, even cleaned inside cabinets. Sparkling!', date: 'Aug 2026' },
  { id: 'r6', artisanId: 'selasie-ac', name: 'Kwadwo A.', city: 'Madina, Accra', rating: 5, text: 'Two ACs serviced, one regassed. He showed the pressure readings and did not push unnecessary parts. Honest man.', date: 'Jul 2026' },
  { id: 'r7', artisanId: 'nana-solar', name: 'Esi Quainoo', city: 'Elmina', rating: 5, text: '1.5kVA inverter carrying lights, fans, TV and fridge. Dumsor no longer touches us. Professional load audit first.', date: 'Aug 2026' },
  { id: 'r8', artisanId: 'akua-paint', name: 'Fiifi O.', city: 'Sakumono, Tema', rating: 5, text: 'Screeded and painted 3 rooms. Edges razor sharp, zero paint on my tiles. She even helped pick colours.', date: 'Sep 2026' },
];

export const TESTIMONIALS = [
  { name: 'Naa Dedei Lamptey', area: 'Osu, Accra', text: 'My kitchen sink burst on a Sunday morning. Y3FIX-GH sent a plumber in under an hour — paid with MTN MoMo, got a receipt, done.', role: 'Homeowner' },
  { name: 'Dr. Kofi Asare', area: 'Ahodwo, Kumasi', text: 'I run a clinic and cannot afford electrical faults. The verified badge is real — the electrician showed her Energy Commission ID on arrival.', role: 'Clinic owner' },
  { name: 'Mawuena K.', area: 'Ho, Volta', text: 'As a student I feared being overcharged. Upfront prices in cedis saved me — I knew the total before anyone knocked.', role: 'Student' },
];

export const fmtCedi = (n: number) => `GH₵${n.toLocaleString('en-GH')}`;

