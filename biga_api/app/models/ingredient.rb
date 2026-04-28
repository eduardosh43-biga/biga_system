class Ingredient < ApplicationRecord
    has_many :inventory_batches, dependent: :destroy
  
    # Validaciones (las tuyas están perfectas)
    validates :name, presence: true, uniqueness: { case_sensitive: false }
    validates :unit, presence: true
    validates :minimum_stock, numericality: { greater_than_or_equal_to: 0 }
  
    before_save :format_name
  
    
  def stock    
    inventory_batches.sum(:quantity)
  end

  def latest_cost
    inventory_batches.order(created_at: :desc).first&.cost_per_unit || 0.0
  end

  def near_expiry
    limit_date = 5.days.from_now    
    inventory_batches.any? { |batch| batch.expiry_date.present? && batch.expiry_date <= limit_date }
  end

  def low_stock
    stock <= minimum_stock
  end
  
  def subtract_stock(amount_to_remove)
    remaining = amount_to_remove.to_f
    total_cost_consumed = 0.0

    # Usamos una transacción con bloqueo para evitar errores en ventas simultáneas
    ActiveRecord::Base.transaction do
      # Bloqueamos los lotes que tienen stock para que nadie más los toque hasta terminar
      batches = inventory_batches.where("quantity > 0")
                                 .order(expiry_date: :asc, created_at: :asc)
                                 .lock("FOR UPDATE")

      batches.each do |batch|
        break if remaining <= 0
        
        consumed = [batch.quantity, remaining].min
        total_cost_consumed += consumed * batch.cost_per_unit
        
        batch.update!(quantity: batch.quantity - consumed)
        remaining -= consumed
      end
    end
    
    total_cost_consumed.round(2)
  end
   
  private
  
    def format_name
      self.name = name.strip.titleize if name.present?
    end
  end