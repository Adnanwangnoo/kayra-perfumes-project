export type GalleryPhoto = {
  src: string;
  alt: string;
};

/**
 * Photos shown on /gallery. Add new ones by dropping the image file into
 * public/gallery/ and adding an entry here — same pattern as product images.
 */
export const galleryPhotos: GalleryPhoto[] = [
  { src: "/gallery/IMG_7746.jpg", alt: "Kayra Perfumes" },
  { src: "/gallery/IMG_7867.JPG.jpeg", alt: "Kayra Perfumes" },
  { src: "/gallery/IMG_7902.jpg", alt: "Kayra Perfumes" },
  { src: "/gallery/IMG_7915.jpg", alt: "Kayra Perfumes" },
  // Yahan aur entries add karo jab jab naya photo daalo
];