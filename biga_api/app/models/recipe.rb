class Recipe < ApplicationRecord
    has_many :recipe_ingredients, dependent: :destroy
    has_many :ingredients, through: :recipe_ingredients
    has_one_attached :image
  
    validates :name, presence: true, uniqueness: true
    validates :price, presence: true, numericality: { greater_than: 0 }

    def target_margin
        case category
        when 'pizza' then 65
        when 'bebida_reventa' then 30
        when 'bebida_casa' then 75
        else 50
        end
      end
  
    # Calcula el costo sumando el último precio de cada ingrediente
    def total_cost
      recipe_ingredients.includes(ingredient: :inventory_batches).sum do |ri|
        next 0 if ri.ingredient.nil? 
        
        last_batch = ri.ingredient.inventory_batches.last
        last_price = last_batch&.cost_per_unit || 0
        ri.quantity.to_f * last_price.to_f
      end.to_f.round(2)
    end

    def status_health
        margin_percentage >= target_margin ? 'rentable' : 'revisar_costos'
      end
  
    # Calcula cuánto dinero te queda en el bolsillo después de costos
    def profit_margin
      price - total_cost
    end
  
    # Porcentaje de ganancia (Para saber si estás en el 70% ideal)
    def margin_percentage
      return 0 if price.zero? || price.to_f.zero?
      ((profit_margin / price) * 100).round(2)
    end
  end