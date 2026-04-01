class Api::V1::OrdersController < ApplicationController
  before_action :set_order, only: %i[ show update destroy ]

  # GET /orders
  def index    
    @orders = Order.includes(order_items: :recipe).where.not(status: 'completado')
    render json: @orders
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
    @order.destroy
    head :no_content # Respuesta 204: "Todo bien, pero ya no hay contenido que mostrar"
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :customer_name, 
      :status, 
      :total_price, 
      order_items_attributes: [:recipe_id, :quantity, :unit_price]
    )
  end
end
