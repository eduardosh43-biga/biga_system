class PromotionSerializer < ActiveModel::Serializer
  attributes :id, :name, :sale_price, :description, :category, 
             :total_cost, :margin_percentage, :status_health

  has_many :promotion_items
end