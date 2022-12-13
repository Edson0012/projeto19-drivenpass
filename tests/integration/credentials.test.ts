import httpStatus from "http-status";
import supertest from "supertest";
import app from "../../src/app";
import { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories/auth-factories";
import * as jwt from "jsonwebtoken";
import { createCredential, generateValidCredential } from "../factories/credentials-factories";

const server = supertest(app);


beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await init();
  await cleanDb();
});

describe("POST /credential/create",() => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.post("/credential/create");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.post("/credential/create").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 422 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post("/credential/create").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

      describe("when token is valid", () => {
        it("should respond with status 422 if body is not complete", async () => {
            const body = {
                 [faker.lorem.word()]: faker.lorem.word(), 
                 password: faker.internet.password(10),
                 username: faker.name.firstName(),
                 url: faker.internet.avatar(),
                };

            const userWithoutSession = await createUser();
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        
            const response = await server.post("/credential/create").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });

        it("should respond with status 401 if a credential with that title already exists", async () => {
            const body = {
                title: faker.name.firstName(), 
                password: faker.internet.password(10),
                username: faker.name.firstName(),
                url: faker.internet.avatar(),
               };

            const userWithoutSession = await createUser();
            const credential = await createCredential(userWithoutSession,  body)
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
       
            const response = await server.post("/credential/create").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

          it("should respond with status 200 when body is correct and title does not exist", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            const body = {
                title: faker.name.firstName(),
                url: faker.internet.avatar(),
                username: faker.name.firstName(),
                password: faker.internet.password(),
            }

            const response = await server.post("/credential/create").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(expect.objectContaining({
                title: body.title,
                username: body.username,
                url: body.url
            }))
            expect(response.body.id).toBeDefined();
        })   
      })
});

describe("GET /credential", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/credential");
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
        
    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
        
        const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {
         it("should respond with status 200 when user has credentials", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            
            const newCredential = generateValidCredential();

            const credential = await createCredential(user, newCredential);
            
            const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(expect.arrayContaining([{
                id: credential.id,
                title: credential.title,
                username: credential.username,
                url: credential.url,
            }]))
        }) 
      }) 
});

describe("GET /credential/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
        const user = await createUser();
        const credential = await createCredential(user);
        const response = await server.get(`/credential/${credential.id}`);
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
        
    it("should respond with status 401 if given token is not valid", async () => {
        const user = await createUser();
        const credential = await createCredential(user);
        const token = faker.lorem.word();
        
        const response = await server.get(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

    it("should respond with status 401 if given token is not valid", async () => {
        const user = await createUser();
        const credential = await createCredential(user);
        const token = faker.lorem.word();
        
        const response = await server.get(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    }); 
    
    describe("when token is valid", () => {
        it("should respond with status 401 when the credential is not the user's", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            const secondUser = await createUser();
            const secondCredential = await createCredential(secondUser);

            const response = await server.get(`/credential/${secondCredential.id}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should respond with status 404 when credential not found", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

            const response = await server.get(`/credential/-1`).set("Authorization", `Bearer ${token}`);
         
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 200 when finding a credential with id", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);  
            const newCredential = await generateValidCredential();
            const credential = await createCredential(user, newCredential);

            const response = await server.get(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);
         
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(expect.objectContaining({
                title: credential.title,
                username: credential.username,
                url: credential.url,
            }));
        });
    });
});

describe("DELETE /credential/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
        const user = await createUser();
        const credential = await createCredential(user);
        const response = await server.delete(`/credential/${credential.id}`);
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
        
    it("should respond with status 401 if given token is not valid", async () => {
        const user = await createUser();
        const credential = await createCredential(user);
        const token = faker.lorem.word();
        
        const response = await server.delete(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

    it("should respond with status 401 if given token is not valid", async () => {
        const user = await createUser();
        const credential = await createCredential(user);
        const token = faker.lorem.word();
        
        const response = await server.delete(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    }); 
    
    describe("when token is valid", () => {
        it("should respond with status 404 when credential not found", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

            const response = await server.delete(`/credential/-1`).set("Authorization", `Bearer ${token}`);
         
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 401 when the credential is not the user's", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            const secondUser = await createUser();
            const secondCredential = await createCredential(secondUser);

            const response = await server.delete(`/credential/${secondCredential.id}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should respond with status 200 when the credential belongs to the user and is deleted", async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);  
            const newCredential = generateValidCredential();
            const credential = await createCredential(user, newCredential);

            const response = await server.delete(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);
         
            expect(response.status).toBe(httpStatus.OK);
        });
    });
});