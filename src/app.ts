import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/authRouters";
import credentialRouter from "./routers/credentielsRouters";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(credentialRouter);

const PORT = process.env.PORT;
app.listen(PORT || 4000, () => console.log(`server listen on port ${PORT}`));
