class Recipe < ApplicationRecord

    TARGET_MARGINS = {
    'pizza' => 65,
    'bebida_reventa' => 30,
    'bebida_casa' => 75,
    'postre' => 60,
    'entrada' => 60
  }.freeze

    has_many :recipe_ingredients, dependent: :destroy
    has_many :ingredients, through: :recipe_ingredients
    has_many :promotion_items
    has_many :promotions, through: :promotion_items
    has_one_attached :image
    validates :category, inclusion: { in: TARGET_MARGINS.keys, message: "%{value} no es una categoría válida" }, allow_nil: true
    validates :name, presence: true, uniqueness: true
    validates :price, presence: true, numericality: { greater_than: 0 }    

    before_destroy :check_if_used_in_promotions  

  def target_margin
    TARGET_MARGINS[category] || 50
  end

  def total_cost
    @total_cost ||= recipe_ingredients.to_a.sum { |ri| ri.subtotal }
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
  

  private
  
  def check_if_used_in_promotions
    if promotion_items.any?
      errors.add(:base, "No puedes borrar esta receta porque es parte de una promoción activa. Quítala primero del combo.")
      throw(:abort)
    end
  end

end