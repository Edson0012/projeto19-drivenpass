import { Request, Response } from "express";
import { SignInParams, SignUpParams } from "../protocols";
import httpStatus from "http-status";
import authenticationService from "../services/authenticationService/authServices";

export async function singUpPost(req: Request, res: Response) {
    const { email, password } = req.body as SignUpParams;
  
    try {
      const result = await authenticationService.signUp(email, password);
  
      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
}

export async function signInPost(req: Request, res: Response){
  const user = req.body;
  
  try {
    const result = await authenticationService.signIn(user);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}