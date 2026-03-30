class Api::V1::RecipeIngredientsController < ApplicationController
  before_action :set_ingredient, only: [:update, :destroy]

    # POST /api/v1/recipe_ingredients
    def create
      @recipe_ingredient = RecipeIngredient.new(recipe_ingredient_params)
      
      if @recipe_ingredient.save
        # Devolvemos la receta completa actualizada para que React refresque los costos
        render json: @recipe_ingredient.recipe, status: :created
      else
        render json: { errors: @recipe_ingredient.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /recipe_ingredients/:id
  def update
    if @ingredient.update(ingredient_params)
      render json: @ingredient, status: :ok
    else
      render json: { errors: @ingredient.errors.full_messages }, status: :unprocessable_entity
    end
  end

    # DELETE /api/v1/recipe_ingredients/1
    def destroy
      # Guardamos la referencia a la receta antes de borrar el ingrediente
      @recipe = @ingredient.recipe 
      
      @ingredient.destroy
      
      # IMPORTANTE: Eliminamos el "head :no_content" porque queremos devolver la receta actualizada
      render json: @recipe, status: :ok
    end
    
    private

    def set_ingredient
      @ingredient = RecipeIngredient.find(params[:id])
    end
  
    def recipe_ingredient_params
      params.require(:recipe_ingredient).permit(:recipe_id, :ingredient_id, :quantity,:unit,:price)
    end
  end 