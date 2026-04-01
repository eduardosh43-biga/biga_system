class PromotionSerializer < ActiveModel::Serializer
  attributes :id, :name, :sale_price, :description, :total_cost, :margin_percentage, :status_health

  # Incluimos los detalles de los items para saber qué pizzas lleva el combo
  has_many :promotion_items

  def total_cost
    object.total_cost
  end

  def margin_percentage
    object.margin_percentage
  end

  def status_health
    object.status_health
  end
end