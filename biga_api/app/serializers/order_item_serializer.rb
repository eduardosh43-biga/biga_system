class PromotionItemSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :item_name, :item_type, :unit_cost

  def item_name
    object.recipe&.name || object.ingredient&.name
  end

  def item_type
    object.recipe_id.present? ? 'Receta' : 'Ingrediente'
  end

  def unit_cost
    if object.recipe.present?
      object.recipe.total_cost
    else
      object.ingredient.inventory_batches.last&.cost_per_unit || 0
    end
  end
end
