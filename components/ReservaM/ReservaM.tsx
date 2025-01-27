import React, { useState, useEffect } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Sport } from '../../app/Interface/sport';

interface ReservaMProps {
  field: string;
  timeStart: string; // Este es el tiempo, por ejemplo, "08:00 AM - 09:00 AM"
  timeEnd: string;
  day: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { start_time: string, end_time: string, booking_date: string, user_id: string, yape: number, price: number }) => void;
  initialData: {
    user_id: string;
    yape: number;
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
  isOpen,
  onClose,
  onSave,
  initialData,
}: ReservaMProps) {
  const [user_id, setUser_id] = useState(initialData.user_id);
  const [yape, setYape] = useState(initialData.yape);
  const [sports, setSports] = useState<Sport[]>([]);
  const [status, setStatus] = useState<string>("en espera"); 
  const [total, setTotal] = useState(0); // Estado para el total

  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [price, setPrice] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const formatTime = (time: string) => {
    const date = new Date('1970-01-01 ' + time);  // Usar una fecha arbitraria para convertir la hora
    return date.toTimeString().substring(0, 5);   // Extraer la hora en formato 24 horas (HH:mm)
  };
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

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSportId(Number(e.target.value));
  };

  const fetchFieldPrice = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/field/${field}`);
      const data = await response.json();
      if (data?.data?.field) {
        const fieldData = data.data.field;
        const priceForTimeSlot = getPriceForTimeSlot(fieldData, timeStart);
      } else {
        console.error("Field data is not valid:", data);
      }
    } catch (error) {
      console.error('Error fetching field data:', error);
    }
  };

  // Fetch sports
  const fetchSports = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/sport');
      const data = await response.json();
      if (Array.isArray(data?.data)) {
        setSports(data.data);
      } else {
        console.error("Expected 'data' property to be an array, but got:", data);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  // useEffect to call both functions
  useEffect(() => {
    fetchFieldPrice();
    fetchSports();
  }, [field, timeStart]);

  useEffect(() => {
    if (selectedSportId) {
      const selectedSport = sports.find((sport) => sport.id === selectedSportId);
      if (selectedSport) {
        const priceForTimeSlot = getPriceForTimeSlot(selectedSport, timeStart);
        setTotal(priceForTimeSlot); 
      }
    }
  }, [selectedSportId, timeStart, sports]);

  const getPriceForTimeSlot = (sport: Sport, timeStart: string): number => {
    const isMorning = timeStart.includes("AM");
    const price: number | undefined = isMorning ? sport.price_morning : sport.price_evening;
  
    // Si price es undefined, devolvemos un valor por defecto, como "0"
    return price || 0;
  };
  
  

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setPhoneSearch(phoneValue);
    if (phoneValue.trim() === '') {
      setFilteredCustomers(customers); // Show all customers
      setSelectedCustomer(null); // Clear selected customer
      setUser_id(''); // Clear user id
    } else {
      // Reset selected customer if phone number changes
      if (selectedCustomer?.phone !== phoneValue) {
        setSelectedCustomer(null);
        setUser_id('');
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
    setFilteredCustomers([]);
  };

  const handleSubmit = async () => {
    if (yape < 0) {
      alert('El monto de Yape no puede ser negativo.');
      return;
    }


    const requestData = {
      user_id: user_id,
      field_id: field, // Assuming field_id is 3
      booking_date: day.toISOString().split('T')[0],
      start_time: formatTime(timeStart),
      end_time: formatTime(timeEnd),
      price: price,
      yape: yape,
      sport_id: selectedSportId ?? 1, // Using selected sport id
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
      onSave(requestData); // Llamada al callback con los datos actualizados

      onClose();
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
          <p className="mb-2 text-sm text-gray-600">Hora: {timeStart} - {timeEnd}</p>
          <p className="mb-4 text-sm text-gray-600">Día: {day.toDateString()}</p>
          <p className="mb-4 text-sm text-gray-600">Precio de la cancha: {total}</p>

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

        

          <div className="flex justify-between mb-4">
            <div>
              <label htmlFor="price" className="text-sm font-medium text-gray-700">Precio</label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                className="mt-1 p-2 w-20"
              />
            </div>
            <div>
              <label htmlFor="yape" className="text-sm font-medium text-gray-700">Yape</label>
              <Input
                id="yape"
                value={yape}
                onChange={(e) => setYape(Number(e.target.value))}
                type="number"
                className="mt-1 p-2 w-20"
              />
            </div>
            
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Deporte</label>
            <select
              onChange={handleSportChange}
              value={selectedSportId ?? ''}
              className="mt-1 w-full p-2 border bg-white"
            >
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          </div>
       

          <div className="flex justify-end">
            <Button onClick={onClose} className="mr-4">Cerrar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
