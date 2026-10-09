'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Flame,
  Waves,
  Activity,
  ShieldCheck,
  Navigation,
  Layers,
  Maximize2,
  Minimize2,
  Compass,
  Crosshair,
  Satellite,
  Moon,
  Sun,
  Truck,
  ChevronDown,
  X,
  Play,
  Pause,
  RotateCcw,
  Search,
  Sparkles,
  RefreshCw,
  Clock,
  Calendar,
  Radio
} from 'lucide-react';
import { useDisasterStore, TimeHorizon } from '@/lib/store/useDisasterStore';
import { KEY_DISTRICT_PROFILES, MAJOR_NDRF_BATTALIONS } from '@/lib/geo/indiaGeoData';
import { DistrictDrawer } from './DistrictDrawer';
import { tacticalAudio } from '@/lib/audio/tacticalAudio';
import { formatNumber } from '@/lib/utils/formatters';

const BASEMAP_STYLES = {
  satellite: {
    name: 'Satellite Recon',
    icon: Satellite,
    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    attribution: '© Esri, Maxar, ISRO Bhuvan',
  },
  dark: {
    name: 'Tactical Dark',
    icon: Moon,
    tiles: [
      'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ],
    attribution: '© Esri, NASA FIRMS, USGS, ISRO Bhuvan, OpenStreetMap',
  },
  osm: {
    name: 'OpenStreetMap',
    icon: Navigation,
    tiles: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ],
    attribution: '© OpenStreetMap contributors',
  },
  topo: {
    name: 'Terrain Topo',
    icon: Sun,
    tiles: [
      'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    ],
    attribution: '© Esri, USGS, CWC',
  },
};

const CAMERA_PRESETS = [
  { id: 'all-india', name: 'National Overview', label: '🇮🇳 All India', center: [82.0, 22.0] as [number, number], zoom: 4.6, pitch: 20 },
  { id: 'odisha-coast', name: 'Odisha Coast', label: '🌀 Odisha (Cyclone)', center: [85.8312, 19.8135] as [number, number], zoom: 7.8, pitch: 42 },
  { id: 'wayanad-ghats', name: 'Wayanad Ghats', label: '⛰️ Wayanad (Landslide)', center: [76.132, 11.6854] as [number, number], zoom: 8.5, pitch: 48 },
  { id: 'brahmaputra', name: 'Brahmaputra Basin', label: '🌊 Assam (Floods)', center: [93.45, 26.65] as [number, number], zoom: 7.4, pitch: 35 },
  { id: 'simlipal-fire', name: 'Simlipal Reserve', label: '🔥 Simlipal (Fire)', center: [86.3421, 21.7584] as [number, number], zoom: 8.8, pitch: 45 },
  { id: 'uttarakhand', name: 'Chamoli Belt', label: '⚡ Chamoli (Seismic)', center: [79.3245, 30.4125] as [number, number], zoom: 8.2, pitch: 50 },
];

function getCategorySvg(category: string, colorClass: string): string {
  switch (category) {
    case 'FLOOD':
      return `<svg class="h-4 w-4 ${colorClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5-3 5-3 7.5 0 2.5 3 5 3 7.5 0 2.5-3 5-3 7 0"/><path d="M2 17c2.5-3 5-3 7.5 0 2.5 3 5 3 7.5 0 2.5-3 5-3 7 0"/></svg>`;
    case 'WILDFIRE':
      return `<svg class="h-4 w-4 ${colorClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
    case 'CYCLONE':
      return `<svg class="h-4 w-4 ${colorClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10c0 3-1.5 5.5-3.5 7"/><path d="M12 22A10 10 0 0 1 2 12c0-3 1.5-5.5 3.5-7"/></svg>`;
    case 'LANDSLIDE':
      return `<svg class="h-4 w-4 ${colorClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
    case 'EARTHQUAKE':
      return `<svg class="h-4 w-4 ${colorClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h3l3-7 4 14 3-7h7"/></svg>`;
    default:
      return `<svg class="h-4 w-4 ${colorClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }
}

function getIncidentTheme(severity: string) {
  switch (severity) {
    case 'RED':
      return {
        sonar: 'bg-rose-500/25',
        halo: 'bg-rose-500/15',
        border: 'border-rose-500/80',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.45)]',
        badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
        iconColor: 'text-rose-400',
        dot: 'bg-rose-500',
      };
    case 'ORANGE':
      return {
        sonar: 'bg-orange-500/25',
        halo: 'bg-orange-500/15',
        border: 'border-orange-500/80',
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.45)]',
        badge: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
        iconColor: 'text-orange-400',
        dot: 'bg-orange-500',
      };
    case 'YELLOW':
      return {
        sonar: 'bg-amber-400/20',
        halo: 'bg-amber-400/10',
        border: 'border-amber-400/70',
        glow: 'shadow-[0_0_15px_rgba(251,191,36,0.35)]',
        badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
        iconColor: 'text-amber-400',
        dot: 'bg-amber-400',
      };
    default:
      return {
        sonar: 'bg-emerald-500/20',
        halo: 'bg-emerald-500/10',
        border: 'border-emerald-500/70',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
        badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
        iconColor: 'text-emerald-400',
        dot: 'bg-emerald-500',
      };
  }
}

export function CommandMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const {
    incidents,
    fireHotspots,
    riverTelemetry,
    earthquakes,
    shelters,
    evacuationRoutes,
    layerVisibility,
    toggleLayer,
    setSelectedIncident,
    setSelectedDistrict,
    timeHorizon,
    timelineStep,
    setTimeHorizon,
    setTimelineStep,
    isPlayingTimeline,
    setIsPlayingTimeline,
    fetchLiveTelemetry,
    isLoadingLive,
    lastLiveSync,
  } = useDisasterStore();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentBasemap, setCurrentBasemap] = useState<keyof typeof BASEMAP_STYLES>('satellite');
  const [activeMenu, setActiveMenu] = useState<'layers' | 'presets' | 'basemap' | 'search' | null>(null);
  const [showNdrfBases, setShowNdrfBases] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(4.6);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Visualization Mode: 'HYBRID' | 'HEATMAP' | 'NODES'
  const [visualMode, setVisualMode] = useState<'HYBRID' | 'HEATMAP' | 'NODES'>('HYBRID');

  const [mounted, setMounted] = useState(false);
  const [showFireHeatmap, setShowFireHeatmap] = useState<boolean>(true);
  const [showFloodHeatmap, setShowFloodHeatmap] = useState<boolean>(true);
  const [showRiskHeatmap, setShowRiskHeatmap] = useState<boolean>(true);

  // 24h / 7d / 30d Timeline panel visibility
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Live Telemetry Sync on mount
  useEffect(() => {
    setMounted(true);
    fetchLiveTelemetry(timeHorizon, false);
  }, []);

  // Filtered districts for quick search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return KEY_DISTRICT_PROFILES.filter(
      (d) =>
        d.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.dominantThreat.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  // Timeline Auto-play Loop (24h: 0-23, 7d: 1-7, 30d: 1-30)
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const maxSteps = { '24h': 23, '7d': 7, '30d': 30 };
    const minSteps = { '24h': 0, '7d': 1, '30d': 1 };
    const max = maxSteps[timeHorizon];
    const min = minSteps[timeHorizon];

    const timer = setInterval(() => {
      const current = useDisasterStore.getState().timelineStep;
      const next = current >= max ? min : current + 1;
      setTimelineStep(next);
    }, 1200);

    return () => clearInterval(timer);
  }, [isPlayingTimeline, timeHorizon]);

  // Load live telemetry on component mount
  useEffect(() => {
    fetchLiveTelemetry(timeHorizon, false);
  }, []);

  // Compute Dynamic Timeline-Modulated Telemetry State
  const dynamicTimelineData = useMemo(() => {
    const maxSteps = { '24h': 24, '7d': 7, '30d': 30 };
    const maxStep = maxSteps[timeHorizon];

    // 1. Dynamic Wildfire Hotspots (diurnal curve for 24h, weekly cluster spread for 7d/30d)
    const activeFires = fireHotspots.map((fire, idx) => {
      let multiplier = 1.0;
      if (timeHorizon === '24h') {
        const hourOffset = (timelineStep + (idx % 5)) % 24;
        const diurnal = Math.sin(((hourOffset - 5) / 18) * Math.PI);
        multiplier = Math.max(0.2, 0.4 + 0.8 * Math.max(0, diurnal));
      } else if (timeHorizon === '7d') {
        const dayFactor = timelineStep / 7;
        multiplier = 0.5 + 0.7 * Math.sin(dayFactor * Math.PI);
      } else {
        multiplier = 0.6 + 0.5 * Math.sin((timelineStep / 30) * Math.PI * 2);
      }
      return {
        ...fire,
        frp: Number((fire.frp * multiplier).toFixed(1)),
        confidence: multiplier > 0.6 ? fire.confidence : 'nominal',
      };
    });

    // 2. Dynamic River Hydrology (discharge & flood stage variations along timeline)
    const activeRiverTelemetry = riverTelemetry.map((gauge, idx) => {
      let waveMultiplier = 1.0;
      if (timeHorizon === '24h') {
        waveMultiplier = 0.88 + 0.22 * Math.sin(((timelineStep + idx * 3) / 24) * Math.PI * 2);
      } else if (timeHorizon === '7d') {
        waveMultiplier = 0.75 + 0.45 * Math.sin(((timelineStep + idx) / 8) * Math.PI);
      } else {
        waveMultiplier = 0.8 + 0.35 * Math.sin(((timelineStep + idx * 2) / 30) * Math.PI * 2);
      }
      const currentLevelM = Number((gauge.currentLevelM * waveMultiplier).toFixed(2));
      const dischargeCusecs = Math.round(gauge.dischargeCusecs * waveMultiplier);
      const status: 'NORMAL' | 'WARNING' | 'DANGER' =
        currentLevelM >= gauge.dangerLevelM
          ? 'DANGER'
          : currentLevelM >= gauge.warningLevelM
          ? 'WARNING'
          : 'NORMAL';

      return {
        ...gauge,
        currentLevelM,
        dischargeCusecs,
        status,
      };
    });

    // 3. Dynamic Earthquakes (scaled pulsing based on timeline position)
    const activeEarthquakes = earthquakes.map((quake, idx) => {
      const pulseFactor = 0.85 + 0.25 * Math.sin(((timelineStep + idx * 4) / maxStep) * Math.PI * 2);
      return {
        ...quake,
        dynamicMagnitude: Number((quake.magnitude * pulseFactor).toFixed(1)),
      };
    });

    // 4. Dynamic Incidents (risk scores & metric escalation based on timeline)
    const activeIncidents = incidents.map((incident, idx) => {
      const factor = 0.85 + 0.25 * Math.sin(((timelineStep + idx * 2) / maxStep) * Math.PI * 2);
      const riskScore = Math.min(100, Math.round((incident.metrics.riskScore || 75) * factor));
      const severity: 'RED' | 'ORANGE' | 'YELLOW' =
        riskScore >= 85 ? 'RED' : riskScore >= 65 ? 'ORANGE' : 'YELLOW';
      return {
        ...incident,
        metrics: {
          ...incident.metrics,
          riskScore,
          affectedPopulationEst: Math.round((incident.metrics.affectedPopulationEst || 50000) * factor),
        },
        severity,
      };
    });

    return {
      fires: activeFires,
      rivers: activeRiverTelemetry,
      quakes: activeEarthquakes,
      incidents: activeIncidents,
    };
  }, [timeHorizon, timelineStep, fireHotspots, riverTelemetry, earthquakes, incidents]);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        maplibregl.config.WORKER_URL = `${window.location.origin}/maplibre-gl-worker.mjs`;
      }

      const selectedStyle = BASEMAP_STYLES[currentBasemap];

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: selectedStyle.tiles,
              tileSize: 256,
              attribution: selectedStyle.attribution,
            },
          },
          layers: [
            {
              id: 'raster-tiles-layer',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [82.0, 22.0],
        zoom: 4.6,
        minZoom: 3.5,
        maxZoom: 18,
        pitch: 20,
        bearing: 0,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showCompass: true }), 'top-right');
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        setMapLoaded(true);
      });

      map.on('mousemove', (e) => {
        setCursorCoords({
          lat: parseFloat(e.lngLat.lat.toFixed(3)),
          lng: parseFloat(e.lngLat.lng.toFixed(3)),
        });
      });

      map.on('zoom', () => {
        setCurrentZoom(parseFloat(map.getZoom().toFixed(1)));
      });

      mapRef.current = map;
    } catch (err) {
      console.error('Error initializing map:', err);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update GPU Heatmap Layers based on Timeline & Live Telemetry
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // 1. NASA FIRMS Live Wildfires Heatmap
    const firmsGeoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features: dynamicTimelineData.fires.map((fire) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [fire.longitude, fire.latitude],
        },
        properties: {
          frp: fire.frp,
          confidence: fire.confidence === 'high' ? 1.0 : 0.6,
        },
      })),
    };

    if (!map.getSource('firms-heat-source')) {
      map.addSource('firms-heat-source', {
        type: 'geojson',
        data: firmsGeoJson,
      });

      map.addLayer({
        id: 'firms-heat-layer',
        type: 'heatmap',
        source: 'firms-heat-source',
        maxzoom: 15,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'frp'],
            0, 0.2,
            50, 0.6,
            200, 1.0,
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.9,
            9, 3.2,
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.1, 'rgba(49, 46, 129, 0.35)',
            0.3, 'rgba(225, 29, 72, 0.65)',
            0.6, 'rgba(234, 88, 12, 0.85)',
            0.85, 'rgba(245, 158, 11, 0.95)',
            1.0, 'rgba(255, 255, 255, 1)',
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 22,
            8, 48,
            12, 65,
          ],
          'heatmap-opacity': 0.85,
        },
      });
    } else {
      (map.getSource('firms-heat-source') as maplibregl.GeoJSONSource).setData(firmsGeoJson);
    }

    // 2. Open-Meteo & CWC River Basin Inundation Heatmap
    const floodGeoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features: dynamicTimelineData.rivers.map((gauge) => {
        const dangerRatio = gauge.currentLevelM / Math.max(1, gauge.dangerLevelM);
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [gauge.coordinates.lng, gauge.coordinates.lat],
          },
          properties: {
            dangerRatio,
          },
        };
      }),
    };

    if (!map.getSource('flood-heat-source')) {
      map.addSource('flood-heat-source', {
        type: 'geojson',
        data: floodGeoJson,
      });

      map.addLayer({
        id: 'flood-heat-layer',
        type: 'heatmap',
        source: 'flood-heat-source',
        maxzoom: 15,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'dangerRatio'],
            0, 0.2,
            1, 1.0,
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.8,
            9, 2.6,
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.15, 'rgba(30, 58, 138, 0.35)',
            0.4, 'rgba(6, 182, 212, 0.7)',
            0.7, 'rgba(56, 189, 248, 0.9)',
            1.0, 'rgba(224, 242, 254, 1)',
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 24,
            8, 50,
            12, 70,
          ],
          'heatmap-opacity': 0.8,
        },
      });
    } else {
      (map.getSource('flood-heat-source') as maplibregl.GeoJSONSource).setData(floodGeoJson);
    }

    // 3. Multi-Hazard Composite Vulnerability Heatmap
    const hazardGeoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features: KEY_DISTRICT_PROFILES.map((dist) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [dist.center.lng, dist.center.lat],
        },
        properties: {
          riskScore: dist.overallVulnerabilityScore,
        },
      })),
    };

    if (!map.getSource('hazard-heat-source')) {
      map.addSource('hazard-heat-source', {
        type: 'geojson',
        data: hazardGeoJson,
      });

      map.addLayer({
        id: 'hazard-heat-layer',
        type: 'heatmap',
        source: 'hazard-heat-source',
        maxzoom: 15,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'riskScore'],
            0, 0.1,
            100, 1.0,
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.7,
            9, 2.4,
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.2, 'rgba(202, 138, 4, 0.25)',
            0.5, 'rgba(234, 88, 12, 0.65)',
            0.8, 'rgba(225, 29, 72, 0.85)',
            1.0, 'rgba(255, 255, 255, 1)',
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 28,
            8, 55,
            12, 75,
          ],
          'heatmap-opacity': 0.75,
        },
      });
    } else {
      (map.getSource('hazard-heat-source') as maplibregl.GeoJSONSource).setData(hazardGeoJson);
    }

    // Update opacities based on visual mode
    const heatOpacity = visualMode === 'NODES' ? 0 : visualMode === 'HYBRID' ? 0.65 : 0.9;
    if (map.getLayer('firms-heat-layer')) {
      map.setLayoutProperty('firms-heat-layer', 'visibility', showFireHeatmap && visualMode !== 'NODES' ? 'visible' : 'none');
      map.setPaintProperty('firms-heat-layer', 'heatmap-opacity', heatOpacity);
    }
    if (map.getLayer('flood-heat-layer')) {
      map.setLayoutProperty('flood-heat-layer', 'visibility', showFloodHeatmap && visualMode !== 'NODES' ? 'visible' : 'none');
      map.setPaintProperty('flood-heat-layer', 'heatmap-opacity', heatOpacity);
    }
    if (map.getLayer('hazard-heat-layer')) {
      map.setLayoutProperty('hazard-heat-layer', 'visibility', showRiskHeatmap && visualMode !== 'NODES' ? 'visible' : 'none');
      map.setPaintProperty('hazard-heat-layer', 'heatmap-opacity', heatOpacity);
    }
  }, [mapLoaded, dynamicTimelineData, showFireHeatmap, showFloodHeatmap, showRiskHeatmap, visualMode]);

  // Handle Basemap Switch
  const handleSwitchBasemap = (styleKey: keyof typeof BASEMAP_STYLES) => {
    if (!mapRef.current || !mapLoaded || styleKey === currentBasemap) return;
    setCurrentBasemap(styleKey);
    tacticalAudio.playRadarPing(920, 0.1);

    const map = mapRef.current;
    const selectedStyle = BASEMAP_STYLES[styleKey];

    if (map.getLayer('raster-tiles-layer')) {
      map.removeLayer('raster-tiles-layer');
    }
    if (map.getSource('raster-tiles')) {
      map.removeSource('raster-tiles');
    }

    map.addSource('raster-tiles', {
      type: 'raster',
      tiles: selectedStyle.tiles,
      tileSize: 256,
      attribution: selectedStyle.attribution,
    });

    map.addLayer(
      {
        id: 'raster-tiles-layer',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
      map.getLayer('firms-heat-layer') ? 'firms-heat-layer' : undefined
    );

    setActiveMenu(null);
  };

  // Fly to camera preset
  const handleFlyToPreset = (preset: (typeof CAMERA_PRESETS)[0]) => {
    if (!mapRef.current) return;
    tacticalAudio.playRadarPing(740, 0.18);
    mapRef.current.flyTo({
      center: preset.center,
      zoom: preset.zoom,
      pitch: preset.pitch,
      bearing: 0,
      speed: 1.2,
      curve: 1.42,
      essential: true,
    });
    setActiveMenu(null);
  };

  // Fly to Searched District
  const handleSelectDistrict = (dist: (typeof KEY_DISTRICT_PROFILES)[0]) => {
    if (!mapRef.current) return;
    tacticalAudio.playRadarPing(880, 0.2);
    setSelectedDistrict(dist);
    mapRef.current.flyTo({
      center: [dist.center.lng, dist.center.lat],
      zoom: 8.5,
      pitch: 45,
      speed: 1.3,
      essential: true,
    });
    setSearchQuery('');
    setActiveMenu(null);
  };

  // Render Map Markers & Popups (Tactical Nodes Mode & Hybrid Mode)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const map = mapRef.current;

    // 1. Primary Incidents
    dynamicTimelineData.incidents.forEach((incident) => {
      const el = document.createElement('div');
      el.className = 'group relative flex items-center justify-center cursor-pointer select-none';

      const theme = getIncidentTheme(incident.severity);
      const iconSvg = getCategorySvg(incident.category, theme.iconColor);

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-11 w-11 rounded-full ${theme.sonar} animate-sonar pointer-events-none"></span>
          <span class="absolute inline-flex h-7 w-7 rounded-full ${theme.halo} pointer-events-none"></span>
          <div class="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950/95 border ${theme.border} ${theme.glow} shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:scale-125 group-hover:bg-slate-900">
            ${iconSvg}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 whitespace-nowrap rounded-full bg-slate-950/90 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-200 border border-white/10 shadow-lg">
            ${incident.district}
          </div>
        </div>
      `;

      const popupHtml = `
        <div class="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-2xl font-sans text-xs min-w-[260px] max-w-[280px]">
          <div class="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2 mb-2">
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full ${theme.dot}"></span>
              <span class="font-mono text-[10px] font-bold tracking-wider uppercase text-slate-300">${incident.category}</span>
            </div>
            <span class="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold ${theme.badge}">
              ${incident.severity} ALERT
            </span>
          </div>

          <h4 class="font-bold text-slate-100 text-xs leading-snug mb-1">${incident.title}</h4>
          <p class="text-[11px] text-slate-400 leading-relaxed mb-2.5">${incident.details}</p>

          <div class="grid grid-cols-2 gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 text-[10px] font-mono mb-2.5">
            <div><span class="text-slate-500">DIST:</span> <span class="font-semibold text-slate-200">${incident.district}</span></div>
            <div><span class="text-slate-500">SCORE:</span> <span class="font-semibold text-rose-400">${incident.metrics.riskScore}/100</span></div>
            <div><span class="text-slate-500">SOURCE:</span> <span class="font-semibold text-cyan-300">${incident.source}</span></div>
            <div><span class="text-slate-500">POP:</span> <span class="font-semibold text-amber-300">${formatNumber(incident.metrics.affectedPopulationEst || 0)}</span></div>
          </div>

          <div class="flex items-center justify-between text-[10px] font-medium text-cyan-400 pt-1 border-t border-white/[0.06]">
            <span>Click to inspect & dispatch swarm</span>
            <span class="font-mono">→</span>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(popupHtml);

      el.addEventListener('click', () => {
        tacticalAudio.playRadarPing(880, 0.2);
        setSelectedIncident(incident);
        const matchDistrict = KEY_DISTRICT_PROFILES.find(
          (d) => d.districtName.toLowerCase() === incident.district.toLowerCase()
        );
        if (matchDistrict) {
          setSelectedDistrict(matchDistrict);
        }
        map.flyTo({
          center: [incident.location.lng, incident.location.lat],
          zoom: 7.8,
          pitch: 45,
          speed: 1.2,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([incident.location.lng, incident.location.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 2. Secondary Telemetry Pips (Shown in HYBRID or NODES mode)
    if (visualMode !== 'HEATMAP') {
      // NASA FIRMS Live Fire Hotspots (Ember Pips)
      if (layerVisibility.nasaFirmsFires) {
        dynamicTimelineData.fires.forEach((fire) => {
          const el = document.createElement('div');
          el.className = 'group relative flex items-center justify-center cursor-pointer p-1';
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              <span class="h-2 w-2 rounded-full bg-orange-500 border border-amber-300/90 shadow-[0_0_8px_rgba(249,115,22,0.9)] transition-all duration-200 group-hover:scale-150"></span>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 8, closeButton: false }).setHTML(`
            <div class="rounded-xl border border-white/10 bg-slate-950/95 p-2.5 text-xs shadow-2xl backdrop-blur-xl min-w-[190px]">
              <div class="flex items-center gap-1.5 font-bold text-orange-400 text-[11px] mb-1">
                <span class="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                <span>NASA FIRMS Live Fire</span>
              </div>
              <p class="text-[11px] text-slate-200 mb-1.5">${fire.forestReserve || fire.state}</p>
              <div class="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-300 pt-1.5 border-t border-white/[0.08]">
                <div>FRP: <b class="text-orange-400">${fire.frp} MW</b></div>
                <div>Conf: <b class="text-amber-300 capitalize">${fire.confidence}</b></div>
              </div>
            </div>
          `);

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([fire.longitude, fire.latitude])
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);
        });
      }

      // CWC River Gauges (Hydro Pips)
      if (layerVisibility.cwcRiverGauges) {
        dynamicTimelineData.rivers.forEach((gauge) => {
          const isDanger = gauge.status === 'DANGER';
          const isWarning = gauge.status === 'WARNING';
          const el = document.createElement('div');
          el.className = 'group relative flex items-center justify-center cursor-pointer p-1';
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              ${isDanger ? '<span class="absolute h-3.5 w-3.5 rounded-full bg-rose-500/40 animate-ping"></span>' : ''}
              <span class="h-2 w-2 rounded-full ${
                isDanger
                  ? 'bg-rose-500 border-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.9)]'
                  : isWarning
                  ? 'bg-amber-400 border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                  : 'bg-cyan-400 border-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
              } transition-all duration-200 group-hover:scale-150"></span>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 8, closeButton: false }).setHTML(`
            <div class="rounded-xl border border-white/10 bg-slate-950/95 p-2.5 text-xs shadow-2xl backdrop-blur-xl min-w-[200px]">
              <div class="flex items-center gap-1.5 font-bold ${isDanger ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-cyan-400'} text-[11px] mb-1">
                <span class="h-1.5 w-1.5 rounded-full ${isDanger ? 'bg-rose-400 animate-pulse' : isWarning ? 'bg-amber-400' : 'bg-cyan-400'}"></span>
                <span>CWC: ${gauge.stationName}</span>
              </div>
              <p class="text-[11px] text-slate-200 mb-1.5">River: <b>${gauge.riverName}</b> (${gauge.status})</p>
              <div class="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-300 pt-1.5 border-t border-white/[0.08]">
                <div>Level: <b class="${isDanger ? 'text-rose-400' : isWarning ? 'text-amber-300' : 'text-cyan-300'}">${gauge.currentLevelM}m</b></div>
                <div>Danger: <b class="text-amber-300">${gauge.dangerLevelM}m</b></div>
                <div class="col-span-2">Flow: <b class="text-slate-200">${gauge.dischargeCusecs.toLocaleString()} cusecs</b></div>
              </div>
            </div>
          `);

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([gauge.coordinates.lng, gauge.coordinates.lat])
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);
        });
      }

      // USGS Earthquakes (Seismic Diamond Pips)
      if (layerVisibility.usgsEarthquakes) {
        dynamicTimelineData.quakes.forEach((quake) => {
          const el = document.createElement('div');
          el.className = 'group relative flex items-center justify-center cursor-pointer p-1';
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              <span class="h-2 w-2 rotate-45 bg-purple-400 border border-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all duration-200 group-hover:scale-150"></span>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 8, closeButton: false }).setHTML(`
            <div class="rounded-xl border border-white/10 bg-slate-950/95 p-2.5 text-xs shadow-2xl backdrop-blur-xl min-w-[200px]">
              <div class="flex items-center gap-1.5 font-bold text-purple-400 text-[11px] mb-1">
                <span class="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                <span>USGS Live Quake M${quake.magnitude}</span>
              </div>
              <p class="text-[10px] text-slate-300 leading-relaxed">${quake.place}</p>
            </div>
          `);

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([quake.coordinates.lng, quake.coordinates.lat])
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);
        });
      }

      // Relief Shelters
      if (layerVisibility.osmShelters) {
        shelters.forEach((shelter) => {
          const el = document.createElement('div');
          el.className = 'group relative flex items-center justify-center cursor-pointer p-1';
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              <span class="h-2 w-2 rounded-[2px] bg-emerald-400 border border-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-200 group-hover:scale-150"></span>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 8, closeButton: false }).setHTML(`
            <div class="rounded-xl border border-white/10 bg-slate-950/95 p-2.5 text-xs shadow-2xl backdrop-blur-xl min-w-[200px]">
              <div class="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] mb-1">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>${shelter.name}</span>
              </div>
              <p class="text-[10px] text-slate-400">${shelter.district}, ${shelter.state}</p>
              <p class="text-[10px] font-mono text-emerald-300 mt-1 pt-1 border-t border-white/[0.08]">
                Cap: <b>${shelter.currentOccupancy}</b> / ${shelter.capacityMax}
              </p>
            </div>
          `);

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([shelter.coordinates.lng, shelter.coordinates.lat])
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);
        });
      }

      // NDRF Battalions
      if (showNdrfBases) {
        MAJOR_NDRF_BATTALIONS.forEach((bn) => {
          const el = document.createElement('div');
          el.className = 'group relative flex items-center justify-center cursor-pointer';
          el.innerHTML = `
            <div class="flex items-center gap-1 rounded-md bg-slate-950/90 border border-blue-400/40 px-1.5 py-0.5 shadow-[0_0_12px_rgba(59,130,246,0.3)] backdrop-blur-md transition-all duration-200 group-hover:scale-110 group-hover:border-blue-400">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              <span class="font-mono text-[9px] font-bold text-blue-200">${bn.battalionNumber}Bn</span>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 8, closeButton: false }).setHTML(`
            <div class="rounded-xl border border-white/10 bg-slate-950/95 p-2.5 text-xs shadow-2xl backdrop-blur-xl min-w-[190px]">
              <div class="flex items-center gap-1.5 font-bold text-blue-400 text-[11px] mb-1">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>${bn.name}</span>
              </div>
              <p class="text-[10px] text-slate-300">Base: <b>${bn.baseLocation}</b> (${bn.state})</p>
            </div>
          `);

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([bn.coordinates.lng, bn.coordinates.lat])
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);
        });
      }
    }
  }, [
    mapLoaded,
    dynamicTimelineData,
    shelters,
    layerVisibility,
    showNdrfBases,
    visualMode,
    setSelectedIncident,
    setSelectedDistrict,
  ]);

  const handleForceLiveSync = () => {
    tacticalAudio.playRadarPing(900, 0.15);
    fetchLiveTelemetry(timeHorizon, true);
  };

  const toggleFullscreen = () => {
    if (!mapContainer.current) return;
    if (!document.fullscreenElement) {
      mapContainer.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const activeSensorsCount =
    (layerVisibility.nasaFirmsFires ? fireHotspots.length : 0) +
    (layerVisibility.cwcRiverGauges ? riverTelemetry.length : 0) +
    (layerVisibility.usgsEarthquakes ? earthquakes.length : 0) +
    (layerVisibility.osmShelters ? shelters.length : 0);

  // Timeline display label calculation
  const timelineDisplayInfo = useMemo(() => {
    if (timeHorizon === '24h') {
      return {
        label: `${timelineStep.toString().padStart(2, '0')}:00 IST`,
        subtext: `Hourly Real-Time Telemetry Evolution (T+${timelineStep}h)`,
        max: 23,
        min: 0,
      };
    }
    if (timeHorizon === '7d') {
      return {
        label: `Day ${timelineStep} of 7`,
        subtext: `7-Day Space & Hydro Basin Window`,
        max: 7,
        min: 1,
      };
    }
    return {
      label: `Day ${timelineStep} of 30`,
      subtext: `30-Day Historical Trend & Multi-Hazard Progression`,
      max: 30,
      min: 1,
    };
  }, [timeHorizon, timelineStep]);

  return (
    <div className="relative h-[calc(100vh-3.25rem)] w-full overflow-hidden bg-slate-950 font-sans select-none">
      {/* Map Canvas */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Top Floating Island Navigation */}
      <div className="absolute top-3.5 left-4 z-20 flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-slate-950/85 p-1 shadow-2xl backdrop-blur-xl">
          {/* Visual Mode Selector */}
          <div className="flex items-center rounded-full bg-slate-900/90 p-0.5 border border-white/[0.06] text-xs">
            <button
              onClick={() => {
                tacticalAudio.playRadarPing(800, 0.08);
                setVisualMode('HYBRID');
              }}
              className={`rounded-full px-2.5 py-1 font-medium transition ${
                visualMode === 'HYBRID'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => {
                tacticalAudio.playRadarPing(800, 0.08);
                setVisualMode('HEATMAP');
              }}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition ${
                visualMode === 'HEATMAP'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="h-3 w-3 text-orange-400" />
              <span>Heatmap</span>
            </button>
            <button
              onClick={() => {
                tacticalAudio.playRadarPing(800, 0.08);
                setVisualMode('NODES');
              }}
              className={`rounded-full px-2.5 py-1 font-medium transition ${
                visualMode === 'NODES'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nodes
            </button>
          </div>

          <div className="h-4 w-px bg-white/[0.08] mx-0.5" />

          {/* Layer Menu Button */}
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800, 0.08);
              setActiveMenu(activeMenu === 'layers' ? null : 'layers');
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeMenu === 'layers'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Layers</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${activeMenu === 'layers' ? 'rotate-180' : ''}`} />
          </button>

          {/* Camera Hotspots Button */}
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800, 0.08);
              setActiveMenu(activeMenu === 'presets' ? null : 'presets');
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeMenu === 'presets'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Crosshair className="h-3.5 w-3.5 text-cyan-400" />
            <span>Hotspots</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${activeMenu === 'presets' ? 'rotate-180' : ''}`} />
          </button>

          {/* Basemap Button */}
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800, 0.08);
              setActiveMenu(activeMenu === 'basemap' ? null : 'basemap');
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeMenu === 'basemap'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Satellite className="h-3.5 w-3.5 text-cyan-400" />
            <span>Basemap</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${activeMenu === 'basemap' ? 'rotate-180' : ''}`} />
          </button>

          {/* District Search Button */}
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800, 0.08);
              setActiveMenu(activeMenu === 'search' ? null : 'search');
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeMenu === 'search'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Live Sync Action Button */}
        <button
          onClick={handleForceLiveSync}
          disabled={isLoadingLive}
          className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-500/20 shadow-2xl backdrop-blur-xl transition disabled:opacity-50"
          title="Force Real-Time Live Sync from NASA FIRMS & USGS"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLive ? 'animate-spin text-emerald-400' : ''}`} />
          <span className="hidden sm:inline">{isLoadingLive ? 'Syncing...' : 'Live Sync'}</span>
        </button>

        {/* Timeline Toggle Button */}
        <button
          onClick={() => {
            tacticalAudio.playRadarPing(800, 0.08);
            setIsTimelineOpen(!isTimelineOpen);
          }}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-2xl backdrop-blur-xl transition ${
            isTimelineOpen
              ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-semibold'
              : 'border-white/[0.08] bg-slate-950/85 text-slate-300 hover:text-white'
          }`}
        >
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>{timelineDisplayInfo.label}</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-slate-950/85 text-slate-300 hover:text-white hover:bg-white/[0.04] shadow-2xl backdrop-blur-xl transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Floating Popovers for Island Menus */}
      {activeMenu && (
        <div className="absolute top-14 left-4 z-30 w-80 rounded-2xl border border-white/[0.1] bg-slate-950/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2 text-xs font-semibold text-slate-300">
            <span>
              {activeMenu === 'layers' && 'Telemetry & Heatmaps'}
              {activeMenu === 'presets' && 'Crisis Camera Hotspots'}
              {activeMenu === 'basemap' && 'Basemap Tile Provider'}
              {activeMenu === 'search' && 'Search Indian Districts'}
            </span>
            <button
              onClick={() => setActiveMenu(null)}
              className="rounded p-0.5 text-slate-500 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Search Districts */}
          {activeMenu === 'search' && (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type district (e.g. Puri, Wayanad)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map((dist) => (
                    <button
                      key={dist.districtName}
                      onClick={() => handleSelectDistrict(dist)}
                      className="w-full flex items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-white/[0.06] text-slate-200 transition"
                    >
                      <div>
                        <p className="font-bold text-slate-100">{dist.districtName}</p>
                        <p className="text-[10px] text-slate-400">{dist.state} · {dist.dominantThreat}</p>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-rose-400">{dist.overallVulnerabilityScore}/100</span>
                    </button>
                  ))
                ) : (
                  <p className="p-2 text-center text-xs text-slate-500">
                    {searchQuery ? 'No matching district found' : 'Type a district or threat name'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Layer & Heatmap Toggles */}
          {activeMenu === 'layers' && (
            <div className="space-y-2 text-xs">
              <div className="rounded-xl bg-slate-900/60 p-2 border border-white/[0.04] space-y-1.5">
                <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-wider block">
                  GPU Heatmap Density
                </span>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">🔥 Thermal Fire Heatmap</span>
                  <input
                    type="checkbox"
                    checked={showFireHeatmap}
                    onChange={() => setShowFireHeatmap(!showFireHeatmap)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">🌊 River Inundation Heatmap</span>
                  <input
                    type="checkbox"
                    checked={showFloodHeatmap}
                    onChange={() => setShowFloodHeatmap(!showFloodHeatmap)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">⚠️ Vulnerability Risk Heatmap</span>
                  <input
                    type="checkbox"
                    checked={showRiskHeatmap}
                    onChange={() => setShowRiskHeatmap(!showRiskHeatmap)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block px-1">
                  Live Telemetry Feeds
                </span>
                <label className="flex items-center justify-between rounded-lg bg-white/[0.02] p-1.5 hover:bg-white/[0.05] cursor-pointer">
                  <span className="text-slate-300">NASA FIRMS Fires</span>
                  <input
                    type="checkbox"
                    checked={layerVisibility.nasaFirmsFires}
                    onChange={() => toggleLayer('nasaFirmsFires')}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg bg-white/[0.02] p-1.5 hover:bg-white/[0.05] cursor-pointer">
                  <span className="text-slate-300">CWC River Gauges</span>
                  <input
                    type="checkbox"
                    checked={layerVisibility.cwcRiverGauges}
                    onChange={() => toggleLayer('cwcRiverGauges')}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg bg-white/[0.02] p-1.5 hover:bg-white/[0.05] cursor-pointer">
                  <span className="text-slate-300">USGS Seismology</span>
                  <input
                    type="checkbox"
                    checked={layerVisibility.usgsEarthquakes}
                    onChange={() => toggleLayer('usgsEarthquakes')}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg bg-white/[0.02] p-1.5 hover:bg-white/[0.05] cursor-pointer">
                  <span className="text-slate-300">Relief Shelters</span>
                  <input
                    type="checkbox"
                    checked={layerVisibility.osmShelters}
                    onChange={() => toggleLayer('osmShelters')}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg bg-white/[0.02] p-1.5 hover:bg-white/[0.05] cursor-pointer">
                  <span className="text-slate-300">NDRF 16 Battalions</span>
                  <input
                    type="checkbox"
                    checked={showNdrfBases}
                    onChange={() => setShowNdrfBases(!showNdrfBases)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Camera Hotspots */}
          {activeMenu === 'presets' && (
            <div className="space-y-1 text-xs">
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleFlyToPreset(preset)}
                  className="w-full flex items-center justify-between rounded-xl p-2 text-left text-slate-300 hover:bg-white/[0.06] hover:text-white transition"
                >
                  <span className="text-xs">{preset.label}</span>
                  <Crosshair className="h-3 w-3 text-slate-500" />
                </button>
              ))}
            </div>
          )}

          {/* Basemap Selection */}
          {activeMenu === 'basemap' && (
            <div className="space-y-1.5 text-xs">
              {(Object.keys(BASEMAP_STYLES) as Array<keyof typeof BASEMAP_STYLES>).map((key) => {
                const style = BASEMAP_STYLES[key];
                const Icon = style.icon;
                const isSelected = currentBasemap === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSwitchBasemap(key)}
                    className={`w-full flex items-center justify-between rounded-xl p-2 text-xs transition ${
                      isSelected
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{style.name}</span>
                    </div>
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 24-Hour / 7-Day / 30-Day Multi-Horizon Timeline Scrubber & Simulation Bar */}
      {isTimelineOpen && (
        <div className="absolute bottom-16 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[680px] z-30 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5 mb-3">
            {/* Horizon Selector Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-white/[0.06] text-xs">
              <button
                onClick={() => {
                  tacticalAudio.playRadarPing(800, 0.08);
                  setTimeHorizon('24h');
                }}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition ${
                  timeHorizon === '24h'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="h-3 w-3" />
                <span>24 Hours</span>
              </button>
              <button
                onClick={() => {
                  tacticalAudio.playRadarPing(800, 0.08);
                  setTimeHorizon('7d');
                }}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition ${
                  timeHorizon === '7d'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>7 Days</span>
              </button>
              <button
                onClick={() => {
                  tacticalAudio.playRadarPing(800, 0.08);
                  setTimeHorizon('30d');
                }}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition ${
                  timeHorizon === '30d'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>30 Days</span>
              </button>
            </div>

            {/* Play/Pause & Reset Simulation */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                className="flex items-center gap-1.5 rounded-full bg-cyan-500 px-3.5 py-1 font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                {isPlayingTimeline ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                <span>{isPlayingTimeline ? 'Pause' : 'Play Sim'}</span>
              </button>
              <button
                onClick={() => setTimelineStep(timeHorizon === '24h' ? 0 : 1)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                title="Reset Timeline to Start"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Time Slider Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">{timelineDisplayInfo.label}</span>
              <span className="text-[11px] text-slate-400">{timelineDisplayInfo.subtext}</span>
              <span className="text-slate-500">
                {timeHorizon === '24h' ? '23:59 IST' : timeHorizon === '7d' ? 'Day 7 (Today)' : 'Day 30 (Today)'}
              </span>
            </div>

            <input
              type="range"
              min={timelineDisplayInfo.min}
              max={timelineDisplayInfo.max}
              value={timelineStep}
              onChange={(e) => setTimelineStep(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-cyan-400"
            />

            {/* Milestone Markers */}
            {timeHorizon === '24h' && (
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-500 pt-1">
                <span className="text-left cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(4)}>04:00 (Depression)</span>
                <span className="text-center cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(9)}>09:00 (Approach)</span>
                <span className="text-center cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(14)}>14:00 (Peak Surge)</span>
                <span className="text-right cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(19)}>19:00 (Swarm Evac)</span>
              </div>
            )}

            {timeHorizon === '7d' && (
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-500 pt-1">
                <span className="text-left cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(1)}>Day 1 (-6d)</span>
                <span className="text-center cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(3)}>Day 3 (-4d)</span>
                <span className="text-center cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(5)}>Day 5 (-2d)</span>
                <span className="text-right cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(7)}>Day 7 (Today)</span>
              </div>
            )}

            {timeHorizon === '30d' && (
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-500 pt-1">
                <span className="text-left cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(1)}>Week 1 (-30d)</span>
                <span className="text-center cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(10)}>Week 2 (-20d)</span>
                <span className="text-center cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(20)}>Week 3 (-10d)</span>
                <span className="text-right cursor-pointer hover:text-cyan-300" onClick={() => setTimelineStep(30)}>Week 4 (Today)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-3.5 left-4 z-20 flex items-center gap-2 font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-slate-950/80 px-3 py-1 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-1 text-cyan-400 font-bold">
            <Compass className="h-3 w-3" />
            <span>DRISHTI</span>
          </div>
          <span className="text-slate-700">·</span>
          <span>{cursorCoords ? `${cursorCoords.lat}° N, ${cursorCoords.lng}° E` : '22.00° N, 82.00° E'}</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-300">{currentZoom}x</span>
          <span className="text-slate-700">·</span>
          <span className="text-emerald-400 font-medium">{activeSensorsCount} live telemetry nodes</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-400 text-[10px]">
            Live Sync: {mounted ? new Date(lastLiveSync).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Synchronizing...'}
          </span>
        </div>
      </div>

      {/* District Vulnerability Slide-over Drawer */}
      <DistrictDrawer />
    </div>
  );
}
