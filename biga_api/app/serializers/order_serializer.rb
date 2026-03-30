class OrderSerializer < ActiveModel::Serializer
  attributes :id, :customer_name, :status, :total_price
end
