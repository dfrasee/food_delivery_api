// External Dependencies
import * as Mongoose from "mongoose";

let database: Mongoose.Connection;
export const connect = () => {
    // add your own uri below
    if (database) {
        return;
    }

    Mongoose.connect(process.env.DB_CONN_STRING);

    database = Mongoose.connection;
    database.once("open", async () => {
        console.log("Connected to database");
    });
    database.on("error", () => {
        console.log("Error connecting to database");
    });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};