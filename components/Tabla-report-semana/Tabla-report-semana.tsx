'use client';
import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Reservation, Day } from '../Tabla/Reservation';
import { Table } from '@/components/ui/table';
import ReservaM from "../ReservaM/ReservaM";
import ReservaEdit from "../ReservaEdit/ReservaEdit";
import { Skeleton } from "@/components/ui/skeleton";
interface TablaProps {
  field: string;
  currentWeekStart: any;
  startDate: string;
  endDate: string;
  id: string;
}

export default function Tabla({
  field,
  currentWeekStart,
  startDate,
  endDate,
  id,
}: TablaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    timeStart: string;
    timeEnd:string;
    day: Date;
    user_id?: string;
    yape?: number;
  } | null>(null);

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [Daysreservations, setDayReservations] = useState<Day[]>([]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handleCellClick = (timeStart: string,timeEnd:string, day: string, reservation: any) => {
    let contador = 0;

switch (day) {
  case "Lunes":
    contador = 0;
    break;
  case "Martes":
    contador = 1;
    break;
  case "Miércoles":
    contador = 2;
    break;
  case "Jueves":
    contador = 3;
    break;
  case "Viernes":
    contador = 4;
    break;
  case "Sábado":
    contador = 5;
    break;
  case "Domingo":
    contador = 6;
    break;
}
    const selectedDay = reservation
    console.log("Day before formatting:", days[contador]); // Verifica la estructura de 'day'
    console.log("rservacion",selectedDay)
  
   
    if (selectedDay && selectedDay.status!=="disponible" ) {

      setModalData({
        timeStart,
        timeEnd,
        day: days[contador],
        user_id: "",
        yape:  0,
      });

      setIsModalOpen(true);

    }
    else{
      console.log("no se pudo abrir el modal")
      console.log(selectedDay.status)
    }
  };
  
  
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };
 

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/bookingsForAdmi/${field}/${startDate}/${endDate}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const { data } = await response.json();
      setReservations(data);
      setDayReservations(data.da); // Ajusta 'data.da' según la estructura correcta
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [startDate, endDate, id]);

  const handleSaveReservation = (data: { user_id: string; yape: number; price: number; }) => {
    if (!modalData) return;

    const { timeStart, day } = modalData;

       // Verificar que 'day' sea un objeto Date válido
       if (!(day instanceof Date)) {
        console.error("La variable 'day' no es un objeto Date válido");
        return;
      }
    
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.hour_range?.start === timeStart
          ? {
              ...reservation,
              days: reservation.days.map((d) =>
                format(new Date(d.day_name), "eeee", { locale: es }) === format(day, "eeee", { locale: es })
                  ? {
                      ...d,
                      booking_details: {
                        id_user: data.user_id,
                        yape: data.yape,
                        price: data.price,
                        id: Date.now(),
                        user_name: "",
                      },
                    }
                  : d
              ),
            }
          : reservation
      )
    );

    handleCloseModal();
  };

 
  



  if (loading) 
   {
    return <div>cargando ..</div>
   }
  
  
  return (
    <div className="overflow-x-auto">
      <Table className="table-fixed w-full text-sm border-separate min-w-[1500px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-[5%]"></th>
            <th className="border p-3 bg-[#5A6BA0] text-white w-[10%]">Hora</th>
            {days.map((day) => (
              <th
                key={day.toISOString()}
                className="border p-3 text-center bg-[#8D9EC1] text-white"
              >
                <div>{format(day, "eeee", { locale: es })}</div>
                <div>{format(day, "d")}</div>
              </th>
            ))}
          </tr>
      
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td className="rotate-0 border text-center">CAMPO {field}</td>
              {reservation.hour_range && (
                <td className="border text-center">
                  {reservation.hour_range.start} - {reservation.hour_range.end}
                </td>
              )}
              {reservation.days.map((day, dayIndex) => {
                const status = day.status || "disponible";
                return (
                  <td
                    key={dayIndex}
                    className={`border px-4 py-2 text-xs ${status}`}
                    onClick={() => {
                      // Buscar el día correspondiente dentro de reservation.days
                      const selectedDay = reservation.days.find(d => d.day_name === day.day_name);

                      if (selectedDay) {
                        // Llamar a handleCellClick pasando el timeSlot, el día y la información del día seleccionado
                        handleCellClick(reservation.hour_range.start,reservation.hour_range.end, day.day_name, selectedDay);
                      } else {
                        console.log("No se encontró el día correspondiente en reservation.days");
                      }
                    }}
                                      >
                    {day.booking_details ? (
                      <div className=" justify-between text-center w-full">
                        <span>{day.booking_details.user_name}</span>
                       
                      </div>
                    ) : (
                      <div className="text-center">...</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>

      {modalData && isModalOpen && (
       
       <ReservaM
         field={field}
         timeStart={modalData.timeStart}
         timeEnd={modalData.timeEnd}
         day={modalData.day}
         isOpen={isModalOpen}
         onClose={handleCloseModal}
         onSave={handleSaveReservation}
          initialData={{
            user_id: modalData.user_id || "",
            yape: modalData.yape || 0,
          }}
        />
      )}
        
    </div>
  );
}
