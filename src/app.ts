import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/authRouters";
import credentialRouter from "./routers/credentielsRouters";
import networkRouter from "./routers/networkRouters";
import errorHandler from "./middlewares/errorHandlingMiddleware";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(credentialRouter);
app.use(networkRouter);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT || 4000, () => console.log(`server listen on port ${PORT}`));
