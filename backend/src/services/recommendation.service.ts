import { products } from "../data/seed";

export class RecommendationService {
  private fallbackRecommendations(productId?: string) {
    if (!productId) return products.slice(0, 4);
    const current = products.find((product) => product.id === productId);
    if (!current) return products.slice(0, 4);
    return products.filter((product) => product.category === current.category && product.id !== current.id).slice(0, 4);
  }

  async getRecommendations(productId?: string) {
    if (!process.env.GEMINI_API_KEY) {
      return this.fallbackRecommendations(productId);
    }

    try {
      const subject = products.find((product) => product.id === productId);
      const prompt = `Return a JSON array of up to 4 product ids from this catalog that best match the current shopper intent. Current product: ${
        subject ? `${subject.title} in ${subject.category}` : "homepage visitor"
      }. Catalog: ${products.map((product) => `${product.id}:${product.title}:${product.category}`).join(" | ")}`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        return this.fallbackRecommendations(productId);
      }

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return this.fallbackRecommendations(productId);

      const ids = JSON.parse(text) as string[];
      const recommended = ids
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is (typeof products)[number] => Boolean(product))
        .slice(0, 4);

      return recommended.length ? recommended : this.fallbackRecommendations(productId);
    } catch {
      return this.fallbackRecommendations(productId);
    }
  }
}
