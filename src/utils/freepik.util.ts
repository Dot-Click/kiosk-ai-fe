/**
 * FreePik API Utility Functions
 * For searching and fetching additional styles/images
 */

export interface FreePikStyle {
  id: string;
  title: string;
  description: string;
  previewUrl?: string;
  downloadUrl?: string;
}

export const additionalStyles: FreePikStyle[] = [
  {
    id: "dramatic-retro-chic",
    title: "Dramatic Retro Chic",
    description: "Bold retro aesthetic with dramatic flair",
    previewUrl: "/additionalstyle/DramaticRetroChic.svg",
  },
  {
    id: "gritty-elegance",
    title: "Gritty Elegance",
    description: "Raw elegance with gritty textures",
    previewUrl: "/additionalstyle/GrittyElegance1.svg",
  },
  {
    id: "mystical-twilight-enchantment",
    title: "Mystical Twilight Enchantment",
    description: "Magical twilight atmosphere with enchanting vibes",
    previewUrl: "/additionalstyle/MysticalTwilightEnchantment1.svg",
  },
  {
    id: "shimmering-elegance",
    title: "Shimmering Elegance",
    description: "Elegant style with shimmering effects",
    previewUrl: "/additionalstyle/ShimmeringElegance.svg",
  },
  {
    id: "stone-portraiture",
    title: "Stone Portraiture",
    description: "Classic stone sculpture portrait style",
    previewUrl: "/additionalstyle/StonePortraiture.svg",
  },
  {
    id: "geometric-pop-classics",
    title: "Geometric Pop Classics",
    description: "Bold geometric shapes with pop art influence",
    previewUrl: "/additionalstyle/GeometricPopClassics.svg",
  },
  {
    id: "silhouette-pop",
    title: "Silhouette Pop",
    description: "Striking silhouette with pop art elements",
    previewUrl: "/additionalstyle/SilhouettePop.svg",
  },
  {
    id: "gritty-elegance2",
    title: "Gritty Elegance",
    description: "Raw elegance with gritty textures",
    previewUrl: "/additionalstyle/GrittyElegance.svg",
  },
  {
    id: "pastoral-primitives",
    title: "Pastoral Primitives",
    description: "Rustic primitive style with pastoral themes",
    previewUrl: "/additionalstyle/PastoralPrimitives.svg",
  },
  {
    id: "ethereal-nature-glow",
    title: "Ethereal Nature Glow",
    description: "Natural elements with ethereal glowing effects",
    previewUrl: "/additionalstyle/EtherealNatureGlow.svg",
  },
  {
    id: "introspective-realism",
    title: "Introspective Realism",
    description: "Thoughtful realistic portrait style",
    previewUrl: "/additionalstyle/IntrospectiveRealism.svg",
  },
  {
    id: "modern-tribal-pop",
    title: "Modern Tribal Pop",
    description: "Contemporary tribal patterns with pop aesthetics",
    previewUrl: "/additionalstyle/ModernTribalPop.svg",
  },
  {
    id: "gritty-elegance3",
    title: "Gritty Elegance",
    description: "Raw elegance with gritty textures",
    previewUrl: "/additionalstyle/GrittyElegance3.svg",
  },
  {
    id: "mystical-twilight-enchantment2",
    title: "Mystical Twilight Enchantment",
    description: "Magical twilight atmosphere with enchanting vibes",
    previewUrl: "/additionalstyle/MysticalTwilightEnchantment.svg",
  },
  {
    id: "shimmering-elegance2",
    title: "Shimmering Elegance",
    description: "Elegant style with shimmering effects",
    previewUrl: "/additionalstyle/ShimmeringElegance2.svg",
  },
  {
    id: "stone-portraiture2",
    title: "Stone Portraiture",
    description: "Classic stone sculpture portrait style",
    previewUrl: "/additionalstyle/StonePortraiture2.svg",
  },
  {
    id: "geometric-pop-classics2",
    title: "Geometric Pop Classics",
    description: "Bold geometric shapes with pop art influence",
    previewUrl: "/additionalstyle/GeometricPopClassics2.svg",
  },
];

/**
 * Search FreePik API for styles (if API key is available)
 */
export const searchFreePikStyles = async (
  query: string,
  apiKey?: string
): Promise<FreePikStyle[]> => {
  if (!apiKey) {
    console.warn("FreePik API key not provided");
    return [];
  }

  try {
    // FreePik API endpoint (example - verify actual endpoint from FreePik docs)
    const response = await fetch(
      `https://api.freepik.com/v1/search?q=${encodeURIComponent(
        query
      )}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`FreePik API error: ${response.status}`);
    }

    const data = await response.json();
    // Map FreePik API response to our style format
    // Adjust based on actual FreePik API response structure
    return (
      data.data?.map((item: any) => ({
        id: item.id || item.attributes?.id,
        title: item.attributes?.title || query,
        description: item.attributes?.description || "",
        previewUrl: item.attributes?.preview?.url,
        downloadUrl: item.attributes?.download?.url,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching FreePik styles:", error);
    return [];
  }
};

/**
 * Get FreePik API key from environment
 */
export const getFreePikApiKey = (): string | undefined => {
  return import.meta.env.VITE_FREEPIK_API_KEY;
};
