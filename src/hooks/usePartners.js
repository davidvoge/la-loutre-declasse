import { useEffect, useState } from 'react';
import { FALLBACK_PARTNERS } from '../data/festival';
import { fetchPartners } from '../lib/sanity';

export function usePartners() {
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPartners()
      .then((items) => {
        if (cancelled) return;
        if (items?.length) setPartners(items);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { partners, loading };
}
