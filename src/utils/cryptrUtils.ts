import Cryptr from "cryptr";

const cryptr = new Cryptr(String(process.env.CRYPTR_SECRET_KEY));

export function returnEncrypt(data: string) {
    const StringEncrypted = cryptr.encrypt(data);
    return StringEncrypted;
}
  
export function returnDecrypt(StringEncrypted: string) {
    const stringDecrypted = cryptr.decrypt(StringEncrypted);
    return stringDecrypted;
}

const cryptrUtils = {
    returnDecrypt,
    returnEncrypt
}

export default cryptrUtils;