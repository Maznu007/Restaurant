import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "restaurant",
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(`Some error occurred ${err}`);
    });
};