class Api::V1::RecipesController < ApplicationController
  before_action :set_recipe, only: [:show, :update, :destroy]

  def index
    @recipes = Recipe.includes(recipe_ingredients: { ingredient: :inventory_batches })
                    .with_attached_image
                    .all
    render json: @recipes
  end

  def show
    @recipe = Recipe.includes(recipe_ingredients: { ingredient: :inventory_batches })
                    .with_attached_image
                    .find(params[:id])  
    render json: @recipe, include: :recipe_ingredients
  end


  def create
    @recipe = Recipe.new(recipe_params)
    if @recipe.save
      render json: @recipe, status: :created
    else
      render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @recipe.update(recipe_params)
      render json: @recipe 
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end
      
  def destroy
    if @recipe.destroy
      head :no_content
    else
      render json: { error: "No se pudo eliminar la receta" }, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_recipe
    @recipe = Recipe.find(params[:id])
  end

  def recipe_params
    params.require(:recipe).permit(:name, :price, :category)
  end
end