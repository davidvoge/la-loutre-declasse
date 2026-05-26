import cms from '../generated/cms.json';
import { FALLBACK_LINEUP } from '../data/festival';

export function useArtists() {
  const lineup = cms.artists?.length ? cms.artists : FALLBACK_LINEUP;
  return { lineup };
}
