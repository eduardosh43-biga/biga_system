class InventoryBatch < ApplicationRecord
  belongs_to :ingredient

  # --- VALIDACIONES DE CONTROL DE CALIDAD ---
  
  # 1. No puede haber un lote sin un ingrediente asignado
  validates :ingredient_id, presence: true

  # 2. La cantidad debe existir y ser mayor a 0 (No aceptamos lotes vacíos)
  validates :quantity, presence: true, numericality: { greater_than: 0 }

  # 3. El costo debe ser un número positivo (Aunque sea 0.01)
  validates :cost_per_unit, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # 4. La fecha de vencimiento es obligatoria para el control de stock
  validates :expiry_date, presence: true
  
  # 5. Validación personalizada: ¿Vencido antes de entrar? ¡No!
  validate :expiry_date_cannot_be_in_the_past

  private

  def expiry_date_cannot_be_in_the_past
    if expiry_date.present? && expiry_date < Date.today
      errors.add(:expiry_date, "no puede ser una fecha que ya pasó. ¡Revisa el producto!")
    end
  end
end
