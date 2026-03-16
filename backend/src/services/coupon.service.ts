import { coupons } from "../data/seed";
import { AppError } from "../utils/app-error";

export class CouponService {
  async list() {
    return coupons;
  }

  async getValidCoupon(code?: string) {
    if (!code) return null;

    const coupon = coupons.find((entry) => entry.code.toLowerCase() === code.toLowerCase());
    if (!coupon) {
      throw new AppError("Coupon not found", 404);
    }

    if (new Date(coupon.expiry).getTime() < Date.now()) {
      throw new AppError("Coupon has expired", 400);
    }

    return coupon;
  }
}

