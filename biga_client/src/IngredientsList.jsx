import { useState,useEffect } from "react"

function IngredientsList() {
    const [ingredients, setIngredients] = useState([])
    const [error, setError] = useState(null)
    useEffect(() => {
        fetch("http://localhost:3000/api/v1/ingredients")
        .then(res => {
            if(!res.ok) {   
                throw new Error("Error en la conexión con el servidor")
            }
            return res.json()
        })
        .then(data => setIngredients(data))
        .catch(error => setError(error.message))
    }, [])
    if (error) return <div className="text-red-500">Eror: {error}</div>
    return (
        <div style={{padding: '20px',fontFamily: 'Arial, sans-serif'}}>
            <h1 className="text-2xl font-bold">🍕 Inventario de BIGA </h1>
            <table border="1" cellPadding="10" style={{width: '100%',bordercollapse: 'collapse'}} className="table-auto w-full">
                <thead>
                    <tr>
                        <th>Ingrediente</th>
                        <th>Stock</th>
                        <th>Unidad</th>
                        <th>Estado</th>
                     </tr>
                </thead>
            <tbody>
                {console.log("Ingredientes cargados:", ingredients)}
          {ingredients.map(ing => (
            <tr key={ing.id}>
              <td>{ing.name}</td>
              <td>{ing.stock}</td>
              <td>{ing.unit}</td>
              <td style={{ color: Number(ing.stock) <= Number(ing.minimum_stock) ? 'red' : 'green' }}>
                {Number(ing.stock) <= Number(ing.minimum_stock) ? '¡Reponer!' : 'OK'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}
export default IngredientsList;
