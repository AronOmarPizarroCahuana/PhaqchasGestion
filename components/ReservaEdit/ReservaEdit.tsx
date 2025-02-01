import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Sport } from '../../app/Interface/sport';

interface ReservaMProps {
  field: string;
  timeStart: string;
  timeEnd: string;
  day: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    user_id: string;
    start_time: string;
    end_time: string;
    booking_date: string;
    yape: number;
    price: number;

    sport_id: number;
  }) => void;
  initialData: {
    booking_id:number;
    user_id: string;
    yape: number;
    price:number;
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
  timeStart,
  timeEnd,
  day,
  onClose,
  
  initialData,
}: ReservaMProps) {
  const [user_id, setUser_id] = useState(initialData.user_id || '');
  const [yape, setYape] = useState(initialData.yape || 0);
  const [sports, setSports] = useState<Sport[]>([]);
  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState(initialData.price);
  //const [booking_id, setbooking_id] = useState(initialData.booking_id);
  const formatTime = (time: string) => {
    const date = new Date('1970-01-01 ' + time);  // Usar una fecha arbitraria para convertir la hora
    return date.toTimeString().substring(0, 5);   // Extraer la hora en formato 24 horas (HH:mm)
  };
  
  
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/customer');
        const data = await response.json();
        setCustomers(data.data || []);
        setFilteredCustomers(data.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchSports = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/sport');
        const data = await response.json();
        setSports(data.data || []);
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };

    fetchCustomers();
    fetchSports();
  }, []);

  useEffect(() => {
    if (user_id) {
      const customer = customers.find((c) => c.id.toString() === user_id);
      if (customer) {
        setSelectedCustomer(customer);
        setPhoneSearch(customer.phone);
      }
    }
  }, [customers, user_id]);

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneSearch(value);
    if (value) {
      setFilteredCustomers(customers.filter((c) => c.phone.startsWith(value)));
    } else {
      setFilteredCustomers(customers);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setUser_id(customer.id.toString());
    setPhoneSearch(customer.phone);
    setFilteredCustomers([]);
  };

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sportId = Number(e.target.value);
    setSelectedSportId(sportId);
    const selectedSport = sports.find((s) => s.id === sportId);
    if (selectedSport) {
      const isMorning = timeStart.includes('AM');
      const price = isMorning ? selectedSport.price_morning : selectedSport.price_evening;
      setTotal(price || 0);
    }
  };


  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedSportId) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
  
    const requestData = {
      user_id: user_id,
      field_id: field,
      booking_date: day.toISOString().split('T')[0], 
      start_time: formatTime(timeStart),
      end_time: formatTime(timeEnd),
      yape,
      price,
      sport_id: selectedSportId,
    };
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/booking/${initialData.booking_id}`, { // Usa initialData.booking_id
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al guardar la reserva');
      }
  
      alert('Reserva guardada correctamente');
      onClose(); 
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al guardar la reserva.');
    }
  };
  
  
  const formatDateToString = (date: Date) => {
    return date.toLocaleDateString('en-CA');
  };

  const deleteReserva = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/booking/${initialData.booking_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al cancelar la reserva');
      }

      alert('Reserva cancelada correctamente');
      onClose(); // Cerrar el modal después de cancelar
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al cancelar la reserva.');
    }
  };

  return (
    <Dialog>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
          <h3 className="text-xl font-bold">Reserva para Campo {field}</h3>
          <p className="text-sm text-gray-600">Hora: {timeStart} - {timeEnd}</p>
          <p className="text-sm text-gray-600 mb-4">Día: { formatDateToString(day)}</p>
          <p className="mb-4 text-sm text-gray-600">Precio de la cancha: {total}</p>

          <div className="mb-4">
            <label className="block text-sm font-medium">Buscar por teléfono</label>
            <Input value={phoneSearch} onChange={handlePhoneSearch} placeholder="Número de teléfono" />
            {filteredCustomers.length > 0 && (
              <ul className="border rounded mt-2">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => handleCustomerSelect(customer)}
                    className="cursor-pointer hover:bg-gray-200 p-2"
                  >
                    {customer.phone} - {customer.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <Input value={selectedCustomer?.name || ''} disabled />
            <label className="block text-sm font-medium mt-2">DNI</label>
            <Input value={selectedCustomer?.dni || ''} disabled />
          </div>

         
          <div className="mb-4">
            <label className="block text-sm font-medium">Deporte</label>
            <select value={selectedSportId || ''} onChange={handleSportChange} className="w-full p-2 border rounded">
              <option value="">Seleccione un deporte</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          
          <div className="mb-4 flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Precio</label>
            <Input
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))}  
            />
          </div>
          <div>
            <label className="text-sm font-medium">Yape</label>
            <Input
              value={yape}
              onChange={(e) => setYape(Number(e.target.value))}  
            />
          </div>
        </div>


         
          <div className="flex justify-end">
            <Button onClick={deleteReserva} className="mr-2 bg-red-800 text-white">
              Cancelar Reserva
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 text-white">
              Guardar
            </Button>
            <Button onClick={onClose} className="bg-blue-600 text-white">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
