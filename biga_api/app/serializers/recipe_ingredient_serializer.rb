class RecipeIngredientSerializer < ActiveModel::Serializer
  attributes :id, :ingredient_id, :quantity, :ingredient_name, :unit, :subtotal

  def ingredient_name
    object.ingredient&.name || "Insumo no encontrado"
  end

  def unit
    object.ingredient&.unit || "un"
  end

  def subtotal
    last_price = object.ingredient&.inventory_batches&.last&.cost_per_unit || 0
    (object.quantity.to_f * last_price.to_f).round(2)
  end
end