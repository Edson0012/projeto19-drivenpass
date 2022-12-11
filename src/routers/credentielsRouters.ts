import { Router } from "express";
import { validateSchema } from "../middlewares/schemasValidation";
import { credentielsBody } from "../schemas/credentielsSchemas";
import { deleteCredentialById, getAllCredentials, getCredentialById, postCredentialsByUser } from "../controllers/credentialsControllers";
import { validateToken } from "../middlewares/authenticationMiddleware";

const credentialRouter = Router();

credentialRouter.post("/credential/create", validateToken, validateSchema(credentielsBody), postCredentialsByUser)
credentialRouter.get("/credential", validateToken, getAllCredentials);
credentialRouter.get("/credential/:id", validateToken, getCredentialById);
credentialRouter.delete("/credential/:id", validateToken, deleteCredentialById)

export default credentialRouter;