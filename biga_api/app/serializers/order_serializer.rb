class OrderSerializer < ActiveModel::Serializer
  attributes :id, :daily_id, :customer_name, :order_type, :delivery_fee, :total_price, :status, :created_at
  
  has_many :order_items
end

class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :unit_price, :subtotal, :item_name

  def item_name
    object.itemable&.name || "Producto"
  end

  def subtotal
    object.subtotal
  end
end