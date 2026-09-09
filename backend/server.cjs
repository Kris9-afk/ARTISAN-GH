const http = require('node:http');
const path = require('node:path');
const crypto = require('node:crypto');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = Number(process.env.PORT || 4000);
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const DB_NAME = process.env.DB_NAME || 'Y3FIX-GH';
const DEFAULT_ADMIN_CODE = process.env.ADMIN_ACCESS_CODE || 'Y3FIX-ADMIN';
const allowedMethods = ['GET', 'POST', 'PATCH'];

if (!MONGO_CONNECTION_STRING) throw new Error('MONGO_CONNECTION_STRING is required');

const mongo = new MongoClient(MONGO_CONNECTION_STRING);
let db;
let collections;

const schemas = {
  artisans: {
    bsonType: 'object',
    required: ['id', 'name', 'trade', 'tradeLabel', 'city', 'phone'],
    properties: {
      id: { bsonType: 'string' }, name: { bsonType: 'string' }, trade: { bsonType: 'string' },
      tradeLabel: { bsonType: 'string' }, city: { bsonType: 'string' }, phone: { bsonType: 'string' },
      areas: { bsonType: 'array', items: { bsonType: 'string' } }, rating: { bsonType: 'number' },
      reviewsCount: { bsonType: 'number' }, jobsDone: { bsonType: 'number' }, yearsExp: { bsonType: 'number' },
      priceFrom: { bsonType: 'number' }, verified: { bsonType: 'bool' }, availableNow: { bsonType: 'bool' },
      languages: { bsonType: 'array', items: { bsonType: 'string' } }, bio: { bsonType: 'string' },
      skills: { bsonType: 'array', items: { bsonType: 'string' } }, color: { bsonType: 'string' },
      initials: { bsonType: 'string' }, responseMins: { bsonType: 'number' }, image: { bsonType: 'string' },
    },
  },
  bookings: {
    bsonType: 'object', required: ['id', 'name', 'phone', 'total', 'createdAt'],
    properties: { id: { bsonType: 'string' }, name: { bsonType: 'string' }, phone: { bsonType: 'string' }, total: {}, createdAt: { bsonType: 'string' }, status: { bsonType: 'string' } },
  },
  messages: {
    bsonType: 'object', required: ['bookingId', 'text', 'from', 'at'],
    properties: { bookingId: { bsonType: 'string' }, text: { bsonType: 'string' }, from: { bsonType: 'string' }, at: { bsonType: 'string' } },
  },
  settings: {
    bsonType: 'object', required: ['key', 'salt', 'hash'],
    properties: { key: { bsonType: 'string' }, salt: { bsonType: 'string' }, hash: { bsonType: 'string' } },
  },
  services: {
    bsonType: 'object', required: ['id', 'name', 'tagline', 'icon', 'baseFrom', 'tasks'],
    properties: {
      id: { bsonType: 'string' }, name: { bsonType: 'string' }, twi: { bsonType: 'string' },
      tagline: { bsonType: 'string' }, icon: { bsonType: 'string' }, image: { bsonType: 'string' },
      baseFrom: { bsonType: 'number' }, popular: { bsonType: 'bool' },
      tasks: { bsonType: 'array', items: { bsonType: 'object', required: ['id', 'label', 'price', 'unit'] } },
    },
  },
  reviews: {
    bsonType: 'object', required: ['id', 'artisanId', 'name', 'city', 'rating', 'text', 'date'],
    properties: { id: { bsonType: 'string' }, artisanId: { bsonType: 'string' }, name: { bsonType: 'string' }, city: { bsonType: 'string' }, rating: { bsonType: 'number' }, text: { bsonType: 'string' }, date: { bsonType: 'string' } },
  },
  testimonials: {
    bsonType: 'object', required: ['name', 'area', 'text', 'role'],
    properties: { name: { bsonType: 'string' }, area: { bsonType: 'string' }, text: { bsonType: 'string' }, role: { bsonType: 'string' } },
  },
};

async function setupDatabase() {
  db = mongo.db(DB_NAME);
  for (const [name, validator] of Object.entries(schemas)) {
    try {
      await db.createCollection(name, { validator: { $jsonSchema: validator }, validationLevel: 'strict' });
    } catch (error) {
      if (error.codeName !== 'NamespaceExists') throw error;
      await db.command({ collMod: name, validator: { $jsonSchema: validator }, validationLevel: 'strict' });
    }
  }
  collections = {
    artisans: db.collection('artisans'), bookings: db.collection('bookings'),
    messages: db.collection('messages'), settings: db.collection('settings'),
    services: db.collection('services'), reviews: db.collection('reviews'), testimonials: db.collection('testimonials'),
  };
  await collections.artisans.createIndex({ id: 1 }, { unique: true });
  await collections.bookings.createIndex({ id: 1 }, { unique: true });
  await collections.messages.createIndex({ bookingId: 1, at: 1 });
  await collections.settings.createIndex({ key: 1 }, { unique: true });
  await collections.services.createIndex({ id: 1 }, { unique: true });
  await collections.reviews.createIndex({ artisanId: 1, date: -1 });
  await initializeAdminCode();
}

async function initializeAdminCode() {
  const existing = await collections.settings.findOne({ key: 'admin-code' });
  if (!existing) await collections.settings.insertOne({ key: 'admin-code', ...hashAdminCode(DEFAULT_ADMIN_CODE) });
}

async function migrateJsonData() {
  const fs = require('node:fs/promises');
  try {
    const legacy = JSON.parse(await fs.readFile(path.join(__dirname, 'data.json'), 'utf8'));
    if (legacy.artisans?.length && await collections.artisans.countDocuments() === 0) await collections.artisans.insertMany(legacy.artisans);
    if (legacy.bookings?.length && await collections.bookings.countDocuments() === 0) await collections.bookings.insertMany(legacy.bookings);
    if (legacy.chats && await collections.messages.countDocuments() === 0) {
      const messages = Object.entries(legacy.chats).flatMap(([bookingId, items]) => items.map(message => ({ ...message, bookingId })));
      if (messages.length) await collections.messages.insertMany(messages);
    }
    const source = await fs.readFile(path.join(__dirname, '..', 'frontend', 'src', 'data', 'market.ts'), 'utf8');
    const seed = (name, collection, pattern) => {
      if (!pattern.test(source)) throw new Error(`Could not find frontend ${name} seed data`);
      const match = source.match(pattern);
      return Function(`return ${match[1]}`)();
    };
    if (await collections.artisans.countDocuments() === 0) {
      const artisans = seed('artisan', collections.artisans, /export const ARTISANS: Artisan\[\] = (\[[\s\S]*?\]);/);
      if (Array.isArray(artisans) && artisans.length) await collections.artisans.insertMany(artisans);
    }
    if (await collections.services.countDocuments() === 0) {
      const services = seed('service', collections.services, /export const SERVICES: Service\[\] = (\[[\s\S]*?\]);/);
      if (Array.isArray(services) && services.length) await collections.services.insertMany(services);
    }
    if (await collections.reviews.countDocuments() === 0) {
      const reviews = seed('review', collections.reviews, /export const REVIEWS: Review\[\] = (\[[\s\S]*?\]);/);
      if (Array.isArray(reviews) && reviews.length) await collections.reviews.insertMany(reviews);
    }
    if (await collections.testimonials.countDocuments() === 0) {
      const testimonials = seed('testimonial', collections.testimonials, /export const TESTIMONIALS = (\[[\s\S]*?\]);/);
      if (Array.isArray(testimonials) && testimonials.length) await collections.testimonials.insertMany(testimonials);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function hashAdminCode(code, salt = crypto.randomBytes(16).toString('hex')) {
  return {
    salt,
    hash: crypto.scryptSync(code, salt, 64).toString('hex'),
  };
}

async function adminCodeMatches(code) {
  const normalizedCode = typeof code === 'string' ? code.trim() : '';
  const stored = await collections.settings.findOne({ key: 'admin-code' });
  const expected = Buffer.from(stored.hash, 'hex');
  const actual = Buffer.from(hashAdminCode(normalizedCode, stored.salt).hash, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
    'Access-Control-Allow-Methods': allowedMethods.join(', '),
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

async function body(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error('Request body must be valid JSON');
    error.status = 400;
    throw error;
  }
}

function route(pathname) {
  return pathname.split('/').filter(Boolean);
}

async function handle(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (!allowedMethods.includes(req.method)) return send(res, 405, { error: 'Method not allowed' });

  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname.replace(/^\/api/, '');
  const parts = route(pathname);
  if (parts.length === 1 && parts[0] === 'health' && req.method === 'GET') {
    return send(res, 200, { status: 'ok', service: 'Y3FIX-GH API' });
  }
  if (parts.length === 2 && parts[0] === 'admin' && parts[1] === 'login' && req.method === 'POST') {
    const credentials = await body(req);
    if (typeof credentials.code !== 'string' || !(await adminCodeMatches(credentials.code))) {
      return send(res, 401, { error: 'Invalid admin access code' });
    }
    return send(res, 200, { authenticated: true });
  }
  if (parts.length === 2 && parts[0] === 'admin' && parts[1] === 'change-code' && req.method === 'POST') {
    const credentials = await body(req);
    if (!(await adminCodeMatches(credentials.currentCode))) {
      return send(res, 401, { error: 'Current admin access code is invalid' });
    }
    if (typeof credentials.newCode !== 'string' || credentials.newCode.length < 8) {
      return send(res, 422, { error: 'New admin access code must be at least 8 characters' });
    }
    await collections.settings.updateOne({ key: 'admin-code' }, { $set: hashAdminCode(credentials.newCode) });
    return send(res, 200, { changed: true });
  }
  if (parts.length === 1 && parts[0] === 'bookings' && req.method === 'GET') {
    return send(res, 200, await collections.bookings.find({}, { projection: { _id: 0 } }).toArray());
  }
  if (parts.length === 1 && parts[0] === 'artisans' && req.method === 'GET') {
    return send(res, 200, await collections.artisans.find({}, { projection: { _id: 0 } }).toArray());
  }
  if (parts.length === 1 && parts[0] === 'services' && req.method === 'GET') {
    return send(res, 200, await collections.services.find({}, { projection: { _id: 0 } }).sort({ name: 1 }).toArray());
  }
  if (parts.length === 1 && parts[0] === 'reviews' && req.method === 'GET') {
    return send(res, 200, await collections.reviews.find({}, { projection: { _id: 0 } }).sort({ date: -1 }).toArray());
  }
  if (parts.length === 1 && parts[0] === 'testimonials' && req.method === 'GET') {
    return send(res, 200, await collections.testimonials.find({}, { projection: { _id: 0 } }).toArray());
  }
  if (parts.length === 1 && parts[0] === 'cities' && req.method === 'GET') {
    const cities = await collections.artisans.distinct('city');
    return send(res, 200, cities.sort());
  }
  if (parts.length === 1 && parts[0] === 'artisans' && req.method === 'POST') {
    const artisan = await body(req);
    if (!artisan.id || !artisan.name || !artisan.trade || !artisan.phone) {
      return send(res, 422, { error: 'id, name, trade and phone are required' });
    }
    const saved = { ...artisan, id: artisan.id };
    await collections.artisans.replaceOne({ id: saved.id }, saved, { upsert: true });
    return send(res, 201, saved);
  }
  if (parts.length === 1 && parts[0] === 'bookings' && req.method === 'POST') {
    const booking = await body(req);
    if (!booking.name || !booking.phone || !booking.total) {
      return send(res, 422, { error: 'name, phone and total are required' });
    }
    const saved = {
      ...booking,
      id: booking.id || `Y3-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: booking.createdAt || new Date().toISOString(),
    };
    await collections.bookings.insertOne(saved);
    return send(res, 201, saved);
  }
  if (parts.length === 2 && parts[0] === 'bookings' && req.method === 'PATCH') {
    const update = await body(req);
    const result = await collections.bookings.findOneAndUpdate({ id: parts[1] }, { $set: update }, { returnDocument: 'after', projection: { _id: 0 } });
    if (!result) return send(res, 404, { error: 'Booking not found' });
    return send(res, 200, result);
  }
  if (parts.length === 3 && parts[0] === 'bookings' && parts[2] === 'messages' && req.method === 'GET') {
    return send(res, 200, await collections.messages.find({ bookingId: parts[1] }, { projection: { _id: 0, bookingId: 0 } }).sort({ at: 1 }).toArray());
  }
  if (parts.length === 3 && parts[0] === 'bookings' && parts[2] === 'messages' && req.method === 'POST') {
    const message = await body(req);
    if (!message.text || !message.from) return send(res, 422, { error: 'text and from are required' });
    const saved = { ...message, at: message.at || new Date().toISOString() };
    await collections.messages.insertOne({ ...saved, bookingId: parts[1] });
    return send(res, 201, saved);
  }
  return send(res, 404, { error: 'Route not found' });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    send(res, error.status || 500, { error: error.status ? error.message : 'Internal server error' });
  });
});

async function start() {
  await mongo.connect();
  await setupDatabase();
  await migrateJsonData();
  server.listen(PORT, () => console.log(`Y3FIX-GH API listening on http://localhost:${PORT}`));
}

start().catch(error => { console.error('Unable to start MongoDB-backed API', error); process.exitCode = 1; });
