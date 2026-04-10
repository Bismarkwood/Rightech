import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RetailerOrder } from '../../../core/data/mockRetailerOrders';
import { GhanaAddress } from '../../../core/types/address';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const riderIcon = L.divIcon({
  className: 'rider-marker',
  html: `
    <div style="background: white; border: 3px solid #111111; width: 36px; height: 36px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
      <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #111111;"></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 42],
});

const destIcon = L.divIcon({
  className: 'dest-marker',
  html: `
    <div style="background: #D40073; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(212,0,115,0.2);"></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Helper component to auto-recenter map
function MapUpdater({ riderPos, destPos }: { riderPos: [number, number], destPos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([riderPos, destPos]);
    map.fitBounds(bounds, { padding: [100, 100], maxZoom: 16 });
  }, [riderPos, destPos, map]);
  return null;
}

interface TrackingMapProps {
  order: RetailerOrder;
}

export function TrackingMap({ order }: TrackingMapProps) {
  // Destination coordinates (mocking based on address)
  const destPos: [number, number] = [5.6037, -0.1870];
  const [riderPos, setRiderPos] = useState<[number, number]>([5.5900, -0.2000]);

  useEffect(() => {
    if (!order.riderLocation) return;
    
    // Initial jump to current location
    setRiderPos([order.riderLocation.lat, order.riderLocation.lng]);

    // Simulate smooth movement toward destination
    const interval = setInterval(() => {
      setRiderPos(prev => {
        const dLat = (destPos[0] - prev[0]) * 0.05;
        const dLng = (destPos[1] - prev[1]) * 0.05;
        
        // If very close, stop moving
        if (Math.abs(dLat) < 0.00001 && Math.abs(dLng) < 0.00001) {
          clearInterval(interval);
          return prev;
        }
        
        return [prev[0] + dLat, prev[1] + dLng];
      });
    }, 5000); // Update every 5s for simulation

    return () => clearInterval(interval);
  }, [order.id]);

  const address = order.deliveryAddress as GhanaAddress;
  const destinationLabel = address?.area ? `${address.area}` : 'Destination';

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={riderPos} 
        zoom={14} 
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        <Polyline 
          positions={[riderPos, destPos]} 
          color="#111111" 
          weight={2} 
          dashArray="8, 12" 
          opacity={0.3} 
        />
        
        <Marker position={destPos} icon={destIcon}>
          <Popup className="custom-popup">
            <div className="text-[12px] font-black text-[#D40073] uppercase tracking-wider">{destinationLabel}</div>
            <div className="text-[10px] font-medium text-[#8B93A7]">{address?.landmark || 'Awaiting rider...'}</div>
          </Popup>
        </Marker>
        
        <Marker position={riderPos} icon={riderIcon}>
          <Popup>
            <div className="text-[13px] font-black text-[#111111]">{order.agent?.name || 'Your Rider'}</div>
            <div className="text-[11px] font-medium text-[#8B93A7]">Moving toward you</div>
          </Popup>
        </Marker>

        <MapUpdater riderPos={riderPos} destPos={destPos} />
      </MapContainer>
    </div>
  );
}
