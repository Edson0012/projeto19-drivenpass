import { Router } from "express";
import { signInPost, singUpPost } from "../controllers/authControllers";
import { validateSchema } from "../middlewares/schemasValidation";
import { signInSchema, signUpSchema } from "../schemas/authSchemas";

const authRouter = Router();

authRouter.post("/signUp", validateSchema(signUpSchema), singUpPost);
authRouter.post("/signIn", validateSchema(signInSchema), signInPost);

export default authRouter;