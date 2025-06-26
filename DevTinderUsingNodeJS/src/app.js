import express from "express";
import { mongoDbConnectionService } from "./config/database.js";
import { authRouter } from "./Routes/Auth/auth.js";
import { authMiddleware } from "./MiddleWares/authMiddleWare.js";
import { UserRouter } from "./Routes/User/userRoutes.js";
import cookieParser from "cookie-parser";
import { ProfileRouter } from "./Routes/UserProfile/ProfileRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user",authMiddleware, UserRouter);
apiRouter.use("/profile",authMiddleware, ProfileRouter);


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
