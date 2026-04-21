class Api::V1::OrdersController < ApplicationController
  before_action :set_order, only: %i[ show update destroy ]

  def index  
  @orders = Order.includes(:order_items).order(created_at: :desc)

  render json: @orders.as_json(include: { 
    order_items: { include: :itemable } 
  })
  end
   
  def show
    render json: @order
  end

  # POST /api/v1/orders (Desde el Punto de Venta)
  def create
    @order = Order.new(order_params)
    if @order.save
      render json: @order, status: :created
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/orders/:id (Para cambiar status a 'listo' o 'completado')
  def update
    if @order.update(order_params)
      render json: @order
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/orders/:id
  def destroy
    @order = Order.find(params[:id])  
    
    if @order.update(status: 'cancelled')      
      render json: { message: "Pedido anulado correctamente" }, status: :ok
    else
      render json: { error: "No se pudo anular" }, status: :unprocessable_entity
    end
  end
  

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :customer_name, 
      :status,
      :order_type,
      :delivery_fee,
      :total_price,
      :payment_method,
      :table_number,
      :delivery_address,
      order_items_attributes: [:id, :itemable_id, :itemable_type, :quantity, :unit_price, :_destroy]
    )
  end
end
