
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Submission, SubmissionStatus } from '../types';
import * as L from 'leaflet';

// Leaflet markers
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const blueIcon = new L.Icon({
  iconUrl, 
  shadowUrl, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34], 
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34], 
  shadowSize: [41, 41]
});

interface MapViewProps {
  submissions: Submission[];
}

export const MapView: React.FC<MapViewProps> = ({ submissions }) => {
  const center: [number, number] = submissions.length > 0 
    ? [submissions[0].location.lat, submissions[0].location.lng]
    : [10.8505, 76.2711];

  // Using Google Maps Satellite/Hybrid tiles
  // Note: Standard Google Maps tiles are mt0, mt1, mt2, mt3
  // lyrs: s=Satellite, y=Hybrid, m=Standard, p=Terrain
  const googleMapsUrl = "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-white/5">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; Google Maps Satellite'
          url={googleMapsUrl}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
        {submissions.map((sub) => (
          <Marker 
            key={sub.id} 
            position={[sub.location.lat, sub.location.lng]}
            icon={sub.status === SubmissionStatus.APPROVED ? greenIcon : blueIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 max-w-[180px] bg-slate-900 text-white rounded-lg">
                <img src={sub.imageUrl} alt="Sub" className="w-full h-24 rounded-md object-cover mb-3 border border-white/10" />
                <h3 className="font-black italic text-cyan-400 text-sm uppercase tracking-tight">{sub.ecosystemType}</h3>
                <p className="text-[9px] text-slate-400 font-mono mt-1 uppercase tracking-widest">
                  {sub.location.region}
                </p>
                <div className="mt-3 flex justify-between items-center border-t border-white/10 pt-2">
                   <span className="text-[10px] font-black uppercase text-white/50">{sub.status}</span>
                   {sub.status === SubmissionStatus.APPROVED && (
                     <span className="text-xs text-emerald-400 font-black">{sub.estimatedCarbon}t</span>
                   )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
