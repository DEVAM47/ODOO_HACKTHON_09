/* ============================================
   TRAVELOOP — Mock Data & Storage
   ============================================ */

const TLData = (() => {
  const STORAGE_KEY = 'traveloop_data';

  /* ── Supabase Setup ── */
  const SUPABASE_URL = 'https://zgkulsyqijfrdhckvnpu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Vsc3lxaWpmcmRoY2t2bnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODY3NzYsImV4cCI6MjA5Mzk2Mjc3Nn0.N_N7-katI9stJ6E77rKOE4S_oiqX4baewzbDu6114hs';
  const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  /* ── Default Data ── */
  const defaults = {
    user: {
      id: 'u1', name: 'Alex Chen', email: 'alex@traveloop.com',
      avatar: '', joinDate: '2025-01-15',
      savedDestinations: ['Tokyo', 'Barcelona', 'Bali'],
      preferences: { currency: 'USD', darkMode: false, notifications: true }
    },
    trips: [
      {
        id: 't1', name: 'Japan Adventure', description: 'Cherry blossom season exploration',
        startDate: '2025-04-01', endDate: '2025-04-14', coverPhoto: 'assets/trips/japan.png',
        status: 'upcoming', budget: 4500,
        stops: [
          {
            id: 's1', city: 'Tokyo', country: 'Japan', dates: '2025-04-01 → 2025-04-05',
            activities: [
              { id: 'a1', name: 'Visit Senso-ji Temple', time: '09:00', cost: 0, day: 1, category: 'sightseeing' },
              { id: 'a2', name: 'Tsukiji Fish Market', time: '12:00', cost: 30, day: 1, category: 'food' },
              { id: 'a3', name: 'Shibuya Crossing', time: '16:00', cost: 0, day: 1, category: 'sightseeing' },
              { id: 'a4', name: 'Akihabara Electronics', time: '10:00', cost: 50, day: 2, category: 'shopping' },
              { id: 'a5', name: 'Ueno Park Cherry Blossoms', time: '14:00', cost: 0, day: 2, category: 'nature' }
            ]
          },
          {
            id: 's2', city: 'Kyoto', country: 'Japan', dates: '2025-04-06 → 2025-04-10',
            activities: [
              { id: 'a6', name: 'Fushimi Inari Shrine', time: '08:00', cost: 0, day: 6, category: 'sightseeing' },
              { id: 'a7', name: 'Tea Ceremony', time: '14:00', cost: 45, day: 6, category: 'culture' },
              { id: 'a8', name: 'Arashiyama Bamboo Grove', time: '09:00', cost: 0, day: 7, category: 'nature' }
            ]
          },
          {
            id: 's3', city: 'Osaka', country: 'Japan', dates: '2025-04-11 → 2025-04-14',
            activities: [
              { id: 'a9', name: 'Dotonbori Street Food', time: '11:00', cost: 25, day: 11, category: 'food' },
              { id: 'a10', name: 'Osaka Castle', time: '15:00', cost: 8, day: 11, category: 'sightseeing' }
            ]
          }
        ],
        budget_breakdown: { flights: 1200, hotels: 1400, food: 600, activities: 300, transport: 500, shopping: 500 },
        notes: [
          { id: 'n1', stop: 'Tokyo', content: 'Remember to get a Suica card at the airport for easy metro access.', timestamp: '2025-03-28' },
          { id: 'n2', stop: 'Kyoto', content: 'Book the tea ceremony at Camellia Garden at least 3 days in advance.', timestamp: '2025-03-29' }
        ],
        packing: {
          essentials: [
            { id: 'p1', name: 'Passport', packed: true },
            { id: 'p2', name: 'Travel Insurance Docs', packed: true },
            { id: 'p3', name: 'Credit Cards', packed: false },
            { id: 'p4', name: 'Phone Charger', packed: true }
          ],
          clothing: [
            { id: 'p5', name: 'Rain Jacket', packed: false },
            { id: 'p6', name: 'Walking Shoes', packed: true },
            { id: 'p7', name: 'Casual Outfits (x5)', packed: false }
          ],
          toiletries: [
            { id: 'p8', name: 'Toothbrush', packed: true },
            { id: 'p9', name: 'Sunscreen', packed: false }
          ],
          electronics: [
            { id: 'p10', name: 'Camera', packed: false },
            { id: 'p11', name: 'Portable Wi-Fi', packed: false }
          ]
        }
      },
      {
        id: 't2', name: 'Mediterranean Cruise', description: 'Island-hopping through the Mediterranean',
        startDate: '2025-06-15', endDate: '2025-06-28', coverPhoto: 'assets/trips/mediterranean.png',
        status: 'planning', budget: 6200,
        stops: [
          { id: 's4', city: 'Barcelona', country: 'Spain', dates: '2025-06-15 → 2025-06-18', activities: [
            { id: 'a11', name: 'Sagrada Familia', time: '10:00', cost: 26, day: 1, category: 'sightseeing' },
            { id: 'a12', name: 'La Boqueria Market', time: '13:00', cost: 15, day: 1, category: 'food' }
          ]},
          { id: 's5', city: 'Rome', country: 'Italy', dates: '2025-06-19 → 2025-06-23', activities: [
            { id: 'a13', name: 'Colosseum Tour', time: '09:00', cost: 18, day: 5, category: 'sightseeing' }
          ]},
          { id: 's6', city: 'Santorini', country: 'Greece', dates: '2025-06-24 → 2025-06-28', activities: [] }
        ],
        budget_breakdown: { flights: 1800, hotels: 2000, food: 800, activities: 400, transport: 600, shopping: 600 },
        notes: [], packing: { essentials: [], clothing: [], toiletries: [], electronics: [] }
      },
      {
        id: 't3', name: 'Bali Retreat', description: 'Wellness and temples',
        startDate: '2024-11-01', endDate: '2024-11-10', coverPhoto: 'assets/trips/bali.png',
        status: 'completed', budget: 2800,
        stops: [
          { id: 's7', city: 'Ubud', country: 'Indonesia', dates: '2024-11-01 → 2024-11-06', activities: [
            { id: 'a14', name: 'Tegallalang Rice Terraces', time: '08:00', cost: 5, day: 1, category: 'nature' },
            { id: 'a15', name: 'Yoga Retreat', time: '06:00', cost: 25, day: 2, category: 'wellness' }
          ]},
          { id: 's8', city: 'Seminyak', country: 'Indonesia', dates: '2024-11-07 → 2024-11-10', activities: [] }
        ],
        budget_breakdown: { flights: 800, hotels: 700, food: 400, activities: 300, transport: 200, shopping: 400 },
        notes: [], packing: { essentials: [], clothing: [], toiletries: [], electronics: [] }
      }
    ],
    destinations: [
      { name: 'Tokyo', country: 'Japan', cost: 3, popularity: 95, region: 'Asia', emoji: '🗼', image: 'assets/destinations/tokyo.png', rating: 4.9, bestTime: 'Mar – May', avgCost: '$2,800', tags: ['Culture', 'Food', 'Tech'], description: 'A dazzling blend of ancient temples and neon-lit skyscrapers. World-class sushi, cherry blossoms, and endless neighbourhoods to explore.' },
      { name: 'Barcelona', country: 'Spain', cost: 2, popularity: 88, region: 'Europe', emoji: '🏰', image: 'assets/destinations/barcelona.png', rating: 4.7, bestTime: 'Apr – Jun', avgCost: '$1,900', tags: ['Architecture', 'Beach', 'Nightlife'], description: 'Gaudí masterpieces, sun-soaked beaches, and a vibrant food scene make Barcelona one of Europe\'s most exciting cities.' },
      { name: 'Bali', country: 'Indonesia', cost: 1, popularity: 92, region: 'Asia', emoji: '🌴', image: 'assets/destinations/bali.png', rating: 4.8, bestTime: 'Apr – Oct', avgCost: '$1,100', tags: ['Wellness', 'Nature', 'Temples'], description: 'Terraced rice fields, sacred temples, and world-class surf breaks. Bali offers spiritual calm and tropical adventure in equal measure.' },
      { name: 'Paris', country: 'France', cost: 3, popularity: 97, region: 'Europe', emoji: '🗼', image: 'assets/destinations/paris.png', rating: 4.8, bestTime: 'Jun – Aug', avgCost: '$3,200', tags: ['Romance', 'Art', 'Cuisine'], description: 'The Eiffel Tower, the Louvre, and the finest patisseries in the world. Paris is the city of light, love, and unforgettable food.' },
      { name: 'New York', country: 'USA', cost: 3, popularity: 90, region: 'Americas', emoji: '🗽', image: 'assets/destinations/newyork.png', rating: 4.7, bestTime: 'Sep – Nov', avgCost: '$3,500', tags: ['Urban', 'Culture', 'Shopping'], description: 'The city that never sleeps. Broadway shows, Central Park, iconic skylines, and a melting pot of cuisines from every corner of the world.' },
      { name: 'Santorini', country: 'Greece', cost: 2, popularity: 85, region: 'Europe', emoji: '🏝️', image: 'assets/destinations/santorini.png', rating: 4.8, bestTime: 'May – Sep', avgCost: '$2,100', tags: ['Romance', 'Sunsets', 'Beaches'], description: 'Iconic white-washed cliffs, volcanic beaches, and the most photographed sunsets on earth. Perfect for a romantic escape.' },
      { name: 'Marrakech', country: 'Morocco', cost: 1, popularity: 78, region: 'Africa', emoji: '🕌', image: 'assets/destinations/marrakech.png', rating: 4.5, bestTime: 'Mar – May', avgCost: '$900', tags: ['Souks', 'Culture', 'Food'], description: 'A sensory overload of spice markets, riads, and rooftop terraces. Marrakech is a gateway to the magic of North Africa.' },
      { name: 'Sydney', country: 'Australia', cost: 3, popularity: 82, region: 'Oceania', emoji: '🌊', image: 'assets/destinations/sydney.png', rating: 4.6, bestTime: 'Sep – Nov', avgCost: '$2,900', tags: ['Beaches', 'Outdoors', 'Harbour'], description: 'The Opera House, Bondi Beach, and a laid-back harbour lifestyle. Sydney combines stunning nature with a world-class urban scene.' },
      { name: 'Cape Town', country: 'South Africa', cost: 2, popularity: 75, region: 'Africa', emoji: '🏔️', image: 'assets/destinations/capetown.png', rating: 4.6, bestTime: 'Nov – Mar', avgCost: '$1,600', tags: ['Nature', 'Safari', 'Wine'], description: 'Table Mountain, Cape Point, and world-renowned wine estates. Cape Town is one of the most dramatically beautiful cities on earth.' },
      { name: 'Kyoto', country: 'Japan', cost: 2, popularity: 87, region: 'Asia', emoji: '⛩️', image: 'assets/destinations/kyoto.png', rating: 4.9, bestTime: 'Mar – May', avgCost: '$2,000', tags: ['Temples', 'Culture', 'Gardens'], description: 'Over 1,600 Buddhist temples, traditional tea houses, and geisha districts. Kyoto is Japan\'s cultural soul, frozen beautifully in time.' },
      { name: 'Reykjavik', country: 'Iceland', cost: 3, popularity: 72, region: 'Europe', emoji: '🌋', image: 'assets/destinations/reykjavik.png', rating: 4.7, bestTime: 'Jun – Aug', avgCost: '$3,100', tags: ['Northern Lights', 'Nature', 'Adventure'], description: 'Midnight sun, geysers, and the ethereal Northern Lights. Iceland is the ultimate destination for nature lovers and adventure seekers.' },
      { name: 'Dubai', country: 'UAE', cost: 3, popularity: 88, region: 'Asia', emoji: '🏙️', image: 'assets/destinations/dubai.png', rating: 4.6, bestTime: 'Nov – Mar', avgCost: '$2,700', tags: ['Luxury', 'Shopping', 'Architecture'], description: 'The world\'s tallest building, indoor ski slopes, and gold-plated everything. Dubai is where the future is already happening.' }
    ],
    activities: [
      { id: 'act1', name: 'Scuba Diving', city: 'Bali', category: 'adventure', cost: 75, duration: '3h', rating: 4.8, emoji: '🤿', image: 'assets/activities/act_scubadiving.png' },
      { id: 'act2', name: 'Cooking Class', city: 'Bangkok', category: 'culture', cost: 40, duration: '4h', rating: 4.9, emoji: '🍳', image: 'assets/activities/act_cookingclass.png' },
      { id: 'act3', name: 'Hot Air Balloon', city: 'Cappadocia', category: 'adventure', cost: 200, duration: '2h', rating: 4.7, emoji: '🎈', image: 'assets/activities/act_hotairballoon.png' },
      { id: 'act4', name: 'Wine Tasting', city: 'Tuscany', category: 'food', cost: 60, duration: '3h', rating: 4.6, emoji: '🍷', image: 'assets/activities/act_winetasting.png' },
      { id: 'act5', name: 'Surfing Lesson', city: 'Bali', category: 'adventure', cost: 35, duration: '2h', rating: 4.5, emoji: '🏄', image: 'assets/activities/act_surfing.png' },
      { id: 'act6', name: 'Temple Tour', city: 'Kyoto', category: 'sightseeing', cost: 15, duration: '5h', rating: 4.8, emoji: '⛩️', image: 'assets/activities/act_templetour.png' },
      { id: 'act7', name: 'Street Food Walk', city: 'Bangkok', category: 'food', cost: 25, duration: '3h', rating: 4.7, emoji: '🍜', image: 'assets/activities/act_streetfood.png' },
      { id: 'act8', name: 'Safari Drive', city: 'Cape Town', category: 'nature', cost: 150, duration: '6h', rating: 4.9, emoji: '🦁', image: 'assets/activities/act_safaridrive.png' },
      { id: 'act9', name: 'Northern Lights Tour', city: 'Reykjavik', category: 'nature', cost: 100, duration: '4h', rating: 4.6, emoji: '🌌', image: 'assets/activities/act_northernlights.png' },
      { id: 'act10', name: 'Gondola Ride', city: 'Venice', category: 'sightseeing', cost: 80, duration: '1h', rating: 4.4, emoji: '🛶', image: 'assets/activities/act_gondolaride.png' }
    ],
    admin: {
      totalUsers: 12847, activeTrips: 3421, revenue: 84520, avgRating: 4.7,
      recentUsers: [
        { name: 'Sarah J.', email: 'sarah@mail.com', trips: 5, status: 'online', joined: '2025-03-01' },
        { name: 'Mike R.', email: 'mike@mail.com', trips: 3, status: 'online', joined: '2025-02-15' },
        { name: 'Lisa W.', email: 'lisa@mail.com', trips: 8, status: 'offline', joined: '2024-12-20' },
        { name: 'Tom H.', email: 'tom@mail.com', trips: 2, status: 'offline', joined: '2025-04-10' },
        { name: 'Emma S.', email: 'emma@mail.com', trips: 12, status: 'online', joined: '2024-08-05' }
      ],
      monthlyTrips: [120, 145, 168, 190, 210, 235, 260, 285, 310, 340, 365, 395],
      monthlyRevenue: [5200, 6100, 7300, 7800, 8200, 9100, 9800, 10500, 11200, 12000, 12800, 13600]
    }
  };

  /* ── Storage (Async via Supabase) ── */
  async function load() {
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase.from('users').select('*').limit(1).single();
      // Fetch trips data
      const { data: tripsData, error: tripsError } = await supabase.from('trips').select('*');

      let user = userData || defaults.user;
      let trips = tripsData || defaults.trips;

      return {
        user,
        trips,
        destinations: defaults.destinations,
        activities: defaults.activities,
        admin: defaults.admin
      };
    } catch (e) {
      console.error('Error loading data from Supabase:', e);
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  async function save(data) {
    // Currently only needed if saving user data specifically, 
    // since trips are managed individually. 
    try {
      if (data.user) {
        await supabase.from('users').upsert(data.user);
      }
    } catch (e) {
      console.error('Error saving data:', e);
    }
  }

  async function reset() {
    // Note: Resetting now would require deleting rows from Supabase, skipping for safety
    return load();
  }

  /* ── Helpers ── */
  async function getTrip(id) {
    const { data } = await supabase.from('trips').select('*').eq('id', id).single();
    return data;
  }
  
  async function updateTrip(id, updates) {
    await supabase.from('trips').update(updates).eq('id', id);
    return load();
  }
  
  async function addTrip(trip) {
    trip.id = 't' + Date.now();
    await supabase.from('trips').insert(trip);
    return load();
  }
  
  async function deleteTrip(id) {
    await supabase.from('trips').delete().eq('id', id);
    return load();
  }
  
  function generateId() { return Math.random().toString(36).substr(2, 9); }

  function getCategoryColor(cat) {
    const colors = {
      sightseeing: '#00629e', food: '#ff7043', adventure: '#006972',
      culture: '#7b1fa2', nature: '#2e7d32', shopping: '#f57c00',
      wellness: '#00838f', transport: '#455a64'
    };
    return colors[cat] || '#757575';
  }

  function getCategoryEmoji(cat) {
    const emojis = {
      sightseeing: '🏛️', food: '🍽️', adventure: '🧗', culture: '🎭',
      nature: '🌿', shopping: '🛍️', wellness: '🧘', transport: '🚌'
    };
    return emojis[cat] || '📌';
  }

  function formatCurrency(amount) { return '$' + amount.toLocaleString(); }
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return { load, save, reset, getTrip, updateTrip, addTrip, deleteTrip, generateId, getCategoryColor, getCategoryEmoji, formatCurrency, formatDate, defaults };
})();
