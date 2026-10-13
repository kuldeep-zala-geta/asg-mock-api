/**
 * VisionPlus Eye Care - dummy API for the n8n eye-care AI agent demo.
 *
 * Zero dependencies: plain node:http. Start with `node api/server.js`.
 * Bookings are persisted to data/bookings.json so the agent cannot fake success -
 * a slot that is already taken really is rejected with HTTP 409.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { clinics, doctors, fees, procedures, faqs, insurance, insuranceGeneralNote } = require(
  process.env.DATASET || './data'
);

const PORT = Number(process.env.PORT || 4500);
const BRAND = process.env.BRAND || 'VisionPlus Eye Care';
// A second dataset keeps its own bookings, so one demo cannot take the other's slots.
const STORE = process.env.STORE_SUFFIX || '';
const PRICE_LIST_FILE = process.env.PRICE_LIST_FILE || 'price-list.pdf';
const DATA_DIR = path.join(__dirname, '..', 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, `bookings${STORE}.json`);
const HANDOFFS_FILE = path.join(DATA_DIR, `handoffs${STORE}.json`);
const NOTIFICATIONS_FILE = path.join(DATA_DIR, `notifications${STORE}.json`);

const HUMAN_AGENTS = ['Priya (Front Desk)', 'Ramesh (Patient Care)', 'Neha (Surgery Counsellor)'];

/* ------------------------------------------------------------------ storage */

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

let bookings = readJson(BOOKINGS_FILE, []);
let handoffs = readJson(HANDOFFS_FILE, []);
let notifications = readJson(NOTIFICATIONS_FILE, []);

/* ------------------------------------------------------------------ helpers */

const norm = (v) => String(v == null ? '' : v).trim().toLowerCase();

function isValidDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || ''))) return false;
  const d = new Date(`${dateStr}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function clinicById(id) {
  return clinics.find((c) => norm(c.id) === norm(id));
}

function doctorById(id) {
  return doctors.find((d) => norm(d.id) === norm(id));
}

function withClinic(doctor) {
  const clinic = clinicById(doctor.clinicId);
  return {
    ...doctor,
    clinicName: clinic ? clinic.name : null,
    city: clinic ? clinic.city : null,
    area: clinic ? clinic.area : null
  };
}

function bookedSlots(doctorId, date) {
  return bookings
    .filter((b) => norm(b.doctorId) === norm(doctorId) && b.date === date && b.status === 'CONFIRMED')
    .map((b) => b.slot);
}

function nextId(prefix, list) {
  return `${prefix}-${String(list.length + 1).padStart(4, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/* ------------------------------------------------------------------ routes */

// Absolute URLs have to carry the scheme the visitor's browser will use: behind a
// tunnel the request arrives as https, and an http:// image on an https page is
// blocked as mixed content. PUBLIC_BASE_URL overrides both when it is set.
function baseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, '');
  const scheme = req.headers['x-forwarded-proto'] || 'http';
  return `${scheme}://${req.headers.host || `localhost:${PORT}`}`;
}

function withImage(base, entry) {
  return entry.imageUrl ? { ...entry, imageUrl: `${base}${entry.imageUrl}` } : entry;
}

function getClinics(q, host) {
  const city = norm(q.city);
  const text = norm(q.q || q.query);
  let result = clinics;
  if (city) {
    result = result.filter((c) => norm(c.city).includes(city) || norm(c.area).includes(city));
    if (!result.length) {
      // "Vaishali Nagar Jaipur" is one thing to a patient and two to a filter,
      // so a phrase that matches nothing is tried a word at a time.
      const words = city.split(/[^a-z0-9]+/).filter((w) => w.length > 2);
      const score = (c) =>
        words.filter((w) => norm(c.city).includes(w) || norm(c.area).includes(w)).length;
      const best = Math.max(0, ...clinics.map(score));
      result = best ? clinics.filter((c) => score(c) === best) : [];
    }
  }
  if (text) {
    result = result.filter((c) =>
      [c.name, c.city, c.area, c.address, c.services.join(' ')].some((f) => norm(f).includes(text))
    );
  }
  return { count: result.length, clinics: result.map((c) => withImage(host, c)) };
}

function getDoctors(q, host) {
  const clinicId = norm(q.clinicId);
  const specialty = norm(q.specialty);
  const city = norm(q.city);
  const text = norm(q.q || q.name);
  let result = doctors.map(withClinic);
  if (clinicId) result = result.filter((d) => norm(d.clinicId) === clinicId);
  if (city) result = result.filter((d) => norm(d.city).includes(city) || norm(d.area).includes(city));
  if (specialty) result = result.filter((d) => d.specialties.some((s) => norm(s).includes(specialty)));
  if (text) result = result.filter((d) => norm(d.name).includes(text) || norm(d.title).includes(text));
  return { count: result.length, doctors: result.map((d) => withImage(host, d)) };
}

function getAvailability(q) {
  const date = q.date || todayStr();
  if (!isValidDate(date)) {
    return { status: 400, body: { error: 'INVALID_DATE', message: 'date must be in YYYY-MM-DD format.' } };
  }
  if (date < todayStr()) {
    return { status: 400, body: { error: 'DATE_IN_PAST', message: `Cannot check availability for ${date}; today is ${todayStr()}.` } };
  }

  let pool = doctors;
  if (q.doctorId) {
    const doc = doctorById(q.doctorId);
    if (!doc) return { status: 404, body: { error: 'DOCTOR_NOT_FOUND', message: `No doctor with id ${q.doctorId}.` } };
    pool = [doc];
  }
  if (q.clinicId) pool = pool.filter((d) => norm(d.clinicId) === norm(q.clinicId));
  if (q.specialty) pool = pool.filter((d) => d.specialties.some((s) => norm(s).includes(norm(q.specialty))));

  const weekday = new Date(`${date}T00:00:00`).getDay();
  const availability = pool.map((d) => {
    const doc = withClinic(d);
    if (!d.days.includes(weekday)) {
      return {
        doctorId: d.id, doctorName: d.name, clinicId: d.clinicId, clinicName: doc.clinicName,
        date, availableSlots: [], reason: 'Doctor does not consult on this day.'
      };
    }
    const taken = bookedSlots(d.id, date);
    return {
      doctorId: d.id, doctorName: d.name, clinicId: d.clinicId, clinicName: doc.clinicName,
      consultationFee: d.consultationFee, date,
      availableSlots: d.slots.filter((s) => !taken.includes(s)),
      bookedSlots: taken
    };
  });

  return { status: 200, body: { date, count: availability.length, availability } };
}

function createAppointment(body) {
  const required = ['patientName', 'phone', 'doctorId', 'date', 'slot'];
  const missing = required.filter((f) => !String(body[f] || '').trim());
  if (missing.length) {
    return { status: 400, body: { booked: false, error: 'MISSING_FIELDS', missing, message: `Missing required field(s): ${missing.join(', ')}.` } };
  }

  const doctor = doctorById(body.doctorId);
  if (!doctor) {
    return { status: 404, body: { booked: false, error: 'DOCTOR_NOT_FOUND', message: `No doctor with id ${body.doctorId}.` } };
  }
  if (!isValidDate(body.date)) {
    return { status: 400, body: { booked: false, error: 'INVALID_DATE', message: 'date must be in YYYY-MM-DD format.' } };
  }
  if (body.date < todayStr()) {
    return { status: 400, body: { booked: false, error: 'DATE_IN_PAST', message: `Cannot book ${body.date}; today is ${todayStr()}.` } };
  }
  // An Indian mobile, after an optional +91 or leading 0: ten digits starting 6-9.
  // Checked here rather than left to the agent, which cannot count digits reliably.
  if (!/^[6-9][0-9]{9}$/.test(String(body.phone).replace(/[^0-9]/g, '').replace(/^(?:91|0)/, ''))) {
    return { status: 400, body: { booked: false, error: 'INVALID_PHONE', message: 'phone must be a ten-digit Indian mobile number starting 6, 7, 8 or 9.' } };
  }

  const weekday = new Date(`${body.date}T00:00:00`).getDay();
  if (!doctor.days.includes(weekday)) {
    return { status: 409, body: { booked: false, error: 'DOCTOR_NOT_AVAILABLE', message: `${doctor.name} does not consult on ${body.date}.`, availableSlots: [] } };
  }
  if (!doctor.slots.includes(body.slot)) {
    return { status: 409, body: { booked: false, error: 'INVALID_SLOT', message: `${body.slot} is not one of ${doctor.name}'s slots.`, availableSlots: doctor.slots.filter((s) => !bookedSlots(doctor.id, body.date).includes(s)) } };
  }
  const taken = bookedSlots(doctor.id, body.date);
  if (taken.includes(body.slot)) {
    return { status: 409, body: { booked: false, error: 'SLOT_TAKEN', message: `${body.slot} on ${body.date} is already booked with ${doctor.name}.`, availableSlots: doctor.slots.filter((s) => !taken.includes(s)) } };
  }

  const clinic = clinicById(doctor.clinicId);
  const appointment = {
    bookingId: nextId('APT', bookings),
    status: 'CONFIRMED',
    patientName: String(body.patientName).trim(),
    phone: String(body.phone).trim(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    clinicId: doctor.clinicId,
    clinicName: clinic ? clinic.name : null,
    clinicAddress: clinic ? clinic.address : null,
    date: body.date,
    slot: body.slot,
    reason: String(body.reason || 'General eye check-up').trim(),
    dob: String(body.dob || '').trim() || null,
    gender: String(body.gender || '').trim() || null,
    consultationFee: doctor.consultationFee,
    createdAt: new Date().toISOString()
  };
  bookings.push(appointment);
  writeJson(BOOKINGS_FILE, bookings);

  return { status: 201, body: { booked: true, message: 'Appointment confirmed.', appointment } };
}

function getAppointments(q) {
  if (String(q.all) === 'true') return { status: 200, body: { count: bookings.length, appointments: bookings } };
  let result = bookings;
  if (q.bookingId) result = result.filter((b) => norm(b.bookingId) === norm(q.bookingId));
  if (q.phone) result = result.filter((b) => b.phone.replace(/\D/g, '').endsWith(String(q.phone).replace(/\D/g, '').slice(-10)));
  if (!q.bookingId && !q.phone) {
    return { status: 400, body: { error: 'MISSING_FILTER', message: 'Provide bookingId or phone to look up appointments.' } };
  }
  return { status: 200, body: { count: result.length, appointments: result } };
}

function cancelAppointment(body) {
  const target = bookings.find((b) => norm(b.bookingId) === norm(body.bookingId));
  if (!target) {
    return { status: 404, body: { cancelled: false, error: 'BOOKING_NOT_FOUND', message: `No appointment with id ${body.bookingId}.` } };
  }
  if (target.status === 'CANCELLED') {
    return { status: 409, body: { cancelled: false, error: 'ALREADY_CANCELLED', message: 'That appointment was already cancelled.' } };
  }
  target.status = 'CANCELLED';
  target.cancelledAt = new Date().toISOString();
  writeJson(BOOKINGS_FILE, bookings);
  return { status: 200, body: { cancelled: true, message: 'Appointment cancelled.', appointment: target } };
}

function getFees(q) {
  const service = norm(q.service || q.q);
  const result = service
    ? fees.filter((f) => norm(f.service).includes(service) || norm(f.label).includes(service))
    : fees;
  if (!result.length) {
    return { status: 200, body: { count: 0, fees: [], message: `No published price for "${q.service || q.q}". Offer a consultation or a human callback.` } };
  }
  return { status: 200, body: { count: result.length, fees: result, disclaimer: 'Indicative ranges. Final cost depends on the eye, lens/laser chosen and the pre-op workup.' } };
}

// The price list as a file the agent can send. A reply can only carry a file
// an API returned the link to, so the link is what this returns.
function getPriceListFile(host) {
  return {
    status: 200,
    body: {
      document: {
        url: `${host}/files/${PRICE_LIST_FILE}`,
        name: `${BRAND} price list.pdf`,
        content_type: 'application/pdf',
      },
      disclaimer: 'Indicative ranges. Final cost depends on the eye, lens/laser chosen and the pre-op workup.',
    },
  };
}

function getProcedures(q) {
  const name = norm(q.name || q.q);
  const result = name ? procedures.filter((p) => norm(p.name).includes(name) || norm(p.title).includes(name)) : procedures;
  if (!result.length) {
    return { status: 404, body: { error: 'PROCEDURE_NOT_FOUND', message: `No information on "${q.name || q.q}". Known procedures: ${procedures.map((p) => p.name).join(', ')}.` } };
  }
  const enriched = result.map((p) => ({
    ...p,
    availableAt: p.availableAt.map((id) => {
      const c = clinicById(id);
      return c ? { clinicId: c.id, name: c.name, city: c.city } : { clinicId: id };
    })
  }));
  return { status: 200, body: { count: enriched.length, procedures: enriched } };
}

function getFaqs(q) {
  const text = norm(q.q || q.query);
  if (!text) return { status: 200, body: { count: faqs.length, faqs } };
  const words = text.split(/\s+/).filter((w) => w.length > 2);
  const scored = faqs
    .map((f) => {
      const hay = norm(`${f.question} ${f.answer} ${f.tags.join(' ')}`);
      const score = words.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
      return { ...f, score };
    })
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  if (!scored.length) {
    return { status: 200, body: { count: 0, faqs: [], message: 'No FAQ matched. Answer only if you are sure, otherwise offer a human callback.' } };
  }
  return { status: 200, body: { count: scored.length, faqs: scored } };
}

function getInsurance(q) {
  const provider = norm(q.provider || q.q);
  const procedure = norm(q.procedure);
  let result = insurance;
  if (provider) result = result.filter((i) => norm(i.provider).includes(provider));
  if (!result.length) {
    return {
      status: 200,
      body: {
        count: 0, insurers: [], generalNote: insuranceGeneralNote,
        message: `"${q.provider || q.q}" is not in our empanelled list. Suggest a reimbursement claim or a human callback.`,
        empanelled: insurance.map((i) => i.provider)
      }
    };
  }
  const view = result.map((i) => {
    if (!procedure) return i;
    const key = procedure.includes('cataract') ? 'coversCataract' : procedure.includes('icl') ? 'coversIcl' : 'coversLasik';
    return { ...i, queriedProcedure: procedure, covered: i[key] };
  });
  return { status: 200, body: { count: view.length, insurers: view, generalNote: insuranceGeneralNote } };
}

function sendNotification(body) {
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();
  if (!phone || !message) {
    return { status: 400, body: { sent: false, error: 'MISSING_FIELDS', message: 'phone and message are required.' } };
  }
  if (!/^[+0-9][0-9 \-]{7,17}$/.test(phone)) {
    return { status: 400, body: { sent: false, error: 'INVALID_PHONE', message: 'phone must be a valid contact number.' } };
  }
  const note = {
    notificationId: nextId('SMS', notifications),
    channel: ['sms', 'whatsapp'].includes(norm(body.channel)) ? norm(body.channel) : 'sms',
    phone,
    message,
    sentAt: new Date().toISOString()
  };
  notifications.push(note);
  writeJson(NOTIFICATIONS_FILE, notifications);
  return { status: 201, body: { sent: true, message: `Details sent to ${phone} by ${note.channel.toUpperCase()}.`, notification: note } };
}

function createHandoff(body) {
  if (!String(body.phone || '').trim() || !String(body.summary || '').trim()) {
    return { status: 400, body: { created: false, error: 'MISSING_FIELDS', message: 'phone and summary are required to raise a callback.' } };
  }
  const urgency = ['low', 'normal', 'high', 'emergency'].includes(norm(body.urgency)) ? norm(body.urgency) : 'normal';
  const etaMinutes = urgency === 'emergency' ? 5 : urgency === 'high' ? 15 : 60;
  const ticket = {
    ticketId: nextId('HND', handoffs),
    status: 'OPEN',
    name: String(body.name || 'Unknown').trim(),
    phone: String(body.phone).trim(),
    summary: String(body.summary).trim(),
    preferredClinicId: body.clinicId || null,
    urgency,
    assignedTo: HUMAN_AGENTS[handoffs.length % HUMAN_AGENTS.length],
    etaMinutes,
    createdAt: new Date().toISOString()
  };
  handoffs.push(ticket);
  writeJson(HANDOFFS_FILE, handoffs);
  return { status: 201, body: { created: true, message: `A care coordinator will call back in about ${etaMinutes} minutes.`, ticket } };
}

/* ------------------------------------------------------------------ server */

function send(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(payload);
}

function sendJsonFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, { error: 'SPEC_NOT_FOUND', message: 'api/openapi.json is missing.' });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(buf);
  });
}

function sendImage(res, name) {
  if (!/^[a-z0-9._-]+\.png$/i.test(name)) return send(res, 404, { error: 'NOT_FOUND', message: 'No such image.' });
  fs.readFile(path.join(__dirname, '..', 'public', 'images', name), (err, buf) => {
    if (err) return send(res, 404, { error: 'FILE_NOT_FOUND', message: `public/images/${name} is missing.` });
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(buf);
  });
}

function sendPdf(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, { error: 'FILE_NOT_FOUND', message: `public/files/${PRICE_LIST_FILE} is missing.` });
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${PRICE_LIST_FILE}"`,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(buf);
  });
}

function sendHtml(res, file) {
  fs.readFile(file, 'utf8', (err, html) => {
    if (err) return send(res, 404, { error: 'UI_NOT_FOUND', message: 'public/index.html is missing.' });
    // One page serves every dataset, so its name is the brand this instance runs as.
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(html.split('{{BRAND}}').join(BRAND));
  });
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        return resolve(JSON.parse(raw));
      } catch {
        // Fall back to form-encoded bodies so any HTTP client shape works.
        if (raw.includes('=')) {
          return resolve(Object.fromEntries(new URLSearchParams(raw).entries()));
        }
        return resolve({ __parseError: true, __raw: raw });
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const q = Object.fromEntries(url.searchParams.entries());
  const route = `${req.method} ${url.pathname.replace(/\/+$/, '') || '/'}`;

  if (req.method === 'OPTIONS') return send(res, 204, {});

  console.log(`[${new Date().toISOString()}] ${route} ${JSON.stringify(q)}`);

  try {
    switch (route) {
      case 'GET /':
      case 'GET /ui':
        return sendHtml(res, path.join(__dirname, '..', 'public', 'index.html'));

      case 'GET /openapi.json':
        // Served so the spec can be registered as an Agentic AI tool either
        // way: inline (fetched by a browser and posted with the tool) or by
        // `spec_url` (fetched by the service itself).
        return sendJsonFile(res, path.join(__dirname, 'openapi.json'));

      case 'GET /health':
        return send(res, 200, {
          service: `${BRAND} dummy API`,
          status: 'ok',
          today: todayStr(),
          bookings: bookings.length,
          handoffs: handoffs.length,
          endpoints: [
            'GET  /api/clinics?city=&q=',
            'GET  /api/doctors?clinicId=&city=&specialty=&q=',
            'GET  /api/availability?doctorId=&clinicId=&specialty=&date=YYYY-MM-DD',
            'POST /api/appointments  {patientName,phone,doctorId,date,slot,reason}',
            'GET  /api/appointments?bookingId=|phone=',
            'POST /api/appointments/cancel  {bookingId}',
            'GET  /api/fees?service=',
            'GET  /api/price-list  (link to the price list PDF)',
            'GET  /api/procedures?name=lasik|cataract|refractive|smile|icl',
            'GET  /api/faqs?q=',
            'GET  /api/insurance?provider=&procedure=',
            'GET  /api/handoff',
            'POST /api/notify   {phone,message,channel}',
            'POST /api/handoff  {name,phone,summary,urgency,clinicId}',
            'GET  /ui  (browser console)'
          ]
        });

      case 'GET /api/clinics':
        return send(res, 200, getClinics(q, baseUrl(req)));

      case 'GET /api/doctors':
        return send(res, 200, getDoctors(q, baseUrl(req)));

      case 'GET /api/availability': {
        const r = getAvailability(q);
        return send(res, r.status, r.body);
      }

      case 'POST /api/appointments': {
        const body = await readBody(req);
        if (body.__parseError) return send(res, 400, { booked: false, error: 'INVALID_JSON', message: 'Request body was not valid JSON.' });
        const r = createAppointment(body);
        return send(res, r.status, r.body);
      }

      case 'GET /api/appointments': {
        const r = getAppointments(q);
        return send(res, r.status, r.body);
      }

      case 'POST /api/appointments/cancel': {
        const body = await readBody(req);
        const r = cancelAppointment({ ...q, ...body });
        return send(res, r.status, r.body);
      }

      case 'GET /api/price-list': {
        const r = getPriceListFile(baseUrl(req));
        return send(res, r.status, r.body);
      }

      case (url.pathname.startsWith('/images/') && req.method === 'GET' ? route : null):
        return sendImage(res, url.pathname.slice('/images/'.length));

      case `GET /files/${PRICE_LIST_FILE}`:
        return sendPdf(res, path.join(__dirname, '..', 'public', 'files', PRICE_LIST_FILE));

      case 'GET /api/fees': {
        const r = getFees(q);
        return send(res, r.status, r.body);
      }

      case 'GET /api/procedures': {
        const r = getProcedures(q);
        return send(res, r.status, r.body);
      }

      case 'GET /api/faqs': {
        const r = getFaqs(q);
        return send(res, r.status, r.body);
      }

      case 'GET /api/insurance': {
        const r = getInsurance(q);
        return send(res, r.status, r.body);
      }

      case 'GET /api/handoff':
        return send(res, 200, { count: handoffs.length, tickets: handoffs });

      case 'POST /api/notify': {
        const r = sendNotification(await readBody(req));
        return send(res, r.status, r.body);
      }

      case 'POST /api/handoff': {
        const body = await readBody(req);
        const r = createHandoff({ ...q, ...body });
        return send(res, r.status, r.body);
      }

      default:
        return send(res, 404, { error: 'NOT_FOUND', message: `No route for ${route}. See GET /health for the endpoint list.` });
    }
  } catch (err) {
    console.error(err);
    return send(res, 500, { error: 'SERVER_ERROR', message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`${BRAND} dummy API listening on http://localhost:${PORT}`);
  console.log(`Browser console:  http://localhost:${PORT}/`);
  console.log(`Today is ${todayStr()} - ${bookings.length} booking(s), ${handoffs.length} handoff ticket(s) loaded.`);
});
