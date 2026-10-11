const bcrypt = require("bcryptjs");

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

async function verifyPassword(account, password) {
    const storedPassword = account.password;

    if (BCRYPT_HASH_PATTERN.test(storedPassword)) {
        return bcrypt.compare(password, storedPassword);
    }

    // Migrate a legacy plaintext password only after the entered password matches.
    if (storedPassword === password) {
        account.password = await hashPassword(password);
        await account.save();
        return true;
    }

    return false;
}

module.exports = { hashPassword, verifyPassword };
