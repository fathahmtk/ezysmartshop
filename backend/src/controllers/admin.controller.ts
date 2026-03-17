import { Request, Response } from "express";
import { AppContainer } from "../application/container";

export function createAdminController(container: AppContainer) {
  const { analyticsService, couponService } = container.services;
  const { orderRepository, productRepository, userRepository } = container.repositories;

  return {
    dashboard: async (_req: Request, res: Response) => {
      const snapshot = await analyticsService.getAdminSnapshot();
      return res.json(snapshot);
    },

    customers: async (_req: Request, res: Response) => {
      return res.json(await userRepository.listPublic());
    },

    inventory: async (_req: Request, res: Response) => {
      return res.json(await productRepository.listInventory());
    },

    orderReport: async (_req: Request, res: Response) => {
      return res.json(await orderRepository.listAll());
    },

    couponList: async (_req: Request, res: Response) => {
      return res.json(await couponService.list());
    }
  };
}

