import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { missingHeaderError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";

dotenv.config();

export async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const secretKey = process.env.JWT_SECRET;

  if (secretKey === undefined || token === undefined) {
    throw missingHeaderError("Header is missing");
  }
  console.log("1");
  console.log(token);
  console.log(secretKey);
  try {
    const user = jwt.verify(token, secretKey);
    console.log(user);
    res.locals.user = user;

    next();
  } catch {
    throw unauthorizedError("Token");
  }
}