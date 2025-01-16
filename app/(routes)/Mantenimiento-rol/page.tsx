'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const roles = ['Admin', 'Editor', 'Viewer']; // Opciones de roles

const AdminPage = () => {
  const [users, setUsers] = useState<
    {
      id: number;
      nombre: string;
      telefono: string;
      dni: string;
      username: string;
      rol: string;
      password: string;
    }[]
  >([
    // Datos de prueba
    {
      id: 1,
      nombre: 'Juan Pérez',
      telefono: '987654321',
      dni: '12345678',
      username: 'juan.perez',
      rol: 'Admin',
      password: 'admin123',
    },
    {
      id: 2,
      nombre: 'Ana Gómez',
      telefono: '912345678',
      dni: '87654321',
      username: 'ana.gomez',
      rol: 'Editor',
      password: 'editor456',
    },
    {
      id: 3,
      nombre: 'Luis Torres',
      telefono: '954321987',
      dni: '56781234',
      username: 'luis.torres',
      rol: 'Viewer',
      password: 'viewer789',
    },
  ]);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    dni: '',
    username: '',
    rol: 'Admin',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rol: value }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers((prevUsers) => [...prevUsers, { ...formData, id: Date.now() }]);
    setFormData({
      nombre: '',
      telefono: '',
      dni: '',
      username: '',
      rol: 'Admin',
      password: '',
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100">
      {/* Formulario */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-blue-600 mb-2">Agregar nuevo usuario</h1>
        <p className="text-sm text-gray-500 mb-6">Complete todos los campos para registrar nuevo administrador</p>
        <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre y Apellidos</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre y Apellidos"
            />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono"
            />
          </div>
          <div>
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              placeholder="DNI"
            />
          </div>
          <div>
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nombre de Usuario"
            />
          </div>
          <div>
            <Label htmlFor="rol">Rol</Label>
            <Select onValueChange={handleSelectChange} defaultValue={formData.rol}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar Rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Contraseña"
            />
          </div>
          <div className="col-span-2">
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-500 mt-4">
              Registrar Usuario
            </Button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Lista de usuarios con acceso al sistema</h2>
        <Table>
          <thead>
            <tr className="bg-blue-600 text-white">
              <th>DNI</th>
              <th>Nombres</th>
              <th>Rol</th>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td>{user.dni}</td>
                <td>{user.nombre}</td>
                <td>{user.rol}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td className="flex justify-center gap-2">
                  <Button
                    variant="secondary"
                    className="text-sm bg-yellow-500 text-white"
                    onClick={() => console.log('Editar', user.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-sm bg-red-600 text-white"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPage;
