import { Controller, Get, HttpStatus, Inject, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { UsersService } from "./users/users.service";
import { AuthService } from "./modules/auth/auth.service";
import fs from "fs";
import path from "path";

@Controller()
export class AppController {
  constructor(
    private readonly users: UsersService,
    private readonly authService: AuthService
  ) {}

  @Get("/api/status")
  async getStatus(@Res() response: Response) {
    const accessToken = await this.authService.getValidAccessToken();

    if (!accessToken) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "not_logged", message: "You aren't logged in!" });
    }

    const resp = await this.users.getPlayerStatus(accessToken);

    if (resp.status === 200) {
      return response.json(resp.data);
    }

    if (resp.status === 204) {
      return response.json({ status: "not_playing" });
    }

    response.json({
      error: "error_obtaining_player_status",
      message: "Exception occurred when trying to obtain player status!",
    });
  }
}
