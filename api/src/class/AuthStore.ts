import fs from 'fs';
import path from 'path';

const authFilePath = path.join(process.cwd(), 'data', 'auth.data');

export default class AuthStore {
  access_token: string | null;
  expires_at: number | null;
  refresh_token: string | null;

  constructor(
    access_token: string | null = null,
    expires_at: number | null = null,
    refresh_token: string | null = null,
  ) {
    this.access_token = access_token;
    this.expires_at = expires_at;
    this.refresh_token = refresh_token;
  }

  existsDataFolder(): boolean {
    return fs.existsSync(this.getFolderPath());
  }

  getFolderPath(): string {
    return path.dirname(authFilePath);
  }

  save(): void {
    if (!this.existsDataFolder()) {
      fs.mkdirSync(this.getFolderPath(), {
        recursive: true
      });
    }

    try {
      const data = {
        access_token: this.access_token,
        expires_at: this.expires_at,
        refresh_token: this.refresh_token,
      };

      fs.writeFileSync(authFilePath, JSON.stringify(data));
    } catch (ex) {
      console.error('Error saving auth data:', ex);
    }
  }

  refresh(data: any): void {
    if (data !== null) {
      this.access_token = data.access_token;

      if ('refresh_token' in data) {
        this.refresh_token = data.refresh_token;
      }

      this.expires_at = (Date.now() / 1000 + data.expires_in).toString();
    } else {
      this.access_token = null;
      this.refresh_token = null;
      this.expires_at = null;
    }

    this.save();
  }

  loadFromRaw(raw: any): void {
    if (raw === null) {
      return;
    }

    this.access_token = raw.access_token;
    this.refresh_token = raw.refresh_token;
    this.expires_at = raw.expires_at;
  }

  load(): void {
    if (!this.existsDataFolder()) {
      fs.mkdirSync(this.getFolderPath(),
      {
        recursive: true
      });
    }

    if (!fs.existsSync(authFilePath)) {
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(authFilePath, 'utf8');

        if (raw !== '') {
          const data = JSON.parse(raw);
          this.loadFromRaw(data);
        }
      } catch (ex) {
        console.error('Error during reading auth data:', ex);
      }
    }
  }
}
