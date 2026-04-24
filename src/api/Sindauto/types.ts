// ─── Autenticação ────────────────────────────────────────────────────────────────────

export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  data?: { token?: string };
}