class Order < ApplicationRecord
    has_many :order_items, dependent: :destroy
    
    # Crucial: permite recibir los items dentro del JSON de la orden
    accepts_nested_attributes_for :order_items
  
    # Validaciones básicas
    validates :customer_name, presence: true
    validates :status, presence: true
    
    # Lógica de negocio: Calcular el total automáticamente antes de guardar
    before_save :calculate_total
  
    private
  
    def calculate_total
      # Sumamos el (precio * cantidad) de cada item
      self.total_price = order_items.sum { |item| item.unit_price * item.quantity }
    end
  end