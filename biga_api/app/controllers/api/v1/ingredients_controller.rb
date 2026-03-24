class Api::V1::IngredientsController < ApplicationController
  def index
    @ingredients = Ingredient.all
    render json: @ingredients
  end

  def show
    @ingredient = Ingredient.find(params[:id])  
    render json: @ingredient
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Ingrediente no encontrado" }, status: :not_found
  end
end
