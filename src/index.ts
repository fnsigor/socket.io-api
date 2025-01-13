import dotenv from "dotenv";
import express from "express";
import App from "./app";
import router from "./routes";
import { sequelize } from "./config/database";

dotenv.config();


const app = App.getInstance()

app.expressInstance.use(express.json());
app.expressInstance.use("/", router);


sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

  


app.server.listen(process.env.PORT, () => {
  console.log("server na porta " + process.env.PORT)
})
