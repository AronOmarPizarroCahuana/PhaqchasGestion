import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import ReservaM from '../ReservaM/ReservaM';
import TablaTop from '../TablaTop/TablaTop';
const timeSlots = [
  '7-8 AM', '8-9 AM', '9-10 AM', '10-11 AM', '11-12 AM', '12-1 PM',
  '1-2 PM', '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM', '6-7 PM',
  '7-8 PM', '8-9 PM', '9-10 PM'
];

interface TablaProps {
  field: string;
  currentWeekStart: Date;
}

export default function Tabla({ field, currentWeekStart }: TablaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    timeSlot: string;
    day: Date;
    name?: string;
    yape?: number;
    price?: number;
    celular?: string;
    dni?: string;
  } | null>(null);
  const [reservations, setReservations] = useState<
    Record<string, Record<string, { name: string; yape: number; price: number; celular?: string; dni?: string }>>
  >({});

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handleCellClick = (timeSlot: string, day: Date) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    const cellData = reservations[dayKey]?.[timeSlot];
    setModalData({
      timeSlot,
      day,
      name: cellData?.name || '',
      yape: cellData?.yape || 0,
      price: cellData?.price || 0,
      celular: cellData?.celular || '',
      dni: cellData?.dni || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleSaveReservation = (timeSlot: string, day: Date, name: string, yape: number, price: number, celular: string, dni: string) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    setReservations((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [timeSlot]: { name, yape, price, celular, dni },
      },
    }));
    handleCloseModal();
  };

  return (
    <div>
      <table className="table-fixed w-full text-sm  border-separate ">
        <thead className="bg-gray-100">
          <tr>
            <th className=" w-[6%] bg-[#EFEFEF] text-white"></th>
            <th className="border p-3 w-[6%] bg-[#5A6BA0] text-white">Hora</th>
            {days.map((day) => (
              <th key={day.toISOString()} className="border p-3 text-center bg-[#8D9EC1] text-white">
                <div>{format(day, 'eeee', { locale: es })}</div>
                <div>{format(day, 'd')}</div>
              </th>
            ))}
          </tr>
          <tr>
            <th className=" w-[10%] bg-[#EFEFEF] text-white"></th>
            <th className="border p-3 w-[10%] bg-[#5A6BA0] text-white">Detalle</th>
            {days.map((day) => (
              <th key={day.toISOString()} className="border p-3 text-center bg-[#8D9EC1] text-white">
                <div className="grid grid-cols-3 gap-1">
                  <div className="min-w-[100px]">Reserva</div>
                  <div className="min-w-[110px]">Yape</div>
                  <div className="min-w-[90px]">Precio</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot}>
              <td className="border p-3 w-[10%] bg-white">{field}</td>
              <td className="border p-3 w-[10%] bg-white">{timeSlot}</td>
              {days.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const cellData = reservations[dayKey]?.[timeSlot];
                const yape = cellData?.yape ?? 0;
                const price = cellData?.price ?? 0;

                // Determinamos el color de fondo según las condiciones
                let backgroundColor = 'bg-white'; // Valor predeterminado es blanco

                if (yape === 0 || price === 0) {
                  backgroundColor = 'bg-white'; // Si no tiene datos, blanco
                } else if (yape === price) {
                  backgroundColor = 'bg-[#FF6363]'; // Si Yape es igual a Precio, rojo
                } else {
                  backgroundColor = 'bg-[#ECCA1D]'; // Si no, amarillo
                }

                return (
                  <td
                  key={`${dayKey}-${timeSlot}`}
                  className={`border p-3 cursor-pointer text-center ${backgroundColor} text-white`}
                  onClick={() => handleCellClick(timeSlot, day)}
                >
                  {cellData ? (
                    <div className="grid grid-cols-3 gap-1">
                     <div className={`min-w-[100px] `}>
                      {cellData.name.split(' ')[0]} {/* Mostrar solo el primer nombre */}
                     </div>
                      <div className="min-w-[120px]">{cellData.yape}</div>
                      <div className="min-w-[100px]">{cellData.price}</div>
                    </div>
                  ) : (
                    <div className="text-gray-400"></div>
                  )}
                </td>
                
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalData && isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <ReservaM
              field={field}
              timeSlot={modalData.timeSlot}
              day={modalData.day}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveReservation}
              initialData={{
                name: modalData.name || '',
                yape: modalData.yape || 0,
                price: modalData.price || 0,
                celular: modalData.celular || '',
                dni: modalData.dni || ''
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
