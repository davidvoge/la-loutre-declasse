import cms from '../generated/cms.json';
import { FALLBACK_PARTNERS } from '../data/festival';

export function usePartners() {
  const partners = cms.partners?.length ? cms.partners : FALLBACK_PARTNERS;
  return { partners };
}
