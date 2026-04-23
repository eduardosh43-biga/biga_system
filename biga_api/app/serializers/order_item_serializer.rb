class OrderItemSerializer < ActiveModel::Serializer
  # Nota el cambio de nombre de la clase arriba ^
  attributes :id, :itemable_id, :itemable_type, :item_name, :quantity, :unit_price, :subtotal

  def item_name    
    object.itemable&.name || "Producto desconocido"
  end


  def subtotal
    object.subtotal
  end
end