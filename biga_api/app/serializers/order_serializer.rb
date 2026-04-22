class OrderSerializer < ActiveModel::Serializer
  attributes :id, :customer_name, :status, :order_type, :delivery_fee, 
             :total_price, :payment_method, :table_number, :delivery_address, 
             :daily_id, :created_at
  
  has_many :order_items
end
