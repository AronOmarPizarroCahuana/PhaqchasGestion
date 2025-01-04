import React, { useState, useEffect } from 'react';

interface ReservaMProps {
  field: string;
  timeSlot: string;
  day: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    timeSlot: string,
    day: Date,
    name: string,
    yape: number,
    price: number,
    celular: string,
    dni: string
  ) => void;
  initialData: {
    name: string;
    yape: number;
    price: number;
    celular: string;
    dni: string;
  };
}

export default function ReservaM({
  field,
  timeSlot,
  day,
  isOpen,
  onClose,
  onSave,
  initialData
}: ReservaMProps) {
  const [name, setName] = useState(initialData.name);
  const [yape, setYape] = useState(initialData.yape);
  const [price, setPrice] = useState(initialData.price);
  const [celular, setCelular] = useState(initialData.celular);
  const [dni, setDni] = useState(initialData.dni);

  const handleSubmit = () => {
    onSave(timeSlot, day, name, yape, price, celular, dni);
  };

  useEffect(() => {
    setName(initialData.name);
    setYape(initialData.yape);
    setPrice(initialData.price);
    setCelular(initialData.celular);
    setDni(initialData.dni);
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Reserva para {field}</h3>
        <p className="mb-2 text-sm text-gray-600">Hora: {timeSlot}</p>
        <p className="mb-4 text-sm text-gray-600">Día: {day.toDateString()}</p>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre y Apellido</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input mt-1 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="yape" className="block text-sm font-medium text-gray-700">Yape</label>
          <input
            id="yape"
            type="number"
            value={yape}
            onChange={(e) => setYape(Number(e.target.value))}
            className="input mt-1 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="input mt-1 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="celular" className="block text-sm font-medium text-gray-700">Celular</label>
          <input
            id="celular"
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="input mt-1 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI (Opcional)</label>
          <input
            id="dni"
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="input mt-1 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button onClick={handleSubmit} className="btn bg-[#E1BC00] w-full p-2 bg-blue-500 text-white rounded mb-2">
          Guardar
        </button>
        <button onClick={onClose} className="btn bg-[#A9A8A5] w-full p-2 bg-gray-500 text-white rounded">
          Cancelar
        </button>
      </div>
    </div>
  );
}
