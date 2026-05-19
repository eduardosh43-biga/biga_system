class InventoryService
  def initialize(order)
    @order = order
  end

  def deduct_stock
    return unless @order.status == 'completed'

    ActiveRecord::Base.transaction do
      @order.order_items.each do |item|
        cost = calculate_and_deduct(item)
        item.update!(production_cost: cost)
      end
    end
  rescue StandardError => e
    Rails.logger.error "Error descontando inventario en Orden ##{@order.id}: #{e.message}"
    raise e # Re-lanzamos para que la transacción falle si es necesario
  end

  private

  def calculate_and_deduct(item)
    case item.itemable_type
    when 'Recipe'
      deduct_recipe_stock(item.itemable, item.quantity)
    when 'Promotion'
      deduct_promotion_stock(item.itemable, item.quantity)
    else
      0.0
    end
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
