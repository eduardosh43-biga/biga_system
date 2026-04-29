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
        cost = 0.0
        if item.itemable_type == 'Recipe'
          cost = deduct_recipe_stock(item.itemable, item.quantity)
        elsif item.itemable_type == 'Promotion'
          cost = deduct_promotion_stock(item.itemable, item.quantity)
        end
        item.update!(production_cost: cost)
      end
    end
  rescue StandardError => e
    Rails.logger.error "Error descontando inventario en Orden ##{id}: #{e.message}"    
  end

  # Caso A: Descontar una Pizza (Receta)
  def deduct_recipe_stock(recipe, multiplier)
    total_recipe_cost = 0.0
    recipe.recipe_ingredients.each do |ri|
      amount_to_subtract = ri.quantity * multiplier
      total_recipe_cost += ri.ingredient.subtract_stock(amount_to_subtract)
    end
    total_recipe_cost
  end

  # Caso B: Descontar una Promoción
  def deduct_promotion_stock(promotion, promo_multiplier)
    total_promo_cost = 0.0
    promotion.promotion_items.each do |pi|
      if pi.recipe
        # Si el item del combo es una pizza
        total_promo_cost += deduct_recipe_stock(pi.recipe, pi.quantity * promo_multiplier)
      elsif pi.ingredient
        # Si el item del combo es un ingrediente directo (ej: una lata de gaseosa)
        amount_to_subtract = pi.quantity * promo_multiplier
        total_promo_cost += pi.ingredient.subtract_stock(amount_to_subtract)
      end
    end
    total_promo_cost
  end
end
