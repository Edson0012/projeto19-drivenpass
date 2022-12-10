import { Router } from "express";
import { singUpPost } from "../controllers/authControllers";
import { validateSchema } from "../middlewares/schemasValidation";
import { signUpSchema } from "../schemas/authSchemas";

const authRouter = Router();

authRouter.post("/signUp", validateSchema(signUpSchema), singUpPost)

export default authRouter;