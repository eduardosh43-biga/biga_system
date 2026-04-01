class Promotion < ApplicationRecord
  has_many :promotion_items, dependent: :destroy
  has_many :recipes, through: :promotion_items

  before_validation :set_default_category

  # Esto permite crear la promo y sus items en un solo formulario desde React
  accepts_nested_attributes_for :promotion_items, allow_destroy: true

  validates :name, :sale_price, presence: true

  # 1. Sumamos el costo de todas las recetas incluidas
  def total_cost
    promotion_items.includes(:recipe).sum do |pi|
      (pi.recipe&.total_cost || 0) * pi.quantity
    end.to_f.round(2)
  end

  # 2. Calculamos el margen real del combo
  def margin_percentage
    return 0 if sale_price.to_f.zero?
    ((sale_price - total_cost) / sale_price * 100).round(2)
  end

  # 3. Semáforo de rentabilidad (las promos suelen tener margen menor que platos sueltos)
  def status_health
    margin_percentage >= 45 ? 'rentable' : 'revisar_costos'
  end

  private

  def set_default_category
    self.category ||= 'promotion'
  end
end