import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { hashPassword } from "../utils/password";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: Role;
  password?: string;
}

export class UserService {
  async findAll() {
    return prisma.user.findMany({
      select: userSelect,
      orderBy: { id: "asc" },
    });
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async update(id: number, data: UserUpdateInput) {
    await this.findById(id);

    if (data.email !== undefined) {
      const email = data.email.trim().toLowerCase();
      if (!email) {
        throw new AppError(400, "Email is required");
      }
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (existing) {
        throw new AppError(409, "Email already in use");
      }
    }

    if (data.name !== undefined && !data.name.trim()) {
      throw new AppError(400, "Name is required");
    }

    if (data.role !== undefined && !Object.values(Role).includes(data.role)) {
      throw new AppError(400, "Invalid role");
    }

    if (data.password !== undefined) {
      if (data.password.length < 6) {
        throw new AppError(400, "Password must be at least 6 characters");
      }
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.email !== undefined && {
          email: data.email.trim().toLowerCase(),
        }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.password !== undefined && {
          password: await hashPassword(data.password),
        }),
      },
      select: userSelect,
    });
  }

  async delete(id: number, requesterId: number) {
    if (id === requesterId) {
      throw new AppError(400, "You cannot delete your own account");
    }

    await this.findById(id);
    await prisma.user.delete({ where: { id } });
  }
}

export const userService = new UserService();
