import { Injectable } from "@nestjs/common";
import axios from "axios";
import { client_id, client_secret } from "../config";

@Injectable()
export class OauthService {
  private apiEndpoint = "https://accounts.spotify.com/api/token";

  async requestAccessToken(code: string) {
    const headers = {
      accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const payload = {
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:8000/api/auth/response",
    };

    const response = await axios({
      url: this.apiEndpoint,
      data: payload,
      headers: headers,
      method: "POST",
    });

    return response;
  }

  async requestAccessTokenByRefreshToken(refresh_token: string) {
    const headers = {
      accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const payload = {
      grant_type: "refresh_token",
      refresh_token,
      redirect_uri: "http://localhost:8000/auth/response",
    };

    const response = await axios({
      url: this.apiEndpoint,
      data: payload,
      headers: headers,
      method: "POST",
    });

    return response;
  }
}
