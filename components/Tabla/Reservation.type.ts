export interface Reservation {
    name: string;
    yapeo: string;
    price: number;
    status?: string; // Asegúrate de que sea opcional (string | undefined)
    dni?: string;    // Asegúrate de que sea opcional (string | undefined)
    celular?: string;  // Asegúrate de que sea opcional (string | undefined)
  }