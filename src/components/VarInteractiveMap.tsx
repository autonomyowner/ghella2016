import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VarInteractiveMapProps {
  lat: number;
  lon: number;
  weatherData?: any;
  soilData?: any;
  satelliteImages?: { url: string; date: string; type: string; }[];
}

const VarInteractiveMap: React.FC<VarInteractiveMapProps> = ({ lat, lon, weatherData, soilData, satelliteImages }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;
    const map = L.map(mapRef.current).setView([lat, lon], 10);
    leafletMapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Weather marker
    if (weatherData) {
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>Weather</b><br/>Temp: ${weatherData.temperature}°C<br/>Humidity: ${weatherData.humidity}%<br/>Rainfall: ${weatherData.rainfall}mm`)
        .openPopup();
    }

    // Soil marker
    if (soilData) {
      L.circle([lat, lon], {
        color: 'brown',
        fillColor: '#a0522d',
        fillOpacity: 0.4,
        radius: 2000
      })
        .addTo(map)
        .bindPopup(`<b>Soil</b><br/>pH: ${soilData.ph}<br/>Moisture: ${soilData.moisture}%`);
    }

    // Satellite overlays
    if (satelliteImages && satelliteImages.length > 0) {
      satelliteImages.forEach(img => {
        // Example: overlay NDVI or RGB images (requires georeferenced tiles for real use)
        if (img.type === 'ndvi' || img.type === 'rgb') {
          // For demo, just add as a marker with a thumbnail
          L.marker([lat + Math.random() * 0.05, lon + Math.random() * 0.05])
            .addTo(map)
            .bindPopup(`<b>${img.type.toUpperCase()} Image</b><br/><img src='${img.url}' style='width:100px;height:auto' /><br/>${img.date}`);
        }
      });
    }

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [lat, lon, weatherData, soilData, satelliteImages]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '500px', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px #0002' }} />
  );
};

export default VarInteractiveMap;
