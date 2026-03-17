import { CouponRepository } from "../domain/repositories";
import { AppError } from "../utils/app-error";

type CouponServiceDependencies = {
  couponRepository: CouponRepository;
};

export class CouponService {
  constructor(private readonly dependencies: CouponServiceDependencies) {}

  async list() {
    return this.dependencies.couponRepository.list();
  }

  async getValidCoupon(code?: string) {
    if (!code) return null;

    const coupon = await this.dependencies.couponRepository.findByCode(code);
    if (!coupon) {
      throw new AppError("Coupon not found", 404);
    }

    if (new Date(coupon.expiry).getTime() < Date.now()) {
      throw new AppError("Coupon has expired", 400);
    }

    return coupon;
  }
}

