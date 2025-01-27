'use client';

import { useState, useEffect } from 'react';
import UserForm from './../../../../components/Roles/Insert-roles/insert-roles';
import UserTable from './../../../../components/Roles/Tabla-roles/Tabla-roles';
import EditUserModal from './../../../../components/Roles/edit-roles/edit-roles';

const AdminPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/admi');
        if (!response.ok) throw new Error('Error al obtener los usuarios');
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (formData: any) => {
    const newUser = {
      name: formData.nombre,
      surname: formData.apellido,
      password: formData.password, // Valor de la contraseña proporcionado por el formulario
      dni: formData.dni,
      phone: formData.telefono,
      status: formData.status, // Valor según lo especificado
      rol_id: formData.rol === 'Administrador' ? 1 : 2, // Rol en inglés
    };
  
    console.log("Form Data:", newUser); // Mostrar los datos antes de enviarlos
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Si la respuesta es exitosa, agregar el nuevo usuario al estado
        setUsers((prevUsers) => [...prevUsers, data]);
      } else {
        // Si la respuesta no es exitosa, mostrar el error detallado
        const errorMessage = data.message || 'Error desconocido';
        console.error('Error adding user:', errorMessage);
        alert(`Error: ${errorMessage}`); // Muestra una alerta con el error
      }
    } catch (error) {
      // Si hay un error en la solicitud, mostrarlo en la consola y una alerta
      console.error('Error adding user:', error);
      alert(`Error al intentar agregar el usuario: ${error || error}`);
    }
  };
  
  

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admi/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el usuario');

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleSaveUser = async (id: number, formData: any) => {
    const updatedUser = {
      name: formData.nombre,
      surname: formData.apellido,
      phone: formData.telefono,
      dni: formData.dni,
      rol_id: formData.rol_id,
      status: formData.status,
    };
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admi/updateAdmi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) throw new Error('Error al actualizar el usuario');
  
      const data = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, ...data } : user))
      );
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  return (
    <div className="p-8 space-y-8 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-blue-600 mb-2">Agregar nuevo usuario</h1>
        <UserForm onSubmit={handleAddUser} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Lista de usuarios con acceso al sistema</h2>
        <UserTable users={users} onDelete={handleDeleteUser} onEdit={handleEditUser} />
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;
