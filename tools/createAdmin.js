const userModel = require('../models/userModel');
const readline = require('readline/promises');
const mongoose = require('mongoose');
const configuration = require('../configuration/configuration');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getPassword() {
    while (true) {
        const password = await rl.question('Password: ', { password: true });
        const retypePassword = await rl.question('Retype password: ', { password: true });

        if (password === retypePassword) {
            return password;
        }
        console.error('Passwords do not match - try again');
    }
}


async function main() {
    try {
        console.log('Create an admin user');
        const username = await rl.question('Enter username: ');
        const email = await rl.question('Enter email: ');
        const password = await getPassword();

        const newUser = new userModel({
            username: username,
            email: email,
            password: password,
            isAdmin: true
        });

        await newUser.save();
        console.log('Admin user created');
        process.exit(0);
    } catch (err) {
        console.error(err);
    }
}

main();