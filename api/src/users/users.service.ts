import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class UsersService {
  private apiEndpoint = "https://api.spotify.com/v1";

  async getCurrentUser(access_token: string) {
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${this.apiEndpoint}/me`, { headers });

    return response;
  }

  async getPlayerStatus(access_token: string) {
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${this.apiEndpoint}/me/player`, {
      headers,
    });

    return response;
  }
}
