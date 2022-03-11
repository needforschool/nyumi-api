import { ApolloServer } from "apollo-server-fastify";
import dotenv from "dotenv-flow";
import cors from "cors";
import fastifyExpress from "fastify-express";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import Log from "./utils/log";
import fastify, { FastifyInstance } from "fastify";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { MongoDBConfig } from "./services/mongodb/config";

// main function
const main = async () => {
  // load dotenv files
  dotenv.config({
    default_node_env: "development",
    silent: true,
  });
  Log.info(`current env ${process.env.NODE_ENV}`);

  // log dotenv files in console
  dotenv
    .listDotenvFiles(".", process.env.NODE_ENV)
    .forEach((file) => Log.info(`loaded env from ${file}`));

  // define app props with env vars
  const dbConfig = new MongoDBConfig({
    method: process.env.MONGODB_METHOD,
    username: process.env.MONGODB_USERNAME || "",
    password: process.env.MONGODB_PASSWORD || "",
    serverUri: process.env.MONGODB_SERVER_URI || "",
    databaseName: process.env.MONGODB_DATABASE || "",
    params: process.env.MONGODB_PARAMS?.split(",") || [],
  });

  // APOLLO PLUGINS

  const BASIC_LOGGING = {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext) {
      Log.info("request started:", requestContext.request.query);

      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        async parsingDidStart() {
          Log.info("parsing started");
        },

        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart() {
          Log.info("validation started");
        },

        async didEncounterErrors(requestContext) {
          Log.error(requestContext.errors);
        },
      };
    },
  };

  const fastifyAppClosePlugin = (app: FastifyInstance) => {
    return {
      async serverWillStart() {
        return {
          async drainServer() {
            await app.close();
          },
        };
      },
    };
  };

  // CORS

  const allowedOrigins = [
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8100",
    "http://172.20.10.12:8100",
    "http://172.20.10.10:8100",
    "http://172.24.14.29:8100",
    "https://studio.apollographql.com",
  ];

  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
  };

  // generate fastify app
  const app = fastify();

  // generate apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ request }) => ({ request }),
    plugins: [
      BASIC_LOGGING,
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
  });

  // run server with mongo and apollo
  try {
    await app.register(fastifyExpress);
    app.use(cors(corsOptions));
    await dbConfig.connect();
    Log.event("connected to mongodb");
    await server.start();
    Log.event("apollo server started");
    app.register(server.createHandler());
    const address = await app.listen(
      process.env.PORT || 8000,
      process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost"
    );
    Log.ready(
      `started server on ${address}, graphpql: ${address + server.graphqlPath}`
    );
  } catch (err) {
    Log.error(err);
  }
};

// run main function
main();
