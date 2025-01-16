'use client';

import { useState } from 'react';
import { format, startOfWeek, addWeeks, subWeeks,addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Tabla from '../Tabla/Tabla';
import TablaTop from '../TablaTop/TablaTop';
const fields = ['1', '2', '3', '4'];

export default function Booking() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const handlePreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const startDate = format(currentWeekStart, 'yyyy-MM-dd');
  const endDate = format(addDays(currentWeekStart, 6), 'yyyy-MM-dd');
  return (
    <div className="p-6 bg-[#EFEFEF] rounded-lg shadow-lg space-y-8">
     

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
        <div className="flex justify-between items-center bg-white">
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={handlePreviousWeek}
        >
          <span className='text-[10px] leading-3 md:text-md'>Semana Anterior</span>
        </button>
        <h2 className="text-xl font-semibold text-center flex-grow text-gray-700">
          {format(currentWeekStart, 'MMMM yyyy', { locale: es }).toUpperCase()}
        </h2>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={handleNextWeek}
        >
          Siguiente Semana
        </button>
      </div>
      <TablaTop></TablaTop>
            <Tabla field={field} startDate={startDate} endDate={endDate} currentWeekStart={currentWeekStart} />
          </div>
        ))}
      </div>
    </div>
  );
}

