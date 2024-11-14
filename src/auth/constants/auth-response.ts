export type UserInfo = {
  id: string;
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type SignInResponse = {
  user: UserInfo;
  tokens: Tokens;
};

export type SignUpResponse = SignInResponse;

export type RefreshTokensResponse = SignInResponse;
