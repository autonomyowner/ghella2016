import React from 'react';
import { Equipment } from '@/types/equipment';

interface EquipmentCardProps {
  equipment: Equipment;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{equipment.name}</h3>
      <p className="text-gray-600 mb-2">{equipment.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-green-600">${equipment.price}</span>
        <span className="text-sm text-gray-500">{equipment.category}</span>
      </div>
      {equipment.location && (
        <p className="text-sm text-gray-500 mt-2">📍 {equipment.location}</p>
      )}
      {equipment.condition && (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
          {equipment.condition}
        </span>
      )}
    </div>
  );
};

export default EquipmentCard; 