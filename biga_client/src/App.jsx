import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Inventory from './components/Inventory';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra Lateral Fija */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenido Principal (con margen a la izquierda para no taparse con el sidebar) */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
        </header>

        {/* Zona donde "inyectaremos" las vistas según el tab activo */}
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
          {activeTab === 'dashboard' && (
            <div className="text-center py-20">
              <h3 className="text-xl text-gray-600">Bienvenido a BIGA, Eduardo.</h3>
              <p className="text-gray-400">Selecciona una opción del menú para empezar.</p>
            </div>
          )}
          
          {activeTab === 'inventory' && <Inventory />}

          {/* Iremos agregando las demás vistas poco a poco */}
        </div>
      </main>
    </div>
  );
}

export default App;