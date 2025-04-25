const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.CRYPTO_SECRET_KEY, "hex"); // 32 bytes key

const encrypt = (userPass) => {
    const iv = crypto.randomBytes(16); // 16 bytes
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(userPass, "utf8", "base64");
    encrypted += cipher.final("base64");

    return {
        iv: iv.toString("hex"), // store as hex
        encryptedPassword: encrypted
    };
};

const decrypt = (encrypted, ivHex) => {
    const iv = Buffer.from(ivHex, "hex"); // convert back to bytes
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

module.exports = { encrypt, decrypt };
