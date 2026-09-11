import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { galleryPhotos } from "@/lib/gallery";

const title = "Gallery — Kayra Perfumes";
const description = "Moments from Kayra Perfumes — events, craft, and community.";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
      <h1 className="display-lg">Gallery</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Moments from Kayra — events, craft, and the people who wear it.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {galleryPhotos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setActive(i)}
            className="aspect-square overflow-hidden bg-muted"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {galleryPhotos.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">Photos coming soon.</p>
      )}

      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setActive(null)}
        >
          <img
            src={galleryPhotos[active].src}
            alt={galleryPhotos[active].alt}
            className="max-h-[85vh] max-w-full object-contain"
          />
          <button
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-6 top-6 text-3xl text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}