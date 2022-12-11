import { Router } from "express";
import { deleteNetworkByIdAndUserId, getAllNetworks, getNetworksById, postRegisterWifi } from "../controllers/networkControllers";
import { validateToken } from "../middlewares/authenticationMiddleware";
import { validateSchema } from "../middlewares/schemasValidation";
import { networkBody } from "../schemas/networkSchemas";

const networkRouter = Router();

networkRouter.post("/network/create", validateToken, validateSchema(networkBody) ,postRegisterWifi);
networkRouter.get("/network", validateToken, getAllNetworks);
networkRouter.get("/network/:id", validateToken, getNetworksById);
networkRouter.delete("/network/:id", validateToken, deleteNetworkByIdAndUserId);

export default networkRouter;