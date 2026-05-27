import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

export class AuthService {
  async register(name: string, email: string, password: string) {
    if (!name?.trim() || !email?.trim() || !password) {
      throw new AppError(400, "Name, email and password are required");
    }

    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, "Email already registered");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: passwordHash,
        role: Role.USER,
      },
      select: userSelect,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(email: string, password: string) {
    if (!email?.trim() || !password) {
      throw new AppError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }
}

export const authService = new AuthService();
