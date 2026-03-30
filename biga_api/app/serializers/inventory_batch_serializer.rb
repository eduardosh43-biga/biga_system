class InventoryBatchSerializer < ActiveModel::Serializer
  
  attributes :id, :quantity, :cost_per_unit, :expiry_date, :ingredient_id

  # Formateamos la fecha para que sea legible y no mande horas/minutos innecesarios
  def expiry_date
    object.expiry_date.to_s if object.expiry_date
  end
end