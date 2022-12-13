import httpStatus from "http-status";
import supertest from "supertest";
import app from "../../src/app";
import { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories/auth-factories";
import * as jwt from "jsonwebtoken";
import { createNetwork, generateInvalidNetwork, generateValidNetwork } from "../factories/network-factories";

const server = supertest(app);


beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await init();
  await cleanDb();
});

describe("POST /network/create", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.post("/network/create");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.post("/network/create").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 422 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post("/network/create").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("when token is valid", () => {
      it("should respond with status 422 if body is not complete", async () => {
        const body = {
             [faker.lorem.word()]: faker.lorem.word(), 
             password: faker.internet.password(10),
             network: faker.name.firstName(),
            };

        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post("/network/create").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });

      it("should respond with status 200 when body is correct", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const body = generateValidNetwork();

        const response = await server.post("/network/create").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.objectContaining({
            title: body.title,
            network: body.network,
        }))
        expect(response.body.id).toBeDefined();
      });
    });
});

describe("GET /network", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/network");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
    
      const response = await server.get("/network").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
      it("hould respond with status 404 when it couldn't be found", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        
        const response = await server.get("/network").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      })


      it("should respond with status 200 when user has network", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        
        const newNetwork = generateValidNetwork();

        const network = await createNetwork(user, newNetwork);
        
        const response = await server.get("/network").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.arrayContaining([{
            id: network.id,
            title: network.title,
            network: network.network,
        }]));
      });
    });
});

describe("GET /network/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
      const user = await createUser();
      const network = await createNetwork(user);
      const response = await server.get(`/credential/${network.id}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
      const user = await createUser();
      const network = await createNetwork(user);
      const token = faker.lorem.word();
    
      const response = await server.get(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const user = await createUser();
      const network = await createNetwork(user);
      const token = faker.lorem.word();
    
      const response = await server.get(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    describe("when token is valid", () => {
      it("should respond with status 401 when the network is not the user's", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const secondUser = await createUser();
        const secondNetwork = await createNetwork(secondUser);

        const response = await server.get(`/network/${secondNetwork.id}`).set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 404 when network not found", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.get(`/network/-1`).set("Authorization", `Bearer ${token}`);
     
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 200 when finding a network with id", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);  
        const newNetwork =  generateValidNetwork();
        const network = await createNetwork(user, newNetwork);

        const response = await server.get(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);
     
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.objectContaining({
            title: network.title,
            network: network.network,
        }));
      });
    });
});

describe("DELETE /network/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
      const user = await createUser();
      const network = await createNetwork(user);
      const response = await server.delete(`/network/${network.id}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
      const user = await createUser();
      const network = await createNetwork(user);
      const token = faker.lorem.word();
    
      const response = await server.delete(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const user = await createUser();
      const network = await createNetwork(user);
      const token = faker.lorem.word();
    
      const response = await server.delete(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    }); 

    describe("when token is valid", () => {
      it("should respond with status 404 when network not found", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.delete(`/network/-1`).set("Authorization", `Bearer ${token}`);
     
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 401 when the network is not the user's", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const secondUser = await createUser();
        const secondNetwork = await createNetwork(secondUser);

        const response = await server.delete(`/network/${secondNetwork.id}`).set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 200 when the network belongs to the user and is deleted", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);  
        const newNetwork = generateValidNetwork();
        const network = await createNetwork(user, newNetwork);

        const response = await server.delete(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);
     
        expect(response.status).toBe(httpStatus.OK);
      });
    });
});