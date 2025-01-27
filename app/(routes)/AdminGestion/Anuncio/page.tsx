'use client';

import { useState, useEffect } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Toast, ToastAction } from "@/components/ui/toast";
import { PublishedItem } from "@/app/Interface/annoucement"; // Importar el tipo

import { AnnouncementForm } from "@/components/annoucementForm"; // Importar componente para el formulario
import { PublishedList } from "@/components/annoucementTable"; // Importar componente para la lista de anuncios

export default function FormPage() {
  const { toast } = useToast();
  const [publishedItems, setPublishedItems] = useState<PublishedItem[]>([]);

  // Obtener los anuncios desde la API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/annoucement")
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        if (Array.isArray(data.data)) { // Accede a la propiedad 'data' que contiene el array
          setPublishedItems(data.data);
        } else {
          console.error("La respuesta de la API no contiene un array:", data);
          setPublishedItems([]); // Establecer un array vacío en caso de error
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setPublishedItems([]); // Establecer un array vacío en caso de error
      });
  }, []);
  

  const addPublishedItem = (item: PublishedItem) => {
    setPublishedItems([...publishedItems, item]);
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Generar anuncios</h1>
        <AnnouncementForm addPublishedItem={addPublishedItem} />
      </div>

      <div className="w-1/2 p-4 border-l border-gray-300">
        <PublishedList publishedItems={publishedItems} /> 
      </div>
    </div>
  );
}
