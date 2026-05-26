import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'xi6lv7h9';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

function buildImageUrl(image, { width = 1400 } = {}) {
  if (!image?.asset?._ref && !image?.asset?._id) return null;
  return imageBuilder.image(image).width(width).auto('format').quality(85).url();
}

function resolveImage(image, fallbackUrl) {
  return buildImageUrl(image) || fallbackUrl || null;
}

export const ARTISTS_QUERY = `*[_type == "artist"] {
  "id": slug.current,
  name,
  day,
  genre,
  size,
  "desc": shortDescription,
  "long": description,
  photo,
  photoUrl,
  time,
  "url": coalesce(externalUrl, "#"),
  urlLabel
}`;

export async function fetchArtists() {
  const artists = await sanityClient.fetch(ARTISTS_QUERY);
  return artists.map(({ photo, photoUrl, ...artist }) => ({
    ...artist,
    img: resolveImage(photo, photoUrl),
  }));
}

export const PARTNERS_QUERY = `*[_type == "partner"] | order(order asc, name asc) {
  "id": slug.current,
  name,
  logo,
  logoUrl,
  url
}`;

export async function fetchPartners() {
  const partners = await sanityClient.fetch(PARTNERS_QUERY);
  return partners.map(({ logo, logoUrl, ...partner }) => ({
    ...partner,
    logo: resolveImage(logo, logoUrl),
  }));
}
