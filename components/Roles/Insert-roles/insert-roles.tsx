import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { API_URL } from "../../../config";

const roles = ['Administrador', 'Trabajador'];
const statuses = ['Activo', 'Inactivo'];

type FormData = {
  name: string;
  surname: string;
  phone: string;
  dni: string;
  rol_id: number;
  birth_date: string;
  status: number;
  password: string;
};

interface UserFormProps {
  onSubmit: (formData: FormData) => void;
  reloadAnnouncements: () => void;
}

const UserForm = ({ onSubmit, reloadAnnouncements }: UserFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    phone: '',
    dni: '',
    rol_id: 1,
    status: 1,
    password: '',
    birth_date: '',

  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: 'rol_id' | 'status', value: string) => {
    const parsedValue = field === 'rol_id' 
      ? value === 'Administrador' ? 1 : 2 
      : value === 'Activo' ? 1 : 0;
    setFormData((prev) => ({ ...prev, [field]: parsedValue }));
  };
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const contentType = response.headers.get("content-type");
  
      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
  
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage += `: ${errorData.message || "Unknown error"}`;
        } else {
          const errorText = await response.text();
          errorMessage += `: ${errorText.substring(0, 100)}...`; // Muestra solo los primeros 100 caracteres
        }
  
     
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      onSubmit(data);
      reloadAnnouncements();
      setFormData({
        name: '',
        surname: '',
        phone: '',
        dni: '',
        rol_id: 1,
        status: 1,
        password: '',
        birth_date: '',

      });
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };
  

  return (
    <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre" />
      </div>

      <div>
        <Label htmlFor="surname">Apellido</Label>
        <Input id="surname" name="surname" value={formData.surname} onChange={handleInputChange} placeholder="Apellido" />
      </div>

      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Teléfono" />
      </div>

      <div>
        <Label htmlFor="dni">DNI</Label>
        <Input id="dni" name="dni" value={formData.dni} onChange={handleInputChange} placeholder="DNI" />
      </div>

      <div>
        <Label htmlFor="rol">Rol</Label>
        <Select onValueChange={(value) => handleSelectChange('rol_id', value)} defaultValue={roles[0]}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Estado</Label>
        <Select onValueChange={(value) => handleSelectChange('status', value)} defaultValue={statuses[0]}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Estado" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Contraseña" />
      </div>
      <div>
        <Label htmlFor="birth_date">Fecha de nacimiento</Label>
        <Input id="birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleInputChange} placeholder="birth_date" />
      </div>

      <div className="col-span-2">
        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-500 mt-4">
          Registrar Usuario
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
