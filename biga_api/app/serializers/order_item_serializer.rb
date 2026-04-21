class OrderItemSerializer < ActiveModel::Serializer
  # Nota el cambio de nombre de la clase arriba ^
  attributes :id, :itemable_id, :itemable_type, :item_name, :quantity, :unit_price, :subtotal

  def item_name
    # Gracias al polimorfismo, esto traerá el nombre 
    # ya sea de la Receta o de la Promoción
    object.itemable&.name || "Producto desconocido"
  end

  def subtotal
    # Llama al método que creamos en el modelo OrderItem
    object.subtotal
  end
end