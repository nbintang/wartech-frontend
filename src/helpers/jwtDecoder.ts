import * as jose from "jose";
type Role = "ADMIN" | "REPORTER" | "READER";
export type JwtPayload = {
  sub?: string;
  email?: string;
  role?: Role;
  verified?: boolean;
};

export interface JwtUserPayload extends JwtPayload {
  iat: number;
  exp: number;
}

const jwtDecode = <T = JwtUserPayload>(token: string): T =>
  jose.decodeJwt(token) as T;
export default jwtDecode;
