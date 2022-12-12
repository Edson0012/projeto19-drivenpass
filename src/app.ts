import express, {Express} from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/authRouters";
import credentialRouter from "./routers/credentielsRouters";
import networkRouter from "./routers/networkRouters";
import errorHandler from "./middlewares/errorHandlingMiddleware";
import { connectDb, disconnectDB } from "./config/database";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(credentialRouter);
app.use(networkRouter);
app.use(errorHandler);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}
  
export async function close(): Promise<void> {
    await disconnectDB();
}

export default app;