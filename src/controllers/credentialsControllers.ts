import { Request, Response } from "express";
import httpStatus from "http-status";
import credentialsService from "../services/credentialsServices";

export async function postCredentialsByUser( req: Request, res: Response ) {
  const credentials = req.body;
  const { user } = res.locals;

try{
      const result = await credentialsService.createCredentials(user.userId, credentials);

      return res.status(httpStatus.OK).send(result);

    } catch(error) {

      if(error.type === "error_unauthorized"){
        return res.status(httpStatus.UNAUTHORIZED).send(error.message);
      }

      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}

export async function getAllCredentials(req: Request, res: Response) {
  const { user } = res.locals;

  try {
    const allCredentials = await credentialsService.allCredentials(user.userId);

    return res.status(httpStatus.OK).send(allCredentials);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function getCredentialById(req: Request, res: Response) {
  const id = req.params.id
  const { user } = res.locals;
  console.log(user);
  try {
    const credential = await credentialsService.fetchCredentialById(user.userId, +id)

    return res.status(httpStatus.OK).send(credential);
  } catch (error) {

    if(error.type === "error_not_found"){
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if(error.type === "error_unauthorized"){
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function deleteCredentialById(req: Request, res: Response) {
  const id = req.params.id;
  const { user } = res.locals;
  console.log(user);
  console.log(id);
  try {
    
    const result = await credentialsService.deleteCredential(user.userId, +id)

    return res.status(httpStatus.OK).send("deleted");
  } catch (error) {
    if(error.type === "error_not_found"){
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if(error.type === "error_unauthorized"){
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}