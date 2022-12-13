import httpStatus from "http-status";
import supertest from "supertest";
import app from "../../src/app";
import { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories/auth-factories";
import * as jwt from "jsonwebtoken";
import { createNetwork, generateValidNetwork } from "../factories/network-factories";

const server = supertest(app);


beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await init();
  await cleanDb();
});