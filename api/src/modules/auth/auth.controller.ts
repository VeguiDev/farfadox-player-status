import {
  Controller,
  Get,
  Redirect,
  HttpStatus,
  Query,
  Delete,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { client_id, client_secret, token_scope } from "../../config";
import MessageService from "src/messageService.service";

@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {}

  @Get()
  async getAuthInfo(): Promise<{ user: any | null; logged: boolean }> {
    if (this.authService.isLoggedIn()) {
      const user = await this.authService.validateAuthData();
      if (user !== false) {
        return { user, logged: true };
      }
    }
    return { user: null, logged: false };
  }

  @Get("oauth")
  @Redirect(
    "https://accounts.spotify.com/authorize",
    HttpStatus.MOVED_PERMANENTLY
  )
  redirectToAuthorization() {
    const scope = token_scope;
    const redirectUrl = `http://localhost:8000/api/auth/response`;

    return {
      url: `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirectUrl}&state=state`,
    };
  }

  @Get("response")
  async getAccessToken(
    @Query("state") state: string,
    @Res() res: Response,
    @Query("code") code?: string,
    @Query("error") error?: string
  ) {
    if (error !== undefined) {
      return res.status(400).json({ error });
    }

    const login = await this.authService.login(code);

    if (login) {
      this.messageService.sendMessageToOBS({ type: "SUCCESS_LOGIN" });
      return res.redirect("/success/login");
    }

    res.redirect("/failed/login");
  }

  @Delete("auth")
  async logout(@Res() response: Response) {
    if (await this.authService.logout()) {
      return response.json({
        success: true,
        message: "Successfully logged out!",
      });
    }

    response
      .status(HttpStatus.BAD_REQUEST)
      .json({ success: false, message: "You aren't logged in!" });
  }
}
