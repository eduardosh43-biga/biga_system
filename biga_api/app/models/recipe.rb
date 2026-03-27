class Recipe < ApplicationRecord
    has_many :recipe_ingredients, dependent: :destroy
    has_many :ingredients, through: :recipe_ingredients
  
    def total_cost
      # Sumamos el costo de cada ingrediente basado en su último precio de lote
      recipe_ingredients.sum do |ri|
        # Buscamos el último precio registrado para ese ingrediente
        last_cost = ri.ingredient.inventory_batches.last&.cost_per_unit || 0
        ri.quantity * last_cost
      end
    end
  
    def margin
      price - total_cost
    end
  end