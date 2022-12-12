import { init } from "../../src/app";
import { prisma } from "../../src/config/database"
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { createUser, createUser as createUserSeed } from "../factories/auth-factories";
import { cleanDb } from "../helpers";
import authenticationService from "../../src/services/authenticationService/authServices"
import { duplicatedEmailError } from "../../src/services/authenticationService/errors"
import { conflictError, unauthorizedError } from "@/middlewares/errorHandlingMiddleware";
import { SignInParams } from "../../src/protocols/index";

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await init();
  await cleanDb();
})

describe("createUser", () => {

  it("should throw duplicatedUserError if there is a user with given email", async () => {
    const existingUser = await createUserSeed();
    const email = existingUser.email;
    const password = faker.internet.password(10)
    try {
      await authenticationService.signUp(email,password);
      fail("should throw duplicatedUserError");
    } catch (error) {
      expect(error).toEqual(unauthorizedError("email"));
    }
  });

  it("should create user when given email is unique", async () => {
    
    const email = faker.internet.email();
    const password = faker.internet.password(10); 
    
    const user = await authenticationService.signUp(email, password);

    const dbUser = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
      }
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        email: dbUser.email,
      }),
    );
  });

  it("should hash user password", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = await authenticationService.signUp(
      email,
      password
    );

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(dbUser.password).not.toBe(password);
    expect(await bcrypt.compare(password, dbUser.password)).toBe(true);
  });
});

describe("signIn", () => {
  const generateParams = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(10),
  });

  it("should throw InvalidCredentialError if there is no user for given email", async () => {
    const params = generateParams();

    try {
      await authenticationService.signIn(params);
      fail("should throw InvalidCredentialError");
    } catch (error) {
      expect(error).toEqual(conflictError("Email or password is invalid"));
    }
  });

  it("should throw InvalidCredentialError if given password is invalid", async () => {
    const params = generateParams();
    await createUser({
      email: params.email,
      password: "invalid-password",
    });

    try {
      await authenticationService.signIn(params);
      fail("should throw InvalidCredentialError");
    } catch (error) {
      expect(error).toEqual(unauthorizedError("Email or password"));
    }
  });

  describe("when email and password are valid", () => {
    it("should return user data if given email and password are valid", async () => {
      const params = generateParams();
      const user = await createUser(params);

      const {user: signInUser} = await authenticationService.signIn(params);
      expect(user).toEqual(
        expect.objectContaining({
          id: signInUser.id,
          email: signInUser.email,
        }),
      );
    });
  });
});