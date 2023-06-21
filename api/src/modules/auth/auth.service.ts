import { Inject, Injectable } from "@nestjs/common";
import AuthStore from "src/class/AuthStore";
import { OauthService } from "src/oauth/oauth.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  private authData: AuthStore;

  constructor(
    @Inject(OauthService)
    private readonly oauthService: OauthService,
    @Inject(UsersService)
    private readonly usersService: UsersService
  ) {
    this.authData = new AuthStore();
    this.authData.load();
  }

  private tokenExpired(): boolean {
    this.authData.load();
    if (
      this.authData.access_token !== undefined &&
      this.authData.expires_at !== undefined
    ) {
      return Date.now() > this.authData.expires_at;
    }
    return false;
  }

  async tryRefreshAuthData(): Promise<boolean> {
    this.authData.load();
    const resp = await this.oauthService.requestAccessTokenByRefreshToken(
      this.authData.refresh_token
    );

    if (resp.status === 200) {
      const data = resp.data;
      this.authData.refresh(data);
      return true;
    }

    console.log("Auth data invalidated, cleaning!");
    this.authData.refresh(null);
    return false;
  }

  async validateAuthData(): Promise<any | false> {
    this.authData.load();
    if (this.authData.refresh_token) {
      if (this.tokenExpired() && !(await this.tryRefreshAuthData())) {
        return false;
      }
      const resp = await this.usersService.getCurrentUser(
        this.authData.access_token
      );

      if (resp.status === 200) {
        return resp.data;
      }

      this.authData.refresh(null);
      return false;
    }
  }

  isLoggedIn(): boolean {
    this.authData.load();
    const auth = this.authData;

    return auth.access_token !== undefined && auth.refresh_token !== undefined;
  }

  async login(code: string): Promise<boolean> {
    this.authData.load();
    const resp = await this.oauthService.requestAccessToken(code);

    if (resp.status === 200) {
      const data = resp.data;
      console.log(data);
      this.authData.refresh(data);
      return true;
    }

    return false;
  }

  async logout(): Promise<boolean> {
    this.authData.load();
    if (this.isLoggedIn()) {
      this.authData.refresh(null);
      return true;
    }

    return false;
  }

  async getValidAccessToken(): Promise<string | null> {
    this.authData.load();
    if (!this.tokenExpired()) {
      return this.authData.access_token;
    }

    if (!(await this.tryRefreshAuthData())) {
      return null;
    }

    return this.authData.access_token;
  }
}
