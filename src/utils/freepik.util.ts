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
    previewUrl: "/additionalstyle/DramaticRetroChic.png",
  },
  {
    id: "gritty-elegance",
    title: "Gritty Elegance",
    description: "Raw elegance with gritty textures",
    previewUrl: "/additionalstyle/GrittyElegance1.png",
  },
  {
    id: "mystical-twilight-enchantment",
    title: "Mystical Twilight Enchantment",
    description: "Magical twilight atmosphere with enchanting vibes",
    previewUrl: "/additionalstyle/Rectangle 69 (1).png",
  },
  {
    id: "shimmering-elegance",
    title: "Shimmering Elegance",
    description: "Elegant style with shimmering effects",
    previewUrl: "/additionalstyle/MysticalTwilightEnchantment1.png",
  },
  {
    id: "stone-portraiture",
    title: "Stone Portraiture",
    description: "Classic stone sculpture portrait style",
    previewUrl: "/additionalstyle/ShimmeringElegance.png",
  },
  {
    id: "geometric-pop-classics",
    title: "Geometric Pop Classics",
    description: "Bold geometric shapes with pop art influence",
    previewUrl: "/additionalstyle/StonePortraiture.png",
  },
  {
    id: "silhouette-pop",
    title: "Silhouette Pop",
    description: "Striking silhouette with pop art elements",
    previewUrl: "/additionalstyle/GeometricPopClassics.png",
  },
  {
    id: "gritty-elegance2",
    title: "Gritty Elegance",
    description: "Raw elegance with gritty textures",
    previewUrl: "/additionalstyle/GrittyElegance.png",
  },
  {
    id: "pastoral-primitives",
    title: "Pastoral Primitives",
    description: "Rustic primitive style with pastoral themes",
    previewUrl: "/additionalstyle/EtherealNatureGlow.png",
  },
  {
    id: "ethereal-nature-glow",
    title: "Ethereal Nature Glow",
    description: "Natural elements with ethereal glowing effects",
    previewUrl: "/additionalstyle/EtherealNatureGlow1.png",
  },
  {
    id: "introspective-realism",
    title: "Introspective Realism",
    description: "Thoughtful realistic portrait style",
    previewUrl: "/additionalstyle/Rectangle 71.png",
  },
  {
    id: "modern-tribal-pop",
    title: "Modern Tribal Pop",
    description: "Contemporary tribal patterns with pop aesthetics",
    previewUrl: "/additionalstyle/Rectangle 73.png",
  },
  {
    id: "gritty-elegance3",
    title: "Gritty Elegance",
    description: "Raw elegance with gritty textures",
    previewUrl: "/additionalstyle/Rectangle 68 (2).png",
  },
  {
    id: "mystical-twilight-enchantment2",
    title: "Mystical Twilight Enchantment",
    description: "Magical twilight atmosphere with enchanting vibes",
    previewUrl: "/additionalstyle/Rectangle 72 (2).png",
  },
  {
    id: "shimmering-elegance2",
    title: "Shimmering Elegance",
    description: "Elegant style with shimmering effects",
    previewUrl: "/additionalstyle/Rectangle 69 (3).png",
  },
  {
    id: "stone-portraiture2",
    title: "Stone Portraiture",
    description: "Classic stone sculpture portrait style",
    previewUrl: "/additionalstyle/Rectangle 70 (5).png",
  },
  {
    id: "geometric-pop-classics2",
    title: "Geometric Pop Classics",
    description: "Bold geometric shapes with pop art influence",
    previewUrl: "/additionalstyle/Rectangle 71 (3).png",
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
