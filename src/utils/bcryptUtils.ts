import { unauthorizedError } from "../middlewares/errorHandlingMiddleware";
import bcrypt from "bcrypt";

export async function encryptPassword(password: string) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hashSync(password, salt);

  return hashedPassword;
}

export function checkPassword(password: string, hashedPassword: string) {
  if (!bcrypt.compareSync(password, hashedPassword))
    throw unauthorizedError("Email or password");
}

const cryptoUtils = {
    encryptPassword,
    checkPassword
}

export default cryptoUtils;