import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { mongoDbConnectionService } from "./config/database.js";
import { authRouter } from "./Routes/Auth/auth.js";
import { authMiddleware } from "./MiddleWares/authMiddleWare.js";
import { UserRouter } from "./Routes/User/userRoutes.js";
import { ProfileRouter } from "./Routes/UserProfile/ProfileRoutes.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Set this to the URL of your frontend app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,  // Allow cookies to be sent along with the request
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", authMiddleware, UserRouter);
apiRouter.use("/profile", authMiddleware, ProfileRouter);


app.use("/api", apiRouter);


// Always call db connection first before starting the server
const startExpressWithMongoDb = async () => {
  try {
    await mongoDbConnectionService;
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

startExpressWithMongoDb();
