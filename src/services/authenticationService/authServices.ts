import { SignInParams } from "../../protocols";
import authenticationRepositories from "../../repositories/authRepositories";
import { conflictError, notFoundError, unauthorizedError } from "../../middlewares/errorHandlingMiddleware";
import cryptoUtils from "../../utils/bcryptUtils";
import * as authTypes from "../../types/authTypes";
import utilsToken from "../../utils/tokenUtils";
import { exclude } from "../../utils/prismaUtils";

async function signUp(email: string, password: string){

  const userEmail = await authenticationRepositories.findByEmailUser(email);
  if(userEmail) throw unauthorizedError("email");
  
  const hashedPassword = await cryptoUtils.encryptPassword(password);

  return authenticationRepositories.createUser(email, hashedPassword);
};


async function signIn(user: authTypes.signInSchema ){

  const userExist = await authenticationRepositories.findUser(user.email);
  
  if(!userExist) throw conflictError("Email or password is invalid");

  cryptoUtils.checkPassword(user.password, userExist.password);

  const token = utilsToken.generateToken(userExist);
  return {
    user: exclude(userExist, "password"),
    token,
  };
};

const authenticationService = {
    signUp,
    signIn
}

export default authenticationService;