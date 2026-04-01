class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :recipe

  # Validaciones para evitar datos basura
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :unit_price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # Lógica Pro: Si React no manda el precio, el Backend lo busca en la receta
  before_validation :set_unit_price, on: :create

  private

  def set_unit_price
    # Si el unit_price viene vacío (nil), lo sacamos del total_cost de la receta
    self.unit_price ||= recipe.total_cost if recipe.present?
  end
end