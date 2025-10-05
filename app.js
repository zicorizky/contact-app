const express = require('express');
const expressEjsLayout = require('express-ejs-layouts');
const { getContacts, addContact, deleteContact, saveContacts } = require('./utils/contacts');
const path = require('path');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressEjsLayout);
app.use(express.static(path.join(__dirname, 'public'))); // kalau kamu punya folder public

// Set view engine
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));

// ========================
// Routes - GET (Views)
// ========================

// Home page
app.get('/', (req, res) => {
  res.render('home');
});

// Tampil semua contacts
app.get('/contact', (req, res) => {
  const contacts = getContacts();
  res.render('contact', { contacts });
});

// Tampil halaman edit contact
app.get('/contact/edit/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const contacts = getContacts();

  if (index < 0 || index >= contacts.length) return res.redirect('/contact');

  const contact = contacts[index];
  res.render('edit-contact', { contact, index });
});

// ========================
// Routes - POST (Aksi)
// ========================

// Tambah contact
app.post('/contact', (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).send('Name dan phone wajib diisi!');
  }

  addContact(req.body);
  res.redirect('/contact');
});

// Hapus contact
app.post('/contact/delete', (req, res) => {
  const { index } = req.body;
  deleteContact(parseInt(index));
  res.redirect('/contact');
});

// Update contact
app.post('/contact/edit/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { name, phone } = req.body;
  const contacts = getContacts();

  if (index < 0 || index >= contacts.length) return res.redirect('/contact');

  contacts[index] = req.body;
  saveContacts(contacts);

  res.redirect('/contact');
});

// ========================
// Export untuk Vercel
// ========================
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));
} else {
  module.exports = app;
}
