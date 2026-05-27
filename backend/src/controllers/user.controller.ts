import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { parseId } from "../utils/parseId";

export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.findAll();
  res.json(users);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const { name, email, role, password } = req.body;

  const user = await userService.update(id, {
    name,
    email,
    role: role as Role | undefined,
    password,
  });
  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required");
  }

  const id = parseId(req.params.id);
  await userService.delete(id, req.user.id);
  res.status(204).send();
});
