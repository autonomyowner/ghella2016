import React, { useEffect, useRef, useState } from 'react';

interface VarInteractiveMapProps {
  lat: number;
  lon: number;
  weatherData?: any;
  soilData?: any;
  satelliteImages?: { url: string; date: string; type: string; }[];
}

const VarInteractiveMap: React.FC<VarInteractiveMapProps> = ({ lat, lon, weatherData, soilData, satelliteImages }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Dynamically import leaflet only on client side
    const initMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Add leaflet CSS dynamically
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }
        
        const map = L.map(mapRef.current!).setView([lat, lon], 10);

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
            if (img.type === 'ndvi' || img.type === 'rgb') {
              L.marker([lat + Math.random() * 0.05, lon + Math.random() * 0.05])
                .addTo(map)
                .bindPopup(`<b>${img.type.toUpperCase()} Image</b><br/><img src='${img.url}' style='width:100px;height:auto' /><br/>${img.date}`);
            }
          });
        }

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    const cleanup = initMap();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [isClient, lat, lon, weatherData, soilData, satelliteImages]);

  if (!isClient) {
    return (
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '500px', 
          borderRadius: 16, 
          overflow: 'hidden', 
          boxShadow: '0 4px 24px #0002',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px'
        }}
      >
        جاري تحميل الخريطة...
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '500px', 
        borderRadius: 16, 
        overflow: 'hidden', 
        boxShadow: '0 4px 24px #0002' 
      }} 
    />
  );
};

export default VarInteractiveMap;
