const BASE_URL = 'http://localhost:3000/api/v1';

const api = async (endpoint, { method = 'GET', body = null, headers = {} } = {}) => {
  const token = localStorage.getItem('token');

  // 1. Configuramos los headers básicos
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // 2. Si hay token, lo ponemos. Si no, (como en el login), no pasa nada.
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Si mandamos datos (POST/PATCH), los convertimos a texto JSON automáticamente
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // 4. Gestión de errores global
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    // Retornamos la respuesta para que el componente la maneje
    return response;
  } catch (error) {
    console.error("Error en la petición API:", error);
    throw error;
  }
};

export default api;