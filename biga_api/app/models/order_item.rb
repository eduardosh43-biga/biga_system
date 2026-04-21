class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :itemable, polymorphic: true

  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :unit_price, presence: true

  def itemable_name
    itemable&.name || "Producto sin nombre"
  end

  def subtotal
    (quantity.to_f * unit_price.to_f).round(2)
  end

  def as_json(options = {})
    super(options).merge({
      itemable_name: itemable_name
    })
  end
end
