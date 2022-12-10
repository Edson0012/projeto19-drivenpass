import { unauthorizedError } from "../middlewares/errorHandlingMiddleware";
import bcrypt from "bcrypt";

export async function encryptPassword(password: string) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hashSync(password, salt);

  return hashedPassword;
}

export function checkPassword(password: string, hashedPassword: string) {
  const passwordCrypt = bcrypt.compareSync(password, hashedPassword);
  if (!passwordCrypt) throw unauthorizedError("Email or password");

  return passwordCrypt;
}

const bcryptoUtils = {
    encryptPassword,
    checkPassword
}

export default bcryptoUtils;