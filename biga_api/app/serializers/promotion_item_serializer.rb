class PromotionItemSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :recipe_name, :recipe_id, :recipe_price

  def recipe_name
    object.recipe&.name
  end

  def recipe_price
    object.recipe&.price
  end
end