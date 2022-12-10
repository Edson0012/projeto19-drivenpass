import { SignInParams } from "../../protocols";
import authenticationRepositories from "../../repositories/authRepositories";
import { conflictError, notFoundError, unauthorizedError } from "../../middlewares/errorHandlingMiddleware";
import cryptoUtils from "../../utils/bcryptUtils";
import * as authTypes from "../../types/authTypes";
import utilsToken from "../../utils/tokenUtils";

async function signUp(email: string, password: string){
  if(!email || !password) throw notFoundError("requires email and password");

  const userEmail = await authenticationRepositories.findByEmailUser(email);
  if(userEmail) throw unauthorizedError("email already exists");
  
  const hashedPassword = await cryptoUtils.encryptPassword(password);

  const user = await authenticationRepositories.createUser(email, hashedPassword);

  return user;
};

async function signIn(user: authTypes.userBody ){
  if(!user.email || !user.password) throw notFoundError("requires email and password");

  const userExist = await authenticationRepositories.findUser(user.email);
  
  if(!userExist) throw conflictError("Incorrect email or password");

  const password = cryptoUtils.checkPassword(user.password, userExist.password);

  if(!password) throw unauthorizedError("incorrect email or password");

  const token = utilsToken.generateToken(userExist);

  return token
};

const authenticationService = {
    signUp,
    signIn
}

export default authenticationService;