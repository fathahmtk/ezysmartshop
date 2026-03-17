import { AnnouncementBar } from "@/components/announcement-bar";
import { BestProductsShowcase } from "@/components/best-products-showcase";
import { FastCheckoutBanner } from "@/components/fast-checkout-banner";
import { HeroBanner } from "@/components/hero-banner";
import { FeatureSpotlight } from "@/components/feature-spotlight";
import { TrustStrip } from "@/components/trust-strip";
import { TrustElements } from "@/components/trust-elements";
import { ValuePromise } from "@/components/value-promise";
import { CategoryGrid } from "@/components/category-grid";
import { Newsletter } from "@/components/newsletter";
import { ProductSection } from "@/components/product-section";
import { Testimonials } from "@/components/testimonials";
import { getCategories, getFeaturedProducts, getFlashDeals, getTestimonials } from "@/utils/api";

export default async function HomePage() {
  const [categories, testimonials] = await Promise.all([getCategories(), Promise.resolve(getTestimonials())]);
  const bestProducts = getFeaturedProducts();

  return (
    <>
      <AnnouncementBar />
      <HeroBanner />
      <ValuePromise />
      <TrustStrip />
      <BestProductsShowcase products={bestProducts} />
      <TrustElements />
      <CategoryGrid categories={categories} />
      <ProductSection
        eyebrow="Best products section"
        title="Practical winners that can carry a lean store to repeat monthly sales."
        copy="This section is tuned for the products most likely to convert mobile traffic with clear value, visible discounts, and simple purchase choices."
        products={bestProducts}
      />
      <ProductSection
        eyebrow="Flash deals"
        title="Urgency blocks tuned for promotional conversion."
        copy="Timed discounts, sharper hierarchy, and clearer offers make these products easier to buy on mobile."
        products={getFlashDeals()}
      />
      <FeatureSpotlight />
      <Testimonials testimonials={testimonials} />
      <FastCheckoutBanner />
      <Newsletter />
    </>
  );
}
