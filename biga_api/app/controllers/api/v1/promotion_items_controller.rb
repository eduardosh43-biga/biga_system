class Api::V1::PromotionItemsController < ApplicationController
  before_action :set_promotion_item, only: [:destroy]

  # DELETE /api/v1/promotion_items/:id
  # Útil cuando quieres quitar una pizza específica de un combo desde la interfaz de edición
  def destroy
    if @promotion_item.destroy
      head :no_content
    else
      render json: { error: "No se pudo eliminar el ítem" }, status: :unprocessable_entity
    end
  end

  private

  def set_promotion_item
    @promotion_item = PromotionItem.find(params[:id])
  end
end