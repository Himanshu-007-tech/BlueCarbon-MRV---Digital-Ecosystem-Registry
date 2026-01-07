
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

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer center={center} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {submissions.map((sub) => (
          <Marker 
            key={sub.id} 
            position={[sub.location.lat, sub.location.lng]}
            icon={sub.status === SubmissionStatus.APPROVED ? greenIcon : blueIcon}
          >
            <Popup>
              <div className="p-1 max-w-[150px]">
                <img src={sub.imageUrl} alt="Sub" className="w-full h-24 object-cover rounded mb-2" />
                <h3 className="font-bold text-slate-800 text-sm">{sub.ecosystemType}</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  [{sub.location.lat.toFixed(4)}, {sub.location.lng.toFixed(4)}]
                </p>
                <p className="text-[10px] font-semibold mt-1">Status: {sub.status}</p>
                {sub.status === SubmissionStatus.APPROVED && (
                  <p className="text-xs text-emerald-600 font-bold">{sub.estimatedCarbon} Tons CO2</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
