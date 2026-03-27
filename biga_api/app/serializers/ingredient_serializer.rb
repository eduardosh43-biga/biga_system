class IngredientSerializer < ActiveModel::Serializer
  attributes :id, :name, :unit, :stock, :minimum_stock, :expiry_date, :expiry_date
end
