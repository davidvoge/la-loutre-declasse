import { useEffect, useState } from 'react';
import { FALLBACK_LINEUP } from '../data/festival';
import { fetchArtists } from '../lib/sanity';

export function useArtists() {
  const [lineup, setLineup] = useState(FALLBACK_LINEUP);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('fallback');

  useEffect(() => {
    let cancelled = false;

    fetchArtists()
      .then((artists) => {
        if (cancelled) return;
        if (artists?.length) {
          setLineup(artists);
          setSource('sanity');
        }
      })
      .catch(() => {
        if (!cancelled) setSource('fallback');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { lineup, loading, source };
}
