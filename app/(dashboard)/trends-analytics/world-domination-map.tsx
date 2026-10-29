"use client";

import React, { useMemo, useState, useRef } from "react";
import worldMapData from "@svg-maps/world";
import { formatCurrency } from "@/lib/utils";
import { Music2, Download, DollarSign } from "lucide-react";

interface WorldDominationMapProps {
  countries?: AnalyticsCountryItem[];
  totals?: {
    streams: number;
    downloads: number;
    revenue: number;
    currency: string;
  };
  className?: string;
}

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

interface HoverState {
  country: AnalyticsCountryItem;
  x: number;
  y: number;
}

/**
 * Converts a 2-letter ISO country code into a regional indicator flag emoji.
 */
function getCountryFlag(isoCode: string): string {
  if (!isoCode || isoCode.length !== 2) return "🌐";
  return isoCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
}

export default function WorldDominationMap({
  countries = [],
  totals,
  className = "",
}: WorldDominationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<HoverState | null>(null);

  // Map active countries by lowercase 2-letter ISO code
  const countryMap = useMemo(() => {
    const map = new Map<string, AnalyticsCountryItem>();
    countries.forEach((item) => {
      if (item.code) {
        map.set(item.code.toLowerCase().trim(), item);
      }
    });
    return map;
  }, [countries]);

  // Determine max share for proportional opacity scaling
  const maxShare = useMemo(() => {
    if (countries.length === 0) return 100;
    const highest = Math.max(...countries.map((c) => c.share || 0));
    return highest > 0 ? highest : 100;
  }, [countries]);

  const currency = totals?.currency || "GBP";

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, country: AnalyticsCountryItem) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHoverState({
      country,
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setHoverState(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-30 bg-white p-4 md:p-8 overflow-hidden flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* SVG World Map */}
      <div className="w-full relative flex items-center justify-center">
        <svg
          viewBox={worldMapData.viewBox}
          className="w-full h-auto max-h-160 drop-shadow-sm"
          aria-label={worldMapData.label}
        >
          <g>
            {(worldMapData.locations as MapLocation[]).map((loc) => {
              const country = countryMap.get(loc.id.toLowerCase());
              const isActive = Boolean(country);
              const isHovered = hoverState?.country.code.toLowerCase() === loc.id.toLowerCase();

              // Scaling opacity between 0.25 and 1.0 based on country share
              let fill = "#E5E7EB";
              let stroke = "#FFFFFF";
              let strokeWidth = 0.5;

              if (country) {
                const ratio = Math.min(1, Math.max(0, country.share / maxShare));
                const opacity = 0.25 + ratio * 0.75;

                fill = isHovered ? "#00F2EA" : `rgba(0, 242, 234, ${opacity.toFixed(2)})`;
                stroke = isHovered ? "#FFFFFF" : "rgba(0, 200, 194, 0.9)";
                strokeWidth = isHovered ? 1.5 : 0.75;
              }

              return (
                <path
                  key={loc.id}
                  id={loc.id}
                  d={loc.path}
                  name={loc.name}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  className={`transition-colors duration-150 ${
                    isActive ? "cursor-pointer hover:brightness-110" : "pointer-events-none"
                  }`}
                  onMouseMove={isActive && country ? (e) => handleMouseMove(e, country) : undefined}
                  onMouseEnter={
                    isActive && country ? (e) => handleMouseMove(e, country) : undefined
                  }
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip Card */}
        {hoverState && (
          <div
            className="pointer-events-none absolute z-40 transform -translate-x-1/2 -translate-y-full transition-transform duration-75 ease-out"
            style={{
              left: `${hoverState.x}px`,
              top: `${hoverState.y - 14}px`,
            }}
          >
            <div className="bg-[#0B1528]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-white/10 min-w-52.5 flex flex-col gap-3">
              {/* Country Header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">
                    {getCountryFlag(hoverState.country.code)}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-tight text-white">
                      {hoverState.country.name}
                    </span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-mono">
                      {hoverState.country.code}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00F2EA]/20 text-[#00F2EA] border border-[#00F2EA]/30">
                  {hoverState.country.share}%
                </span>
              </div>

              {/* Country Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col gap-0.5 p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-white/50 flex items-center gap-1 font-medium">
                    <Music2 size={11} className="text-[#00F2EA]" /> Streams
                  </span>
                  <span className="font-medium text-white text-xs">
                    {(hoverState.country.streams ?? 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-white/50 flex items-center gap-1 font-medium">
                    <Download size={11} className="text-[#00F2EA]" /> Downloads
                  </span>
                  <span className="font-medium text-white text-xs">
                    {(hoverState.country.downloads ?? 0).toLocaleString()}
                  </span>
                </div>

                <div className="col-span-2 flex flex-col gap-0.5 p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-white/50 flex items-center gap-1 font-medium">
                    <DollarSign size={11} className="text-[#00F2EA]" /> Revenue
                  </span>
                  <span className="font-semibold text-white text-xs">
                    {formatCurrency(hoverState.country.revenue ?? 0, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
