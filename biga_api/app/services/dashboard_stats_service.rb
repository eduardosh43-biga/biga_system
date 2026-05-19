class DashboardStatsService
  def initialize(start_date: nil, end_date: nil)
    @start_date = start_date ? Date.parse(start_date.to_s) : Date.today.beginning_of_month
    @end_date = end_date ? Date.parse(end_date.to_s) : Date.today.end_of_month
  end

  def call
    {
      summary: summary_stats,
      products: product_stats,
      metrics: performance_metrics
    }
  end

  private

  def summary_stats
    all_completed = Order.where(status: 'completed', created_at: @start_date..@end_date)
    sales_orders = all_completed.where(order_type: ['mesa', 'recojo', 'delivery'])
    loss_orders = all_completed.where(order_type: ['merma', 'personal'])

    total_revenue = sales_orders.sum(:total_price)
    total_sales_cost = calculate_items_cost(OrderItem.includes(:itemable).where(order_id: sales_orders.pluck(:id)))
    loss_by_merma = calculate_items_cost(OrderItem.includes(:itemable).where(order_id: loss_orders.where(order_type: 'merma').pluck(:id)))
    loss_by_personal = calculate_items_cost(OrderItem.includes(:itemable).where(order_id: loss_orders.where(order_type: 'personal').pluck(:id)))

    net_profit = total_revenue - total_sales_cost

    {
      total_revenue: total_revenue.to_f.round(2),
      total_production_cost: total_sales_cost.to_f.round(2),
      net_profit: net_profit.to_f.round(2),
      loss_by_merma: loss_by_merma.to_f.round(2),
      loss_by_personal: loss_by_personal.to_f.round(2),
      total_loss: (loss_by_merma + loss_by_personal).to_f.round(2)
    }
  end

  def product_stats
    sales_by_product = OrderItem.joins(:order)
                                .where(orders: { status: 'completed', created_at: @start_date..@end_date })
                                .group(:itemable_type, :itemable_id)
                                .select('itemable_type, itemable_id, SUM(quantity) as total_qty')
                                .order('SUM(quantity) DESC')

    top_products = sales_by_product.limit(5).map do |sp|
      item = sp.itemable_type.constantize.find_by(id: sp.itemable_id)
      { name: item&.name, quantity: sp.total_qty.to_f, type: sp.itemable_type }
    end

    {
      top_5: top_products,
      worst_performers: [
        { category: 'Pizza', **get_least_sold_data(['pizza']) },
        { category: 'Bebida', **get_least_sold_data(['bebida_casa', 'bebida_reventa']) },
        { category: 'Otros (Postres/Entradas)', **get_least_sold_data(['postre', 'entrada']) },
        { category: 'Promoción', **get_least_sold_promo_data }
      ]
    }
  end

  def performance_metrics
    summary = summary_stats # Reusamos para el revenue actual
    total_revenue = summary[:total_revenue]

    prev_start = @start_date - 1.month
    prev_end = @end_date - 1.month
    prev_revenue = Order.where(status: 'completed', order_type: ['mesa', 'recojo', 'delivery'], created_at: prev_start..prev_end).sum(:total_price)

    days_count = [(@end_date - @start_date).to_i + 1, 1].max
    avg_weekly_sales = (total_revenue / (days_count / 7.0)).round(2)

    {
      avg_weekly_sales: avg_weekly_sales.to_f,
      growth_vs_prev_month: prev_revenue.zero? ? 0 : (((total_revenue - prev_revenue) / prev_revenue) * 100).round(2)
    }
  end

  def calculate_items_cost(items)
    items.sum do |item|
      if item.production_cost.to_f > 0
        item.production_cost.to_f
      else
        (item.itemable&.total_cost || 0) * item.quantity
      end
    end
  end

  def get_least_sold_data(categories)
    all_items = Recipe.where(category: categories)
    return { name: "N/A", quantity: 0 } if all_items.empty?

    sales_by_item = OrderItem.joins(:order)
                             .where(orders: { status: 'completed', created_at: @start_date..@end_date })
                             .where(itemable_type: 'Recipe', itemable_id: all_items.pluck(:id))
                             .group(:itemable_id)
                             .select('itemable_id, SUM(quantity) as total_qty')

    sold_ids = sales_by_item.pluck(:itemable_id)
    unsold_items = all_items.where.not(id: sold_ids)

    return { name: unsold_items.first.name, quantity: 0 } if unsold_items.any?

    res = sales_by_item.order('SUM(quantity) ASC').first
    return { name: "N/A", quantity: 0 } unless res

    item = Recipe.find_by(id: res.itemable_id)
    { name: item&.name || "N/A", quantity: res.total_qty.to_f }
  end

  def get_least_sold_promo_data
    all_promos = Promotion.all
    return { name: "N/A", quantity: 0 } if all_promos.empty?

    sales_by_promo = OrderItem.joins(:order)
                              .where(orders: { status: 'completed', created_at: @start_date..@end_date })
                              .where(itemable_type: 'Promotion')
                              .group(:itemable_id)
                              .select('itemable_id, SUM(quantity) as total_qty')

    sold_ids = sales_by_promo.pluck(:itemable_id)
    unsold_promos = all_promos.where.not(id: sold_ids)

    return { name: unsold_promos.first.name, quantity: 0 } if unsold_promos.any?

    res = sales_by_promo.order('SUM(quantity) ASC').first
    return { name: "N/A", quantity: 0 } unless res

    item = Promotion.find_by(id: res.itemable_id)
    { name: item&.name || "N/A", quantity: res.total_qty.to_f }
  end
end
