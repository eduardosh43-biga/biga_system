class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items, allow_destroy: true

  validates :order_type, presence: true, inclusion: { in: %w[mesa recojo delivery merma personal] }
  validates :status, inclusion: { in: %w[pending ready completed cancelled] }
  
  before_create :set_daily_id
  before_save :calculate_total

  after_update :trigger_inventory_deduction, if: :saved_change_to_status?

  def calculate_total
    items_total = order_items.map { |item| item.unit_price.to_f * item.quantity }.sum
    self.total_price = items_total + (delivery_fee || 0).to_f
  end

  private

  def set_daily_id
    last_order_today = Order.where("created_at >= ?", Time.zone.now.beginning_of_day).last
    self.daily_id = last_order_today ? last_order_today.daily_id + 1 : 1
  end

  def trigger_inventory_deduction
    InventoryService.new(self).deduct_stock if status == 'completed'
  end
end
