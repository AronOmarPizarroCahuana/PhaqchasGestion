import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublishedItem } from "@/app/Interface/annoucement";

interface AnnouncementFormProps {
  addPublishedItem: (item: PublishedItem) => void;
}

export function AnnouncementForm({ addPublishedItem }: AnnouncementFormProps) {
  const [formData, setFormData] = useState<PublishedItem>({
    title: "",
    description: "",
    image: null,
    status: true,
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append("status", formData.status.toString());

    try {
      const response = await fetch("http://127.0.0.1:8000/api/annoucement", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.image_url; // Asegúrate de que el backend devuelva `image_url`

        addPublishedItem({ ...formData, id: result.id });
        setFormData({ title: "", description: "", image: null, status: true });
        setUploadedImageUrl(imageUrl);
        alert("Anuncio publicado con éxito.");
      } else {
        throw new Error("Error al publicar el anuncio.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al intentar publicar el anuncio.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setUploadedImageUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg">
      
      <div>
        <Label className="block text-sm font-medium">Título</Label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Escribe el título del anuncio"
          required
        />
      </div>

      <div>
        <Label className="block text-sm font-medium">Subir Imagen</Label>
        <div
          className="w-full h-40 p-4 border border-gray-300 rounded border-dashed flex items-center justify-center cursor-pointer"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          {!formData.image ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <img
                src="/subir.png"
                alt="Image Icon"
                className="w-16 h-16 mb-2"
              />
              <p>Haz clic o arrastra una imagen aquí</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Uploaded"
                className="w-16 h-16 mb-2 object-cover"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                size="icon"
              >
                X
              </Button>
            </div>
          )}
        </div>
        {uploadedImageUrl && (
          <div className="mt-4">
            <p>Imagen subida:</p>
            <img
              src={uploadedImageUrl}
              alt="Uploaded URL"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium">Descripción</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
          placeholder="Escribe la descripción del anuncio"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="status"
          checked={formData.status}
          onChange={() =>
            setFormData({ ...formData, status: !formData.status })
          }
          id="status"
          className="w-4 h-4 border-gray-300 rounded"
        />
        <Label htmlFor="status" className="text-sm font-medium">
          Activo
        </Label>
      </div>

      <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
        Publicar
      </Button>
    </form>
  );
}
