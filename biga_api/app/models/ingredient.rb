class Ingredient < ApplicationRecord
    has_many :inventory_batches, dependent: :destroy
  
    # Validaciones (las tuyas están perfectas)
    validates :name, presence: true, uniqueness: { case_sensitive: false }
    validates :unit, presence: true
    validates :minimum_stock, numericality: { greater_than_or_equal_to: 0 }
  
    before_save :format_name
  
    
  def stock    
    inventory_batches.to_a.sum { |batch| batch.quantity || 0 }
  end
  
    
  def near_expiry
    limit_date = 5.days.from_now    
    inventory_batches.to_a.any? { |batch| batch.expiry_date.present? && batch.expiry_date <= limit_date }
  end

  def low_stock
    stock <= minimum_stock
  end

  def subtract_stock(amount_to_remove)
    remaining = amount_to_remove.to_f
    
    batches = inventory_batches.where("quantity > 0")
                               .order(expiry_date: :asc, created_at: :asc)

    batches.each do |batch|
      break if remaining <= 0
      
      if batch.quantity >= remaining
        # El lote tiene suficiente para cubrir todo lo que falta
        batch.update(quantity: batch.quantity - remaining)
        remaining = 0
      else
        # El lote no alcanza, lo dejamos en 0 y seguimos con el siguiente lote
        remaining -= batch.quantity
        batch.update(quantity: 0)
      end
    end
  end
   
  private
  
    def format_name
      self.name = name.strip.titleize if name.present?
    end
  end