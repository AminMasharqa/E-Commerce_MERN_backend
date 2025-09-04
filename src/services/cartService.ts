// If you already have these imports, keep them. Just ensure they're enabled (not commented out).
import cartModel, { /* optional types like ICart, ICartItem */ } from "../models/cartModel.ts";
import productModel from "../models/productModel.ts";

// ----- Types -----
type CreateCartForUserParams = { userId: string };
type GetActiveCartForUserParams = { userId: string };
type AddItemToCartParams = { userId: string; productId: string; quantity: number };

type ServiceResult<T> = { data: T; statusCode: number };

// ----- Helpers -----
function computeTotalAmount(items: Array<{ unitPrice: number; quantity: number }>): number {
  return items.reduce((sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 0), 0);
}

// ----- Core -----
const createCartForUser = async ({ userId }: CreateCartForUserParams) => {
  const cart = await cartModel.create({
    userId,
    items: [],
    totalAmount: 0,
    status: "active",
  });
  await cart.save();
  return cart;
};

export const getActiveCartForUser = async ({ userId }: GetActiveCartForUserParams) => {
  if (!userId) throw new Error("userId is required");
  let cart = await cartModel.findOne({ userId, status: "active" });
  if (!cart) cart = await createCartForUser({ userId });
  return cart;
};

export const addItemToCart = async ({
  userId,
  productId,
  quantity,
}: AddItemToCartParams): Promise<ServiceResult<any>> => {
  // Ensure we have a cart
  const cart = await getActiveCartForUser({ userId });

  // Check if already in cart
  const existsInCart = cart.items.find(
    (p: any) => p.productId?.toString?.() === productId
  );
  if (existsInCart) {
    return { data: { message: "Item already exists in the cart" }, statusCode: 400 };
  }

  // Validate product
  const product = await productModel.findById(productId);
  if (!product) {
    return { data: { message: "Product not found" }, statusCode: 400 };
  }

  if(product.stock < quantity){
    return {data: "Low stock for item", statusCode: 400};
  }


  // Push new item (Mongoose will cast string to ObjectId if schema is set)
  cart.items.push({
    productId: product._id as any,
    unitPrice: product.price,
    quantity,
  } as any);

  // Update totalAmount
  cart.totalAmount = computeTotalAmount(cart.items);
  await cart.save();

  return { data: cart, statusCode: 200 };
};
