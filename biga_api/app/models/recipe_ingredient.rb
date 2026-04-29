class RecipeIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :ingredient

  # Validaciones básicas
  validates :quantity, presence: true, numericality: { greater_than: 0 }

  delegate :name, :unit, to: :ingredient, prefix: true, allow_nil: true

  # def subtotal    
  #   last_batch = ingredient&.inventory_batches&.to_a&.last
  #   last_price = last_batch&.cost_per_unit || 0    
  #   (quantity.to_f * last_price.to_f).round(2)
  # end

  def subtotal
    return 0.0 unless ingredient
    (quantity.to_f * ingredient.latest_cost.to_f).round(2)
  end
end