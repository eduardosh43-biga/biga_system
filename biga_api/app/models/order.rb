class Order < ApplicationRecord
    has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items

  validates :order_type, presence: true, inclusion: { in: %w[mesa delivery] }
  
  before_create :set_daily_id
  before_save :calculate_total

  private

  def set_daily_id
    # Busca la última orden de hoy y le suma 1 al contador
    last_order_today = Order.where("created_at >= ?", Time.zone.now.beginning_of_day).last
    self.daily_id = last_order_today ? last_order_today.daily_id + 1 : 1
  end

  def calculate_total
    # Suma (precio_unidad * cantidad) de cada item + el costo de envío
    items_total = order_items.map { |item| item.unit_price.to_f * item.quantity }.sum
    self.total_price = items_total + (delivery_fee || 0).to_f
  end
end
end
