class IngredientSerializer < ActiveModel::Serializer
  attributes :id, :name, :unit, :stock, :minimum_stock
end
