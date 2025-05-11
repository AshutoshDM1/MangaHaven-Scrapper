import express from "express";
import webscrapperRoute from "./routes/webscrapper.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/webscrapper", webscrapperRoute);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to webscrapper api of MangaHaven",
    version: "1.0.0",
    author: "AshutoshDM1",
    contact: "https://github.com/AshutoshDM1/MangaHaven-Scrapper",
  });
});
app.listen(5000, () => {
  console.log(`Server is running on port http://localhost:${5000}`);
});
