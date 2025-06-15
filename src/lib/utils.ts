import * as jose from "jose";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


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

export const jwtDecode = <T = JwtUserPayload>(token: string): T =>
  jose.decodeJwt(token) as T;

export const isExpiredToken = (token: string) => {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp && decodedToken.exp < currentTime;
};


export const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .trim();

export const seconds = (sec: number) => sec * 1000;
