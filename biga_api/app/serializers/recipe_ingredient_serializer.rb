class RecipeIngredientSerializer < ActiveModel::Serializer
  attributes :id, :ingredient_id, :quantity, :ingredient_name, :unit, :subtotal

  def ingredient_name
    object.ingredient&.name || "Insumo no encontrado"
  end

  def unit
    object.ingredient&.unit || "un"
  end

  def subtotal 
    object.subtotal
  end
end