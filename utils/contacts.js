const fs = require('fs');
const path = require('path');

// path ke contacts.json
const dataPath = path.join(__dirname, '../data/contacts.json');

// ambil semua kontak
const getContacts = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Gagal membaca file contacts.json:', err);
        return [];
    }
};

// save contacts ke file
const saveContacts = (contact) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(contact, null, 2));
    } catch (error) {
        console.error('Gagal menyimpan contacts.json', error);
    };
};

// tambah kontak baru
const addContact = (contact) => {
    const contacts = getContacts();
    contacts.push(contact);
    saveContacts(contacts);
};


function deleteContact(index) {
    const contacts = getContacts();          // ambil semua kontak
    if (index < 0 || index >= contacts.length) return false; // validasi
    contacts.splice(index, 1);               // hapus kontak di posisi index
    saveContacts(contacts);                  // simpan kembali ke contacts.json
    return true;
}

module.exports = { getContacts, addContact, saveContacts, deleteContact };
