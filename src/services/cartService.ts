// If you already have these imports, keep them. Just ensure they're enabled (not commented out).
import cartModel, { /* optional types like ICart, ICartItem */ } from "../models/cartModel.ts";
import productModel from "../models/productModel.ts";

// ----- Types -----
type CreateCartForUserParams = { userId: string };
type GetActiveCartForUserParams = { userId: string };
type AddItemToCartParams = { userId: string; productId: string; quantity: number };
type UpdateItemInCartParams = { productId: any; quantity: number; userId: string };

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

  if (product.stock < quantity) {
    return { data: { message: "Low stock for item" }, statusCode: 400 };
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

export const updateItemInCart = async ({
  productId,
  userId,
  quantity
}: UpdateItemInCartParams): Promise<ServiceResult<any>> => {
  try {
    const cart = await getActiveCartForUser({ userId });

    // Check if item exists in cart
    const existingItem = cart.items.find(
      (p: any) => p.productId?.toString?.() === productId
    );
    
    if (!existingItem) {
      return { data: { message: "Item does not exist in the cart" }, statusCode: 400 };
    }

    // Validate product and stock
    const product = await productModel.findById(productId);
    if (!product) {
      return { data: { message: "Product not found" }, statusCode: 400 };
    }

    if (product.stock < quantity) {
      return { data: { message: "Insufficient stock for requested quantity" }, statusCode: 400 };
    }

    // Update the quantity
    existingItem.quantity = quantity;

    // Recalculate total amount
    cart.totalAmount = computeTotalAmount(cart.items);
    await cart.save();

    return { data: cart, statusCode: 200 };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { data: { message: "Internal server error" }, statusCode: 500 };
  }
};


type RemoveItemFromCartParams = { userId: string; productId: string };

export const removeItemFromCart = async ({
  userId,
  productId,
}: RemoveItemFromCartParams): Promise<ServiceResult<any>> => {
  try {
    const cart = await getActiveCartForUser({ userId });

    // Find item by productId (handle ObjectId vs string)
    const idx = cart.items.findIndex(
      (p: any) => p.productId?.toString?.() === productId
    );

    if (idx === -1) {
      return { data: { message: "Item does not exist in the cart" }, statusCode: 400 };
    }

    // Remove the item
    cart.items.splice(idx, 1);

    // Recalculate cart total and persist
    cart.totalAmount = computeTotalAmount(cart.items);
    await cart.save();

    return { data: cart, statusCode: 200 };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { data: { message: "Internal server error" }, statusCode: 500 };
  }
};


type ClearCartParams = { userId: string };
export const clearCart = async ({ userId }: ClearCartParams): Promise<ServiceResult<any>> => {
  try {
    const cart = await getActiveCartForUser({ userId });
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    return { data: cart, statusCode: 200 };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { data: { message: "Internal server error" }, statusCode: 500 };
  }
};

