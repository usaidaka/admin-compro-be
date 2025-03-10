const CryptoJS = require("crypto-js");

const cryptoSecret = process.env.CRYPTO_SECRET;

const encryptPayload = (data) => {
  const { decryptedData } = data;

  try {
    if (decryptedData) {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(decryptedData),
        cryptoSecret
      ).toString();
      return encryptedData;
    }
    return data;
  } catch (error) {
    throw new Error("Gagal mengenkripsi data: " + error.message);
  }
};

module.exports = {
  encryptPayload,
};
