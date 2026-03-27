class Ingredient < ApplicationRecord
    has_many :inventory_batches, dependent: :destroy
  
    # Validaciones (las tuyas están perfectas)
    validates :name, presence: true, uniqueness: { case_sensitive: false }
    validates :unit, presence: true
    validates :minimum_stock, numericality: { greater_than_or_equal_to: 0 }
  
    before_save :format_name
  
    # 1. Calculamos el stock sumando los lotes reales
    def stock
      inventory_batches.sum(:quantity)
    end
  
    # 2. Renombramos: quitamos el "?" para que sea fácil de leer en JS
    def near_expiry
      inventory_batches.where("expiry_date <= ?", 10.days.from_now).exists?
    end

    def low_stock
        # Si el stock actual es igual o menor al mínimo establecido
        stock <= minimum_stock
      end
  
    # 3. Este es el truco para que React reciba todo servido en bandeja
    def as_json(options = {})
  super(options.merge(
    methods: [:stock, :near_expiry, :low_stock],
    include: { 
      inventory_batches: { 
        only: [:id, :quantity, :cost_per_unit, :expiry_date] 
      }
    }
  ))
end
  
    private
  
    def format_name
      self.name = name.strip.titleize if name.present?
    end
  end