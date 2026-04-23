class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items, allow_destroy: true

  validates :order_type, presence: true, inclusion: { in: %w[mesa recojo delivery merma personal] }
  validates :status, inclusion: { in: %w[pending ready completed cancelled] }
  
  before_create :set_daily_id
  before_save :calculate_total

  after_update :handle_inventory_deduction, if: :saved_change_to_status?

  def calculate_total
    items_total = order_items.map { |item| item.unit_price.to_f * item.quantity }.sum
    self.total_price = items_total + (delivery_fee || 0).to_f
  end

  private

  def set_daily_id
    # Busca la última orden de hoy y le suma 1 al contador
    last_order_today = Order.where("created_at >= ?", Time.zone.now.beginning_of_day).last
    self.daily_id = last_order_today ? last_order_today.daily_id + 1 : 1
  end

  def handle_inventory_deduction
    return unless status == 'completed'

    ActiveRecord::Base.transaction do
      order_items.each do |item|
        if item.itemable_type == 'Recipe'
          deduct_recipe_stock(item.itemable, item.quantity)
        elsif item.itemable_type == 'Promotion'
          deduct_promotion_stock(item.itemable, item.quantity)
        end
      end
    end
  rescue StandardError => e
    Rails.logger.error "Error descontando inventario en Orden ##{id}: #{e.message}"    
  end

  # Caso A: Descontar una Pizza (Receta)
  def deduct_recipe_stock(recipe, multiplier)
    recipe.recipe_ingredients.each do |ri|
      total_to_deduct = ri.quantity * multiplier
      ri.ingredient.subtract_stock(total_to_deduct)
    end
  end

  # Caso B: Descontar una Promoción
  def deduct_promotion_stock(promotion, promo_multiplier)
    promotion.promotion_items.each do |pi|
      if pi.recipe
        # Si el item del combo es una pizza
        deduct_recipe_stock(pi.recipe, pi.quantity * promo_multiplier)
      elsif pi.ingredient
        # Si el item del combo es un ingrediente directo (ej: una lata de gaseosa)
        pi.ingredient.subtract_stock(pi.quantity * promo_multiplier)
      end
    end
  end
end
