import Store from "electron-store";

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface StoreSchema {
  tokens: TokenData;
}

class AuthStorage {
  private store: Store<StoreSchema>;

  constructor() {
    this.store = new Store<StoreSchema>({
      name: "note-term-auth",
      clearInvalidConfig: true,
      encryptionKey: "note-term-auth-key",
    });
  }

  setTokens(tokens: TokenData) {
    (this.store as any).set("tokens", tokens);
  }

  getTokens(): TokenData | undefined {
    return (this.store as any).get("tokens");
  }

  clearTokens() {
    (this.store as any).delete("tokens");
  }
}

export const authStorage = new AuthStorage();
