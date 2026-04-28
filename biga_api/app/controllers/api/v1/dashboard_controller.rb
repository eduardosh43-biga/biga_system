class Api::V1::DashboardController < ApplicationController
  def stats
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today.end_of_month

    # 1. Órdenes completadas
    all_completed = Order.where(status: 'completed', created_at: start_date..end_date)
    
    sales_orders = all_completed.where(order_type: ['mesa', 'recojo', 'delivery'])
    loss_orders = all_completed.where(order_type: ['merma', 'personal'])

    # 2. Ingresos (Ventas Reales)
    total_revenue = sales_orders.sum(:total_price)

    # 3. Costos con Lógica de Fallback
    total_sales_cost = calculate_items_cost(OrderItem.includes(:itemable).where(order_id: sales_orders.pluck(:id)))
    loss_by_merma = calculate_items_cost(OrderItem.includes(:itemable).where(order_id: loss_orders.where(order_type: 'merma').pluck(:id)))
    loss_by_personal = calculate_items_cost(OrderItem.includes(:itemable).where(order_id: loss_orders.where(order_type: 'personal').pluck(:id)))

    net_profit = total_revenue - total_sales_cost

    # 4. Top 5 Estrella
    sales_by_product = OrderItem.joins(:order)
                                .where(orders: { status: 'completed', created_at: start_date..end_date })
                                .group(:itemable_type, :itemable_id)
                                .select('itemable_type, itemable_id, SUM(quantity) as total_qty')
                                .order('total_qty DESC')

    top_products = sales_by_product.limit(5).map do |sp|
      item = sp.itemable_type.constantize.find_by(id: sp.itemable_id)
      { name: item&.name, quantity: sp.total_qty, type: sp.itemable_type }
    end

    # 5. Top Peores (Menos vendidos por categoría)
    worst_pizza = get_least_sold_data(sales_by_product, ['pizza'])
    worst_drink = get_least_sold_data(sales_by_product, ['bebida_casa', 'bebida_reventa'])
    worst_other = get_least_sold_data(sales_by_product, ['postre', 'entrada'])
    worst_promo = get_least_sold_promo_data(sales_by_product)

    # 6. Comparativa Mes Anterior
    prev_start = start_date - 1.month
    prev_end = end_date - 1.month
    prev_revenue = Order.where(status: 'completed', order_type: ['mesa', 'recojo', 'delivery'], created_at: prev_start..prev_end).sum(:total_price)

    avg_weekly_sales = total_revenue / (([ (end_date - start_date).to_i + 1, 7].max) / 7.0).ceil

    render json: {
      summary: {
        total_revenue: total_revenue.to_f.round(2),
        total_production_cost: total_sales_cost.to_f.round(2),
        net_profit: net_profit.to_f.round(2),
        loss_by_merma: loss_by_merma.to_f.round(2),
        loss_by_personal: loss_by_personal.to_f.round(2),
        total_loss: (loss_by_merma + loss_by_personal).to_f.round(2)
      },
      products: {
        top_5: top_products,
        worst_performers: [
          { category: 'Pizza', name: worst_pizza[:name], quantity: worst_pizza[:quantity] },
          { category: 'Bebida', name: worst_drink[:name], quantity: worst_drink[:quantity] },
          { category: 'Otros (Postres/Entradas)', name: worst_other[:name], quantity: worst_other[:quantity] },
          { category: 'Promoción', name: worst_promo[:name], quantity: worst_promo[:quantity] }
        ]
      },
      metrics: {
        avg_weekly_sales: avg_weekly_sales.to_f.round(2),
        growth_vs_prev_month: prev_revenue.zero? ? 0 : (((total_revenue - prev_revenue) / prev_revenue) * 100).round(2)
      }
    }
  end

  private

  def calculate_items_cost(items)
    items.sum do |item|
      if item.production_cost.to_f > 0
        item.production_cost.to_f
      else
        (item.itemable&.total_cost || 0) * item.quantity
      end
    end
  end

  def get_least_sold_data(sales_scope, categories)
    all_items = Recipe.where(category: categories)
    return { name: "N/A", quantity: 0 } if all_items.empty?

    # Buscar items con 0 ventas
    sold_item_ids = sales_scope.where(itemable_type: 'Recipe', itemable_id: all_items.pluck(:id)).pluck(:itemable_id)
    unsold_items = all_items.where.not(id: sold_item_ids)

    if unsold_items.any?
      return { name: unsold_items.first.name, quantity: 0 }
    end

    # Si todos se vendieron, buscar el de menor cantidad
    res = sales_scope.where(itemable_type: 'Recipe', itemable_id: all_items.pluck(:id)).reorder('total_qty ASC').first
    return { name: "N/A", quantity: 0 } unless res

    item = Recipe.find_by(id: res.itemable_id)
    { name: item&.name || "N/A", quantity: res.total_qty.to_f }
  end

  def get_least_sold_promo_data(sales_scope)
    all_promos = Promotion.all
    return { name: "N/A", quantity: 0 } if all_promos.empty?

    sold_promo_ids = sales_scope.where(itemable_type: 'Promotion').pluck(:itemable_id)
    unsold_promos = all_promos.where.not(id: sold_promo_ids)

    if unsold_promos.any?
      return { name: unsold_promos.first.name, quantity: 0 }
    end

    res = sales_scope.where(itemable_type: 'Promotion').reorder('total_qty ASC').first
    return { name: "N/A", quantity: 0 } unless res

    item = Promotion.find_by(id: res.itemable_id)
    { name: item&.name || "N/A", quantity: res.total_qty.to_f }
  end
end