import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();

const paramId = (req: AuthRequest) =>
  Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

export const getItems = async (req: AuthRequest, res: Response): Promise<void> => {
  const items = await prisma.shoppingItem.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "asc" },
  });
  res.json(items);
};

export const addItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, category } = req.body;
  if (!name) {
    res.status(400).json({ error: "Ürün adı zorunludur" });
    return;
  }
  const item = await prisma.shoppingItem.create({
    data: { userId: req.userId!, name, category: category ?? "Diğer" },
  });
  res.status(201).json(item);
};

export const toggleItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = paramId(req);
  const item = await prisma.shoppingItem.findUnique({ where: { id } });
  if (!item || item.userId !== req.userId) {
    res.status(404).json({ error: "Ürün bulunamadı" });
    return;
  }
  const updated = await prisma.shoppingItem.update({
    where: { id },
    data: { checked: !item.checked },
  });
  res.json(updated);
};

export const deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = paramId(req);
  const item = await prisma.shoppingItem.findUnique({ where: { id } });
  if (!item || item.userId !== req.userId) {
    res.status(404).json({ error: "Ürün bulunamadı" });
    return;
  }
  await prisma.shoppingItem.delete({ where: { id } });
  res.json({ success: true });
};
