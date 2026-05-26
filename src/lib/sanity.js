import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'xi6lv7h9';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const ARTISTS_QUERY = `*[_type == "artist"] {
  "id": slug.current,
  name,
  day,
  genre,
  size,
  "desc": shortDescription,
  "long": description,
  "img": coalesce(photo.asset->url, photoUrl),
  time,
  "url": coalesce(externalUrl, "#"),
  urlLabel
}`;

export async function fetchArtists() {
  return sanityClient.fetch(ARTISTS_QUERY);
}

export const PARTNERS_QUERY = `*[_type == "partner"] | order(order asc, name asc) {
  "id": slug.current,
  name,
  "logo": coalesce(logo.asset->url, logoUrl),
  url
}`;

export async function fetchPartners() {
  return sanityClient.fetch(PARTNERS_QUERY);
}
