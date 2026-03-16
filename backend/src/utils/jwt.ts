import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../models/types";

type Payload = {
  id: string;
  email: string;
  role: Role;
};

export function signToken(payload: Payload) {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as Payload;
}
