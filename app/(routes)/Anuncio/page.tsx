'use client';

import { useState } from "react";

// Define the type for form data
interface FormData {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  image: File | null;
}

// Define the type for published items
interface PublishedItem {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  image: File | null;
}

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    image: null,
  });

  const [publishedItems, setPublishedItems] = useState<PublishedItem[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
      });
      setUploadMessage("Archivo cargado con éxito!"); // Success message
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setUploadMessage(""); // Clear success message when file is removed
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const file = e.dataTransfer.files[0];
      setFormData({
        ...formData,
        image: file,
      });
      setUploadMessage("Archivo cargado con éxito!"); // Success message
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishedItems([...publishedItems, formData]);
    setFormData({
      title: "",
      startTime: "",
      endTime: "",
      description: "",
      image: null,
    });
    setUploadMessage(""); // Clear upload message after submit
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Generar anuncios</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Hora Inicio</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Hora Final</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Subir Imagen</label>
            <div
  className="w-full h-full p-4 border border-gray-300 rounded border-dashed flex items-center justify-center cursor-pointer"
  onClick={() => document.getElementById('fileInput')?.click()}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  <input
    id="fileInput"
    type="file"
    className="hidden"
    onChange={handleFileChange}
  />
  {!formData.image ? (
    <div className="flex flex-col items-center justify-center text-gray-500">
      <img src="/subir.png" alt="Image Icon" className="w-16 h-16 mb-2" />
      <p>Haz clic o arrastra una imagen aquí</p>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <img src={URL.createObjectURL(formData.image)} alt="Uploaded" className="w-16 h-16 mb-2" />
      <div className="flex items-center space-x-2">
        <p className="text-green-500">{formData.image.name}</p>
        <button
          type="button"
          onClick={handleRemoveFile}
          className="text-red-500"
        >
          X
        </button>
      </div>
    </div>
  )}
</div>


          </div>

          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E1BC00] text-white p-2 rounded"
          >
            Publicar
          </button>
        </form>
      </div>

      <div className="w-1/2 p-4 border-l border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Publicaciones Realizadas</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Título</th>
              <th className="px-4 py-2 border-b">Hora</th>
              <th className="px-4 py-2 border-b">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {publishedItems.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{item.title}</td>
                <td className="px-4 py-2 border-b">
                  {item.startTime} - {item.endTime}
                </td>
                <td className="px-4 py-2 border-b">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
