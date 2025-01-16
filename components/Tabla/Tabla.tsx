import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import ReservaM from "../ReservaM/ReservaM";
import { DataItem } from "./DataItem";
import { Table } from '@/components/ui/table';

interface TablaProps {
  field: string;
  currentWeekStart: Date;
  startDate: any;
  endDate: any;
  id: any;
}

export default function Tabla({
  field,
  currentWeekStart,
  startDate,
  endDate,
  id,
}: TablaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  const [modalData, setModalData] = useState<{
    timeSlot: string;
    day: Date;
    user_id?: string;
    yape?: number;
    price?: number;
   
  } | null>(null);
  const [reservations, setReservations] = useState<
    Record<
      string,
      Record<
        string,
        {
          user_id: string;
          yape: number;
          price: number;
         
        }
      >
    >
  >({});

  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const handleCellClick = (timeSlot: string, day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd");
    const cellData = reservations[dayKey]?.[timeSlot];
    setModalData({
      timeSlot,
      day,
      user_id: cellData?.user_id || "",
      yape: cellData?.yape || 0,
      price: cellData?.price || 0,
    
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    fetchDatos(); 
  };

  const fetchDatos = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/test1/${field}/${startDate}/${endDate}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setData(data);
      console.log(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDatos(); // Llamada a fetchDatos cuando cambian las fechas
  }, [startDate, endDate, id]);
  
  const handleSaveReservation = (
    timeSlot: string,
    day: Date,
    user_id: string,
    yape: number,
    price: number,
  ) => {
    const dayKey = format(day, "yyyy-MM-dd");
    setReservations((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [timeSlot]: { user_id, yape, price },
      },
    }));
    handleCloseModal();
    // Recargar los datos inmediatamente después de guardar
  };
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  function getColorClass(value: string) {
    switch (value) {
      case "Disponible":
        return "bg-white text-black";
      case "Reservado":
        return "bg-red-800 text-white";
      default:
        return "bg-gray-800";
    }
  }

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-x-auto" >
      <Table className="table-fixed w-full text-sm  border-separate min-w-[1500px] w-fulls" >
        <thead className="bg-gray-100">
          <tr>
            <th className="w-[5%]"></th>
            <th className="border p-3 bg-[#5A6BA0] text-white w-[9%]">Hora</th>
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
          <tr>
            <th className=" w-[10%] bg-[#EFEFEF] text-white"></th>
            <th className="border p-3 w-[10%] bg-[#5A6BA0] text-white">
              Detalle
            </th>
            {days.map((day) => (
              <th
                key={day.toISOString()}
                className="border py-3 text-center bg-[#8D9EC1] text-white "
              >
                <div className="flex justify-around text-xs">
                  <span className="">Reserva</span>
                  <span className="">Yape</span>
                  <span className="">Precio</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
            

<td className="rotate-0 border text-center ">CAMPO {field}
</td>
              <td className="border px-4 py-2 text-xs">{item.hour}</td>
              <td
                className={`border px-4 py-2 text-xs ${getColorClass(
                  item.Lunes_status
                )}`}
                onClick={() => handleCellClick(item.hour, days[0],)}
              >
                {item.Lunes_user_name ? (
                  <div className="flex justify-between items-center w-full ">
                    <span>{item.Lunes_user_name}</span>
                    <span>{item.Lunes_yape}</span>
                    <span>{item.Lunes_total}</span>
                  </div>
                ) : (
                  <div className=" text-center">Disponible</div>
                )}
              </td>
              <td
                className={`border px-4 py-2 text-xs ${getColorClass(
                  item.Martes_status
                )}`}
                onClick={() => handleCellClick(item.hour, days[1])}
              >
                {item.Martes_user_name ? (
                  <div className="flex justify-between items-center w-full ">
                    <span>{item.Martes_user_name}</span>
                    <span>{item.Martes_yape}</span>
                    <span>{item.Martes_total}</span>
                  </div>
                ) : (
                  <div className=" text-center">Disponible</div>
                )}
              </td>
              <td
                className={`border px-4 py-2 text-xs ${getColorClass(
                  item.Miercoles_status
                )}`}
                onClick={() => handleCellClick(item.hour, days[2])}
              >
                {item.Miercoles_user_name ? (
                  <div className="flex justify-between items-center w-full ">
                    <span>{item.Miercoles_user_name}</span>
                    <span>{item.Miercoles_yape}</span>
                    <span>{item.Miercoles_total}</span>
                  </div>
                ) : (
                  <div className=" text-center">Disponible</div>
                )}
              </td>
              <td
                className={`border px-4 py-2 text-xs ${getColorClass(
                  item.Jueves_status
                )}`}
                onClick={() => handleCellClick(item.hour, days[3])}
              >
                {item.Jueves_user_name ? (
                  <div className="flex justify-between items-center w-full ">
                    <span>{item.Jueves_user_name}</span>
                    <span>{item.Jueves_yape}</span>
                    <span>{item.Jueves_total}</span>
                  </div>
                ) : (
                  <div className=" text-center">Disponible</div>
                )}
              </td>
              <td
                className={`border px-4 py-2 text-xs ${getColorClass(
                  item.Viernes_status
                )}`}
                onClick={() => handleCellClick(item.hour, days[4])}
              >
                {item.Viernes_user_name ? (
                  <div className="flex justify-between items-center w-full ">
                    <span>{item.Viernes_user_name}</span>
                    <span>{item.Viernes_yape}</span>
                    <span>{item.Viernes_total}</span>
                  </div>
                ) : (
                  <div className=" text-center">Disponible</div>
                )}
              </td>
              <td
                className={`border px-4 py-2 text-xs ${getColorClass(
                  item.Sabado_status
                )}`}
                onClick={() => handleCellClick(item.hour, days[5])}
              >
                {item.Sabado_user_name ? (
                  <div className="flex justify-between items-center w-full ">
                    <span>{item.Sabado_user_name}</span>
                    <span>{item.Sabado_yape}</span>
                    <span>{item.Sabado_total}</span>
                  </div>
                ) : (
                  <div className=" text-center">Disponible</div>
                )}
              </td>
              <td
                className={`border px-4 py-2 text-xs ${getColorClass(
                  item.Domingo_status
                )}`}
                onClick={() => handleCellClick(item.hour, days[6])}
              >
                {item.Domingo_user_name ? (
                  <div className="flex justify-between items-center w-full ">
                    <span>{item.Domingo_user_name}</span>
                    <span>{item.Domingo_yape}</span>
                    <span>{item.Domingo_total}</span>
                  </div>
                ) : (
                  <div className=" text-center">Disponible</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

     
      {modalData && isModalOpen && (
       
            <ReservaM
              field={field}
              timeSlot={modalData.timeSlot}
              day={modalData.day}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveReservation}
              initialData={{
                user_id: modalData.user_id || "",
                yape: modalData.yape || 0,
                price: modalData.price || 0,
                
              }}
            />
        
      )}
    </div>
  );
}
