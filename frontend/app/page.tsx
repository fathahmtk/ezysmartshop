import { AnnouncementBar } from "@/components/announcement-bar";
import { HeroBanner } from "@/components/hero-banner";
import { FeatureSpotlight } from "@/components/feature-spotlight";
import { TrustStrip } from "@/components/trust-strip";
import { CategoryGrid } from "@/components/category-grid";
import { Newsletter } from "@/components/newsletter";
import { ProductSection } from "@/components/product-section";
import { Testimonials } from "@/components/testimonials";
import { getCategories, getFeaturedProducts, getFlashDeals, getTestimonials } from "@/utils/api";

export default async function HomePage() {
  const [categories, testimonials] = await Promise.all([getCategories(), Promise.resolve(getTestimonials())]);

  return (
    <>
      <AnnouncementBar />
      <HeroBanner />
      <TrustStrip />
      <CategoryGrid categories={categories} />
      <ProductSection
        eyebrow="Trending products"
        title="High-conversion gadgets with practical everyday value."
        copy="Positioned for dropshipping and direct sales with clear merchandising and pricing."
        products={getFeaturedProducts()}
      />
      <ProductSection
        eyebrow="Flash deals"
        title="Urgency blocks for promotional campaigns."
        copy="Use timed promotions and banner placements to increase add-to-cart rates."
        products={getFlashDeals()}
      />
      <FeatureSpotlight />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </>
  );
}
