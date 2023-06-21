import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import express from "express";
import morgan from "morgan";
import path from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan("dev"));

  // app.use(
  //   "/",
  //   express.static(path.join(__dirname, "..", "..", "frontend", "dist"))
  // );

  await app.listen(8000);
}
bootstrap();
