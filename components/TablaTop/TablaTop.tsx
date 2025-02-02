'use client';



export default function TablaTop() {

  return (

    <div className="p-6 bg-[#EFEFEF]  space-y-8">
    <div className="flex justify-center items-center space-x-8">
    <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-red-800 rounded-full"></div>
        <span className="text-gray-700 font-semibold">Completado</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-amber-600 rounded-full"></div>
        <span className="text-gray-700 font-semibold">Reservado</span>
      </div>
     
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
        <span className="text-gray-700 font-semibold">En espera</span>
      </div>
    
    
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-white border-2 border-gray-700 rounded-full"></div>
        <span className="text-gray-700 font-semibold">Disponible</span>
      </div>

      
    </div>
  </div>

  
  );
}
