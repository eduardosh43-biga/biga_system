class Api::V1::IngredientsController < ApplicationController

  before_action :set_ingredient, only: [:show, :update, :destroy]

  def index
    @ingredients = Ingredient.all
    render json: @ingredients
  end

  # Read: Show the ingredients
  def show
    @ingredient = Ingredient.find(params[:id])  
    render json: @ingredient
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Ingrediente no encontrado" }, status: :not_found
  end

  # CREATE: Guardar uno nuevo
  def create
    puts "======= DEBUG SHOW ======="
    pp params
    puts "=========================="
    @ingredient = Ingredient.new(ingredient_params)
    if @ingredient.save
      render json: @ingredient, status: :created
    else
      render json: { errors: @ingredient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # UPDATE: Editar stock o nombre
  def update
    if @ingredient.update(ingredient_params)
      render json: @ingredient
    else
      render json: { errors: @ingredient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE: Borrar ingrediente
  def destroy
    @ingredient.destroy
    head :no_content
  end

  private

  def set_ingredient
    @ingredient = Ingredient.find(params[:id])  
  end

  def ingredient_params
    params.require(:ingredient).permit(:name, :unit, :stock, :minimum_stock)
  end
end
