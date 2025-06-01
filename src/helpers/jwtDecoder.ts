import * as jose from "jose";
type Role = "ADMIN" | "REPORTER" | "USER";
export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  verified: boolean;
};

export interface UserJwtPayload extends JwtPayload {
  iat: number;
  exp: number;
}

const jwtDecode = <T = UserJwtPayload>(token: string): T =>
  jose.decodeJwt(token) as T;
export default jwtDecode;
