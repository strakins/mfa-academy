import { getRandomWorkImages } from "@/lib/getRandomWorksImages";
import HomePageClient from "@/components/HomePageClients";

export const dynamic = "force-dynamic"; // never cache — fresh images every load
export const revalidate = 0;

export default async function HomePage() {
  // Fetch 12 random images from DB on every request
  const images = await getRandomWorkImages(12);

  // Fallback to static asset only if DB is empty
  const heroImage = images[0] ?? "/mfa_studio.jpeg";
  const galleryImages = images.length > 1 ? images.slice(1) : [];

  return <HomePageClient heroImage={heroImage} galleryImages={galleryImages} />;
}
