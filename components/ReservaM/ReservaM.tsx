import React, { useState, useEffect } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ReservaMProps {
  field: string;
  timeSlot: string; // Este es el tiempo, por ejemplo, "08:00 AM - 09:00 AM"
  day: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    timeSlot: string,
    day: Date,
    user_id: string,
    yape: number,
    price: number
  ) => void;
  initialData: {
    user_id: string;
    yape: number;
    price: number;
  };
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  dni: string;
}

export default function ReservaM({
  field,
  timeSlot,
  day,
  isOpen,
  onClose,
  onSave,
  initialData,
}: ReservaMProps) {
  const [user_id, setUser_id] = useState(initialData.user_id);
  const [yape, setYape] = useState(initialData.yape);
  const [price, setPrice] = useState(initialData.price);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/customer');
        const data = await response.json();
        if (Array.isArray(data?.data)) {
          setCustomers(data.data);
          setFilteredCustomers(data.data);
        } else {
          console.error("Expected 'data' property to be an array, but got:", data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Fetch field price
  useEffect(() => {
    const fetchFieldPrice = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/field/${field}`);
        const data = await response.json();
        if (data?.data?.field) {
          const fieldData = data.data.field;
          const priceForTimeSlot = getPriceForTimeSlot(fieldData, timeSlot);
          setPrice(priceForTimeSlot);
        }
      } catch (error) {
        console.error('Error fetching field data:', error);
      }
    };

    fetchFieldPrice();
  }, [field, timeSlot]);

  const getPriceForTimeSlot = (field: any, timeSlot: string): number => {
    const isMorning = timeSlot.includes("AM");
    return isMorning ? parseFloat(field.price_morning) : parseFloat(field.price_evening);
  };

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setPhoneSearch(phoneValue);
    if (phoneValue.trim() === '') {
      setFilteredCustomers(customers); // Mostrar todos los clientes
      setSelectedCustomer(null); // Limpiar la selección del cliente
      setUser_id(''); // Limpiar el id del usuario
      setIsEditable(true); // Hacer los campos editables
    } else {
      // Si el teléfono ingresado es diferente al seleccionado, resetea el cliente seleccionado
      if (selectedCustomer?.phone !== phoneValue) {
        setSelectedCustomer(null); // Limpiar el cliente seleccionado si cambia el valor
        setUser_id(''); // Limpiar el id de usuario
        setIsEditable(true); // Volver los campos editables
      }
      setFilteredCustomers(
        customers.filter((customer) => customer.phone.startsWith(phoneValue))
      );
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setUser_id(customer.id.toString());
    setPhoneSearch(customer.phone);
    setIsEditable(false);
    setFilteredCustomers([]);
  };

  const handleSubmit = async () => {
    if (yape < 0) {
      alert('El monto de Yape no puede ser negativo.');
      return;
    }
  
    const [startTime, endTime] = timeSlot.split(' - ').map((time) => {
      const [hour, period] = time.split(' ');
      let [h, m] = hour.split(':');
      if (period === 'PM' && parseInt(h) < 12) h = (parseInt(h) + 12).toString();
      if (period === 'AM' && parseInt(h) === 12) h = '00';
      return `${h}:${m}`;
    });
  
    const requestData = {
      user_id: Number(user_id), // Asegúrate de que user_id sea un número
      field_id: field, // Cambiar el field_id a 3 (como espera el backend)
      booking_date: day.toISOString().split('T')[0], // Mantén el formato de fecha YYYY-MM-DD
      start_time: startTime,
      end_time: endTime,
      status: 'reservado',
      total: Number(price), // Asegúrate de que price sea un número
    };
  
    console.log('Datos que se enviarán a la API:', requestData);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.statusText}, Details: ${JSON.stringify(errorData)}`);
      }
  
      const data = await response.json();
      console.log('Reserva guardada:', data);
      alert('Reserva guardada correctamente');
      onClose(); // Cerrar el modal después de guardar la reserva
    } catch (error) {
      console.error('Error al hacer la reserva:', error);
      alert('Hubo un problema al guardar la reserva. Por favor, intente nuevamente.');
    }
  };
  
  
  

  if (!isOpen) return null;

  return (
    <Dialog>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Reserva para Campo {field}</h3>
          <p className="mb-2 text-sm text-gray-600">Hora: {timeSlot}</p>
          <p className="mb-4 text-sm text-gray-600">Día: {day.toDateString()}</p>
          <p className="mb-4 text-sm text-gray-600">Precio: {price} S/</p>

          <div className="mb-4 relative">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Buscar por teléfono
            </label>
            <Input
              id="phone"
              type="text"
              value={phoneSearch}
              onChange={handlePhoneSearch}
              className="mt-1 w-full p-2 border border-gray-300 rounded "
              placeholder="Ingresa el número"
            />
            {phoneSearch && !loading && filteredCustomers.length > 0 && (
              <ul className="absolute top-full left-0 right-0 max-h-40 overflow-auto border bg-white mt-1 z-50">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => handleCustomerSelect(customer)}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {customer.phone}
                  </li>
                ))}
              </ul>
            )}
            {loading && <p className="text-sm text-gray-500 mt-2">Cargando clientes...</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <Input
              value={selectedCustomer?.name || ''}
              disabled
              className="mt-1 w-full p-2 border bg-gray-100"
            />
            <label className="block text-sm font-medium text-gray-700">DNI</label>
            <Input
              value={selectedCustomer?.dni || ''}
              disabled
              className="mt-1 w-full p-2 border bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="yape" className="block text-sm font-medium text-gray-700">Yape</label>
            <Input
              id="yape"
              type="number"
              value={yape}
              onChange={(e) => setYape(Number(e.target.value))}
              className="mt-1 w-full p-2 border"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full p-2 bg-blue-500 text-white rounded mb-2"
          >
            Guardar
          </Button>
          <Button
            onClick={onClose}
            className="w-full p-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
