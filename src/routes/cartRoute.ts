import express, { type Request, type Response } from "express";
import { getActiveCartForUser, addItemToCart } from "../services/cartService.ts";
import validateJWT from "../middlewares/validateJWT.ts";

const router = express.Router();

// Helper to get userId either from JWT middleware or body (fallback)
function extractUserId(req: Request): string | undefined {
  // e.g., validateJWT may set req.user = { id: "..." }
  // @ts-ignore - depends on your middleware typing
  return req.user?.id ?? (req.body?.userId as string | undefined);
}

router.get("/", validateJWT, async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) return res.status(400).send({ message: "userId is required" });

    const cart = await getActiveCartForUser({ userId });
    return res.status(200).send(cart);
  } catch (err: any) {
    return res.status(500).send({ message: err?.message ?? "Failed to fetch cart" });
  }
});

router.post("/items", validateJWT, async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) return res.status(400).send({ message: "userId is required" });

    const { productId, quantity } = req.body ?? {};
    if (!productId) return res.status(400).send({ message: "productId is required" });

    const qtyNum = Number(quantity ?? 1);
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      return res.status(400).send({ message: "quantity must be a positive integer" });
    }

    const result = await addItemToCart({ userId, productId, quantity: qtyNum });
    return res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    return res.status(500).send({ message: err?.message ?? "Failed to add item to cart" });
  }
});

export default router;
