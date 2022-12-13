import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export function generateToken(user: User) {
    const token = jwt.sign({ userId: user.id }, String(process.env.JWT_SECRET), {
      expiresIn: "24h",
    });
  
    return token;
}

const utilsToken = {
    generateToken,
}

export default utilsToken