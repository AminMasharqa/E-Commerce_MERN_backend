import express, { Router, type Request, type Response } from "express";
import { 
  getActiveCartForUser, 
  addItemToCart, 
  updateItemInCart, 
  removeItemFromCart,
  clearCart,
  checkoutCart
} from "../services/cartService.ts";
import validateJWT from "../middlewares/validateJWT.ts";
import type { ExtendedRequest } from "../types/extendedRequest.ts";

const router = express.Router();

// Helper to get userId consistently across all routes
function extractUserId(req: Request | ExtendedRequest): string | undefined {
  // First try to get from JWT middleware (ExtendedRequest)
  const extReq = req as ExtendedRequest;
  if (extReq.user?._id) {
    return extReq.user._id.toString();
  }
  
  // Fallback to other possible locations
  // @ts-ignore - depends on your middleware typing
  return req.user?.id ?? (req.body?.userId as string | undefined);
}

// GET /cart - Get user's active cart
router.get("/", validateJWT, async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cart = await getActiveCartForUser({ userId });
    return res.status(200).json(cart);
  } catch (err: any) {
    console.error('Error fetching cart:', err);
    return res.status(500).json({ 
      message: err?.message ?? "Failed to fetch cart" 
    });
  }
});

// POST /cart/items - Add item to cart
router.post("/items", validateJWT, async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const { productId, quantity } = req.body ?? {};
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const qtyNum = Number(quantity ?? 1);
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      return res.status(400).json({ 
        message: "quantity must be a positive integer" 
      });
    }

    const result = await addItemToCart({ userId, productId, quantity: qtyNum });
    return res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    console.error('Error adding item to cart:', err);
    return res.status(500).json({ 
      message: err?.message ?? "Failed to add item to cart" 
    });
  }
});

// PUT /cart/items - Update item quantity in cart
router.put("/items", validateJWT, async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const { productId, quantity } = req.body ?? {};
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const qtyNum = Number(quantity);
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      return res.status(400).json({ 
        message: "quantity must be a positive integer" 
      });
    }

    const response = await updateItemInCart({ 
      userId, 
      productId, 
      quantity: qtyNum 
    });
    
    return res.status(response.statusCode).json(response.data);
  } catch (err: any) {
    console.error('Error updating cart item:', err);
    return res.status(500).json({ 
      message: err?.message ?? "Failed to update cart item" 
    });
  }
});

// DELETE /cart/items/:productId - Remove item from cart
router.delete("/items/:productId", validateJWT, async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const response = await removeItemFromCart({ 
      userId, 
      productId 
    });
    
    return res.status(response.statusCode).json(response.data);
  } catch (err: any) {
    console.error('Error removing cart item:', err);
    return res.status(500).json({ 
      message: err?.message ?? "Failed to remove cart item" 
    });
  }
});

router.delete("/",validateJWT, async(req: ExtendedRequest,res)=> {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const response = await clearCart({userId});
    return res.status(response.statusCode).json(response.data);
  } catch (err: any) {
    console.error('Error clearing cart:', err);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
});

router.post("/checkout",validateJWT, async(req: ExtendedRequest,res)=> {
  const userId = extractUserId(req);
  const {address} = req.body;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  const response = await checkoutCart({userId,address});
  res.status(response.statusCode).json(response.data);
})
export default router;