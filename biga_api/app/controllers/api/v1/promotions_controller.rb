class Api::V1::PromotionsController < ApplicationController
  before_action :set_promotion, only: [:show, :update, :destroy]

  # GET /api/v1/promotions
  def index
    @promotions = Promotion.all
    render json: @promotions
  end

  # GET /api/v1/promotions/1
  def show
    render json: @promotion
  end

  # POST /api/v1/promotions
  def create
    @promotion = Promotion.new(promotion_params)
    if @promotion.save
      render json: @promotion, status: :created
    else
      render json: { errors: @promotion.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/promotions/1
  def update
    if @promotion.update(promotion_params)
      render json: @promotion
    else
      render json: { errors: @promotion.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/promotions/1
  def destroy
    @promotion.destroy
    head :no_content
  end

  private

  def set_promotion
    @promotion = Promotion.find(params[:id])
  end

  def promotion_params
    # CLAVE: Permitimos los atributos anidados para los items
    params.require(:promotion).permit(
      :name, 
      :sale_price, 
      :description, 
      :category,
      promotion_items_attributes: [:id, :recipe_id, :quantity, :_destroy]
    )
  end
end