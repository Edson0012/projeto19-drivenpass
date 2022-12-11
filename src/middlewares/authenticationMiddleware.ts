import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { missingHeaderError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";
import httpStatus from "http-status";

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
    return res.status(httpStatus.UNAUTHORIZED).send(missingHeaderError("Header is missing"));
  }

  try {
    const user = jwt.verify(token, secretKey);

    res.locals.user = user;

    next();
  } catch {
    res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError("Token"));
  }
}