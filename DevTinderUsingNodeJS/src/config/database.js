import mongoose from "mongoose";

export const mongoDbConnectionService = mongoose
  .connect(
    "mongodb+srv://santanujana544:QpyGvzkzdIpsnnlS@learnnode.qsakx.mongodb.net/"
  )
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));
