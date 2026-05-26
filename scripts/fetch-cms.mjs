import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputPath = join(rootDir, 'src/generated/cms.json');

const projectId = process.env.SANITY_PROJECT_ID || 'xi6lv7h9';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

const client = createClient({
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

const ARTISTS_QUERY = `*[_type == "artist"] {
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

const PARTNERS_QUERY = `*[_type == "partner"] | order(order asc, name asc) {
  "id": slug.current,
  name,
  logo,
  logoUrl,
  url
}`;

async function fetchArtists() {
  const artists = await client.fetch(ARTISTS_QUERY);
  return artists.map(({ photo, photoUrl, ...artist }) => ({
    ...artist,
    img: resolveImage(photo, photoUrl),
  }));
}

async function fetchPartners() {
  const partners = await client.fetch(PARTNERS_QUERY);
  return partners.map(({ logo, logoUrl, ...partner }) => ({
    ...partner,
    logo: resolveImage(logo, logoUrl),
  }));
}

async function main() {
  console.log(`Fetching Sanity CMS (${projectId}/${dataset})…`);

  const [artists, partners] = await Promise.all([fetchArtists(), fetchPartners()]);

  const payload = {
    fetchedAt: new Date().toISOString(),
    artists,
    partners,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${artists.length} artists and ${partners.length} partners to src/generated/cms.json`);
}

main().catch((error) => {
  console.error('Failed to fetch Sanity CMS:', error);
  process.exit(1);
});
