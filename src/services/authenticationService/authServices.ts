import { SignInParams } from "../../protocols";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client"
import authenticationRepositories from "../../repositories/authRepositories";
import { notFoundError, unauthorizedError } from "../../middlewares/errorHandlingMiddleware";
import cryptoUtils from "../../utils/bcryptUtils";

async function signUp(email: string, password: string){
  if(!email || !password) throw notFoundError("requires email and password");

  const userEmail = await authenticationRepositories.findByEmailUser(email);
  if(userEmail) throw unauthorizedError("email already exists");
  
  const hashedPassword = await cryptoUtils.encryptPassword(password);

  const user = await authenticationRepositories.createUser(email, hashedPassword);

  return user;
};

async function signIn(){

};

const authenticationService = {
    signUp
}

export default authenticationService;