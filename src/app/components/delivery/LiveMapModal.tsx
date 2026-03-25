import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Phone, X, Clock, User } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: white; border: 2px solid ${color}; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const pickupIcon = createCustomIcon('#111111');
const dropoffIcon = createCustomIcon('#D40073');

const agentHtml = `
  <div style="position: relative; display: flex; align-items: center; justify-content: center;">
    <div style="position: absolute; inset: 0; background-color: #D40073; border-radius: 50%; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; transform: scale(2.5);"></div>
    <div style="width: 32px; height: 32px; background-color: white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; border: 2px solid #D40073;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#D40073" stroke="#D40073" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
    </div>
  </div>
`;

const agentIcon = L.divIcon({
  className: 'agent-leaflet-icon',
  html: agentHtml,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface LiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: any;
}

// Coordinates around Accra
const routeCoordinates: [number, number][] = [
  [5.5560, -0.1969], // Accra Central
  [5.5760, -0.1800], // Ridge
  [5.5960, -0.1700], // Cantonments
  [5.6260, -0.1500], // Airport Residential
  [5.6450, -0.1450]  // East Legon Dropoff
];

// Helper to calculate distance
const getDistance = (p1: [number, number], p2: [number, number]) => {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return Math.sqrt(dx*dx + dy*dy);
};

export function LiveMapModal({ isOpen, onClose, delivery }: LiveMapModalProps) {
  const [progress, setProgress] = useState(0);

  // Animate the vehicle moving along the path
  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            clearInterval(interval);
            return 1;
          }
          return p + 0.005; // speed
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate current agent position based on progress
  const getTotalLength = () => {
    let len = 0;
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      len += getDistance(routeCoordinates[i], routeCoordinates[i+1]);
    }
    return len;
  };

  const getAgentPosition = (): [number, number] => {
    const totalLength = getTotalLength();
    const currentLength = totalLength * progress;
    
    let traveled = 0;
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const segLen = getDistance(routeCoordinates[i], routeCoordinates[i+1]);
      if (traveled + segLen >= currentLength) {
        const segProgress = (currentLength - traveled) / segLen;
        const lat = routeCoordinates[i][0] + (routeCoordinates[i+1][0] - routeCoordinates[i][0]) * segProgress;
        const lng = routeCoordinates[i][1] + (routeCoordinates[i+1][1] - routeCoordinates[i][1]) * segProgress;
        return [lat, lng];
      }
      traveled += segLen;
    }
    return routeCoordinates[routeCoordinates.length - 1];
  };

  const agentPos = getAgentPosition();
  const remainingMins = Math.max(0, Math.round((1 - progress) * 25));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-[1000px] h-[80vh] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="h-[72px] px-6 border-b border-[#ECEDEF] flex items-center justify-between shrink-0 bg-white z-10">
              <div>
                <h2 className="text-[18px] font-bold text-[#111111]">Live Tracking</h2>
                <p className="text-[13px] text-[#525866]">Order {delivery?.id || '#DL-4918'}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E4E7EC] flex items-center justify-center transition-colors text-[#525866]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-[#E4E7EC] overflow-hidden">
              <MapContainer 
                center={[5.6000, -0.1700]} 
                zoom={13} 
                className="w-full h-full z-0"
                zoomControl={false}
                attributionControl={false}
              >
                {/* Light minimal map style */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                
                {/* Route Path Base */}
                <Polyline positions={routeCoordinates} color="#111111" weight={4} dashArray="10, 10" opacity={0.3} />
                
                {/* Highlighted Traveled Path */}
                <Polyline 
                  positions={[routeCoordinates[0], agentPos]} 
                  color="#D40073" 
                  weight={5} 
                  opacity={1}
                />

                {/* Pickup Marker */}
                <Marker position={routeCoordinates[0]} icon={pickupIcon}>
                  <Popup className="text-[12px] font-bold">Pickup</Popup>
                </Marker>

                {/* Dropoff Marker */}
                <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={dropoffIcon}>
                  <Popup className="text-[12px] font-bold">Destination</Popup>
                </Marker>

                {/* Moving Agent Marker */}
                <Marker position={agentPos} icon={agentIcon} />
              </MapContainer>

              {/* Delivery Info Overlay Panel */}
              <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[380px] bg-white rounded-[20px] p-6 border border-[#ECEDEF] z-[1000]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#D40073]/10 text-[#D40073] flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border border-[#D40073]/30 animate-ping" />
                      <Navigation size={20} className="transform rotate-45" />
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-[#111111]">In Transit</p>
                      <p className="text-[13px] font-medium text-[#16A34A] flex items-center gap-1">
                        <Clock size={12} />
                        {remainingMins} mins away
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[24px] font-bold text-[#111111]">3.2<span className="text-[14px] text-[#8B93A7] font-medium">km</span></p>
                  </div>
                </div>

                <div className="space-y-4 mb-6 relative">
                  <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-[#F3F4F6]" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-[#ECEDEF] flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#111111]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Origin</p>
                      <p className="text-[14px] font-medium text-[#111111] truncate max-w-[250px]">{delivery?.pickup || 'Accra Central Warehouse'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-[#D40073] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_0_2px_white]">
                      <div className="w-2 h-2 rounded-full bg-[#D40073]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#8B93A7] uppercase tracking-wider mb-0.5">Destination</p>
                      <p className="text-[14px] font-medium text-[#111111] truncate max-w-[250px]">{delivery?.dropoff || 'Osu, Oxford St'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#ECEDEF]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#525866]">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#111111]">{delivery?.customer || 'John Mensah'}</p>
                        <p className="text-[12px] text-[#525866]">Customer</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full h-[44px] flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#333333] text-white font-semibold text-[14px] rounded-[12px] transition-colors">
                    <Phone size={16} />
                    Call {delivery?.customer?.split(' ')[0] || 'Customer'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
