import React, { useState, useEffect } from 'react';
import { WatchProviderResults } from '../types';
import { api } from '../services/api';
import { Tv, ShoppingBag, CreditCard, Globe } from 'lucide-react';

interface StreamingProvidersProps {
  movieId: number;
  initialRegion?: string;
  className?: string;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' }
];

export const StreamingProviders: React.FC<StreamingProvidersProps> = ({
  movieId,
  initialRegion = 'US',
  className = ''
}) => {
  const [region, setRegion] = useState(initialRegion);
  const [providers, setProviders] = useState<WatchProviderResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getWatchProviders(movieId, region)
      .then(res => {
        if (isMounted) {
          setProviders(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProviders(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movieId, region]);

  const hasStream = providers?.flatrate && providers.flatrate.length > 0;
  const hasRent = providers?.rent && providers.rent.length > 0;
  const hasBuy = providers?.buy && providers.buy.length > 0;
  const hasAny = hasStream || hasRent || hasBuy;

  return (
    <div className={`bg-[#F5F5F7] rounded-2xl p-4 border border-gray-200/60 ${className}`}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/80">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-[#E1121D]" />
          <h4 className="font-semibold text-sm text-[#1D1D1F]">Where to Watch</h4>
        </div>

        {/* Region selector */}
        <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1 border border-gray-200/80 apple-shadow-sm">
          <Globe className="w-3.5 h-3.5 text-[#6E6E73]" />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent text-xs text-[#1D1D1F] font-medium focus:outline-none cursor-pointer"
            id={`region-select-${movieId}`}
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code} className="bg-white text-[#1D1D1F]">
                {c.code} ({c.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-[#E1121D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasAny ? (
        <div className="text-center py-4 text-[#6E6E73] text-xs italic">
          Not currently available to stream, rent, or buy in {region}.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Flatrate / Stream */}
          {hasStream && (
            <div>
              <div className="text-[11px] font-semibold text-[#6E6E73] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <Tv className="w-3 h-3 text-[#E1121D]" />
                <span>Stream Subscription</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {providers?.flatrate?.map(p => (
                  <div key={p.provider_id} className="flex items-center gap-2 bg-white border border-gray-200/80 rounded-xl p-1.5 pr-3 apple-shadow-sm">
                    {p.logo_path ? (
                      <img src={p.logo_path} alt={p.provider_name} className="w-6 h-6 rounded-md object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-red-50 text-[#E1121D] text-[10px] flex items-center justify-center font-bold">
                        {p.provider_name[0]}
                      </div>
                    )}
                    <span className="text-xs font-medium text-[#1D1D1F]">{p.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rent */}
          {hasRent && (
            <div>
              <div className="text-[11px] font-semibold text-[#6E6E73] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <CreditCard className="w-3 h-3 text-[#0071E3]" />
                <span>Rent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {providers?.rent?.map(p => (
                  <div key={p.provider_id} className="flex items-center gap-2 bg-white border border-gray-200/80 rounded-xl p-1.5 pr-3 apple-shadow-sm">
                    {p.logo_path ? (
                      <img src={p.logo_path} alt={p.provider_name} className="w-6 h-6 rounded-md object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0071E3] text-[10px] flex items-center justify-center font-bold">
                        {p.provider_name[0]}
                      </div>
                    )}
                    <span className="text-xs font-medium text-[#1D1D1F]">{p.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buy */}
          {hasBuy && (
            <div>
              <div className="text-[11px] font-semibold text-[#6E6E73] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <ShoppingBag className="w-3 h-3 text-[#34C759]" />
                <span>Buy</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {providers?.buy?.map(p => (
                  <div key={p.provider_id} className="flex items-center gap-2 bg-white border border-gray-200/80 rounded-xl p-1.5 pr-3 apple-shadow-sm">
                    {p.logo_path ? (
                      <img src={p.logo_path} alt={p.provider_name} className="w-6 h-6 rounded-md object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-green-50 text-[#34C759] text-[10px] flex items-center justify-center font-bold">
                        {p.provider_name[0]}
                      </div>
                    )}
                    <span className="text-xs font-medium text-[#1D1D1F]">{p.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
