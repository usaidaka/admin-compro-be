const CryptoJS = require("crypto-js");

const cryptoSecret = process.env.CRYPTO_SECRET;

const decryptPayload = (data) => {
  const { encryptedData } = data;

  try {
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, cryptoSecret);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    }
    return data;
  } catch (error) {
    Promise.reject(error);
  }
};

module.exports = {
  decryptPayload,
};
