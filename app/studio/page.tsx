"use client"
import { useImage } from "@/context/ImageContext";
import { useRouter } from "next/router";

export default function Studio() {

  const router = useRouter();
  const imageContext = useImage();
  if (!imageContext.image) {
    console.log('No image')
    router.push('/v2')
    return null
  }

  return (
    <main className="flex md:flex-row flex-col h-screen">

    </main>
  );
}
