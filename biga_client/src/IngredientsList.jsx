import { useState, useEffect } from 'react';

function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  
  // Estado para la "Ficha Técnica" del nuevo insumo
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    stock: 0,           // Stock inicial (usualmente 0)
    minimum_stock: 0    // El punto de reorden
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/ingredients")
      .then(res => res.json())
      .then(data => setIngredients(data))
      .catch(err => console.error("Error cargando inventario:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convertimos a número si el input es de tipo number
    const val = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/v1/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredient: formData }),
    })
      .then(res => res.json())
      .then(newIng => {
        setIngredients([...ingredients, newIng]);
        // Resetear a valores iniciales
        setFormData({ name: '', unit: 'kg', stock: 0, minimum_stock: 0 });
      });
  };

  const deleteIngredient = (id) => {
    if (window.confirm("¿Deseas eliminar este insumo del catálogo de BIGA?")) {
      fetch(`http://localhost:3000/api/v1/ingredients/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            // Aplicamos el "colador" .filter()
            setIngredients(ingredients.filter(ing => ing.id !== id));
          }
        });
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center' }}>🍕 Maestro de Insumos - BIGA</h1>

      {/* FORMULARIO DE REGISTRO (MAESTRO) */}
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', flexWrap: 'wrap', gap: '15px', 
        background: '#f8f9fa', padding: '20px', borderRadius: '12px',
        border: '1px solid #dee2e6', marginBottom: '40px', alignItems: 'flex-end'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: '2' }}>
          <label style={{ fontWeight: '600', marginBottom: '5px' }}>Nombre del Insumo</label>
          <input name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="Ej: Harina 00" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
          <label style={{ fontWeight: '600', marginBottom: '5px' }}>Unidad</label>
          <select name="unit" value={formData.unit} onChange={handleChange} style={inputStyle}>
            <option value="kg">Kilogramos (kg)</option>
            <option value="g">Gramos (g)</option>
            <option value="unid">Unidades (unid)</option>
            <option value="l">Litros (l)</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
          <label style={{ fontWeight: '600', marginBottom: '5px' }}>Stock Mínimo</label>
          <input name="minimum_stock" type="number" value={formData.minimum_stock} onChange={handleChange} style={inputStyle} />
        </div>

        <button type="submit" style={{ 
          backgroundColor: '#e67e22', color: 'white', border: 'none', 
          padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          Registrar Insumo
        </button>
      </form>

      {/* TABLA DE INVENTARIO */}
      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#2d3436', color: 'white' }}>
          <tr>
            <th style={headerStyle}>Insumo</th>
            <th style={headerStyle}>Stock Total</th>
            <th style={headerStyle}>Unidad</th>
            <th style={headerStyle}>Estado</th>
            <th style={headerStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map(ing => {
            const lowStock = parseFloat(ing.stock) <= parseFloat(ing.minimum_stock);
            return (
              <tr key={ing.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={cellStyle}>{ing.name}</td>
                <td style={{ ...cellStyle, fontWeight: 'bold' }}>{ing.stock}</td>
                <td style={cellStyle}>{ing.unit}</td>
                <td style={{ ...cellStyle, color: lowStock ? '#d63031' : '#27ae60', fontWeight: 'bold' }}>
                  {lowStock ? '🚨 REPONER' : '✅ OK'}
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <button onClick={() => deleteIngredient(ing.id)} style={deleteBtnStyle}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


// Estilos rápidos
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ced4da' };
const headerStyle = { padding: '15px', textAlign: 'left' };
const cellStyle = { padding: '15px' };
const deleteBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' };

export default IngredientsList;