class InventoryBatch < ApplicationRecord
  belongs_to :ingredient

  validates :ingredient_id, presence: true  
  validates :quantity, presence: true, numericality: { greater_than: 0 }  
  validates :cost_per_unit, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :expiry_date, presence: true  
  validate :expiry_date_cannot_be_in_the_past

  private

  def expiry_date_cannot_be_in_the_past
    if expiry_date.present? && expiry_date < Date.today
      errors.add(:expiry_date, "no puede ser una fecha que ya pasó. ¡Revisa el producto!")
    end
  end
end
