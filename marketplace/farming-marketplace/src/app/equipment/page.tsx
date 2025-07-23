import React from 'react';
import useEquipment from '@/hooks/use-equipment';
import EquipmentCard from '@/components/ui/equipment-card';

const EquipmentPage = () => {
  const { equipmentList, loading, error } = useEquipment();

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Equipment</h1>
      {equipmentList.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No equipment available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentList.map((equipment) => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentPage;