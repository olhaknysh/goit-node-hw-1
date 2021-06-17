const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname + '/db/contacts.json');

async function listContacts() {
    try {
        const contactsList = await (await fs.readFile(contactsPath)).toString();
        const parsedContactsList = JSON.parse(contactsList);
        console.table(parsedContactsList);

    } catch (err) {
        console.error(err.message);
    }

}

async function getContactById(contactId) {
    if (isNaN(contactId)) {
        console.warn('Id has to be a number');
        return;
    }

    try {
        const contactsList = await (await fs.readFile(contactsPath)).toString();
        const parsedContactsList = JSON.parse(contactsList);
        const contact = await parsedContactsList.filter(contact => contact.id === contactId);
        console.log(contact);
    } catch (err) {
        console.error(err.message);
    }

}

async function removeContact(contactId) {
    if (isNaN(contactId)) {
        console.warn('Id has to be a number');
        return;
    }

    try {
        if (!contactId) {
            throw new Error('Please enter id');
        }

        const contactsList = await (await fs.readFile(contactsPath)).toString();
        const parsedContactsList = JSON.parse(contactsList);
        const newContacts = parsedContactsList.filter(contact => contact.id !== contactId);

        if (newContacts.length === parsedContactsList.length) {
            throw new Error(`Contact with id ${contactId} does not exist`);
        }

        return fs.writeFile(contactsPath, JSON.stringify(newContacts));
    } catch (err) {
        console.error(err.message);
    }
}

async function addContact(name, email, phone) {
    const nameRegExp = /^[a-zA-Z\-]+$/;
    const emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const phoneRegExp = /[\d\-]+$/;

    if (!nameRegExp.test(name)) {
        return 'Name has to consist of letters or "-"';
    } else if (!emailRegExp.test(email)) {
        return 'You have entered an invalid email address!';
    } else if (!phoneRegExp.test(phone)) {
        return 'Phone has to consist of numbers or "-"';
    }

    try {
        const contactsList = await (await fs.readFile(contactsPath)).toString();
        const parsedContactsList = JSON.parse(contactsList);
        const newContact = {
            id: parsedContactsList.length + 1,
            name,
            email,
            phone,
        }

        const possibleRepeatContact = parsedContactsList.reduce((acc, contact) => {
            if (contact.name === name || contact.email === email || contact.phone === phone) {
                return acc + 1;
            }
            return acc;
        }, 0);
        if (possibleRepeatContact > 0) {
            throw new Error('Please enter unique data');
        }

        parsedContactsList.push(newContact);
        return fs.writeFile(contactsPath, JSON.stringify(parsedContactsList));

    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}
