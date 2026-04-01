class Recipe < ApplicationRecord
    has_many :recipe_ingredients, dependent: :destroy
    has_many :ingredients, through: :recipe_ingredients
    has_many :promotion_items
    has_many :promotions, through: :promotion_items
    has_one_attached :image

    validates :name, presence: true, uniqueness: true
    validates :price, presence: true, numericality: { greater_than: 0 }

    before_destroy :check_if_used_in_promotions

    # 1. Definimos la constante al principio (Fácil de editar para el verano 2026)
  TARGET_MARGINS = {
    'pizza' => 65,
    'bebida_reventa' => 30,
    'bebida_casa' => 75,
    'cremolada' => 70, # Para tu máquina de cremoladas
    'entrada' => 60
  }.freeze

  validates :name, presence: true, uniqueness: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  # Validamos que la categoría esté en nuestra lista
  validates :category, inclusion: { in: TARGET_MARGINS.keys, message: "%{value} no es una categoría válida" }, allow_nil: true

  # 2. El método simplificado (No cambia el resultado, solo es más limpio)
  def target_margin
    TARGET_MARGINS[category] || 50
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

  private
  
  def check_if_used_in_promotions
  if promotion_items.any?
    errors.add(:base, "No puedes borrar esta receta porque es parte de una promoción activa. Quítala primero del combo.")
    throw(:abort)
  end
end