class IngredientSerializer < ActiveModel::Serializer
  attributes :id, :name, :unit, :stock, :minimum_stock, :near_expiry, :low_stock

  def near_expiry
    object.near_expiry
  end

  def low_stock
    object.low_stock
  end
end