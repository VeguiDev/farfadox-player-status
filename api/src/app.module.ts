import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import path from "path";

@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "..", "..", "frontend", "dist"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
