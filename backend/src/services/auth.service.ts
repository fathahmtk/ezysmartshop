import bcrypt from "bcryptjs";
import { UserRepository } from "../domain/repositories";
import { AppError } from "../utils/app-error";
import { signToken } from "../utils/jwt";
import { env } from "../config/env";

type AuthServiceDependencies = {
  userRepository: UserRepository;
};

const bootstrapCredentials = new Map([
  ["admin@ezysmartshop.com", "Admin@123"],
  ["priya@example.com", "Customer@123"]
]);

export class AuthService {
  constructor(private readonly dependencies: AuthServiceDependencies) {}

  async login(email: string, password: string) {
    const user = await this.dependencies.userRepository.findByEmail(email);
    if (!user) return null;

    if (env.nodeEnv === "production" && bootstrapCredentials.get(user.email) === password) {
      throw new AppError("Bootstrap credentials are disabled in production. Rotate seeded accounts before go-live.", 403);
    }

    const matches =
      (env.demoMode && (password === "Admin@123" || password === "Customer@123")) ||
      (await bcrypt.compare(password, user.password));
    if (!matches) return null;

    return {
      token: signToken({ id: user.id, email: user.email, role: user.role }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(name: string, email: string, password: string) {
    const existing = await this.dependencies.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.dependencies.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: "customer"
    });

    return {
      token: signToken({ id: user.id, email: user.email, role: user.role }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
