import { useState, useEffect } from "react";
import { PublishedItem } from "@/app/Interface/annoucement";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Dialog } from "@/components/ui/dialog"; // Usamos Dialog de shadcn
import { Button } from "@/components/ui/button";
import { Item } from "@radix-ui/react-select";

interface PublishedListProps {
  publishedItems: PublishedItem[];
}

export function PublishedList({ publishedItems }: PublishedListProps) {
  const [items, setItems] = useState<PublishedItem[]>(publishedItems);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<PublishedItem | null>(null);

  useEffect(() => {
    setItems(publishedItems);
  }, [publishedItems]);




  const handleDelete = (id: string | undefined) => {
    fetch(`http://127.0.0.1:8000/api/annoucement/${id}`, {
      method: "DELETE",
    }).then(response => {
      if (response.ok) {
        setItems(items.filter(item => item.id !== id)); // Eliminar el anuncio de la lista
      }
    });
  };

  const handleEdit = (item: PublishedItem) => {
    setEditItem(item); // Establecer el ítem a editar
    setShowModal(true); // Mostrar el modal de edición
  };

  const handleStatusToggle = (id: string | undefined) => {
    fetch(`http://127.0.0.1:8000/api/annoucement/updateStatus/${id}`, {
      method: "GET",
    }).then(response => {
      if (response.ok) {
       console.log("SE actualizo el status")
       
      }
    });
  };

  const handleSubmit = (updatedItem: PublishedItem) => {
    fetch(`http://127.0.0.1:8000/api/annoucement/${updatedItem.id}`, {
      method: "PUT", // Usamos PUT para actualizar
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    }).then(response => {
      if (response.ok) {
        setItems(items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
        setShowModal(false); // Cerrar el modal después de actualizar
      }
    });
  };

  return (
    <>
      {showModal && editItem && (
        <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Editar Anuncio</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editItem) {
                    handleSubmit(editItem);
                  }
                }}
              >
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium">Título</label>
                  <input
                    type="text"
                    id="title"
                    value={editItem.title}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium">Descripción</label>
                  <textarea
                    id="description"
                    value={editItem.description}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="mb-4" 
                       

                >
                  <label htmlFor="status" className="block text-sm font-medium">Estado</label>
                  <select
                    id="status"
                    value={editItem.status ? "Activo" : "Inactivo"}
                    onChange={(e) => setEditItem({ ...editItem, status: e.target.value === "Activo" })}
                    className="w-full mt-1 p-2 border rounded"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}

      {/* Tabla */}
      <table className="w-full table-fixed">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Imagen</th>
            <th className="px-4 py-2 border-b">Título</th>
            <th className="px-4 py-2 border-b">Descripción</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
             <td className="px-4 py-2 border-b mg-5 flex items-center justify-center">
  {item.image ? (
    <img
      src={`http://127.0.0.1:8000${item.image}`}
      alt={item.title}
      className="w-16 h-16 object-cover"
    />
  ) : (
    <span>No Image</span>
  )}
</td>
              <td className="px-4 py-2 border-b text-center">{item.title}</td>
              <td className="px-4 py-2 border-b text-center">{item.description}</td>
              <td className="px-4 py-2 border-b text-center">
                <Button
                  className={`px-4 py-2 rounded text-white ${item.status ? "bg-green-400" : "bg-gray-400"}`}
                  onClick={() => handleStatusToggle(item.id )}
                >
                  {item.status ? "Activo" : "Inactivo"}
                </Button>
              </td>
              <td className="px-4 py-2 border-b gap-2 text-center">
                <button onClick={() => handleEdit(item)} title="Editar">
                  <FaEdit className="text-blue-500" />
                </button>
                <button onClick={() => handleDelete(item.id)} title="Eliminar">
                  <FaTrashAlt className="text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
