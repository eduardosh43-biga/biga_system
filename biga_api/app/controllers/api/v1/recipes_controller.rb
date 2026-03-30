class Api::V1::RecipesController < ApplicationController
    # GET /api/v1/recipes
    def index
      @recipes = Recipe.all
      render json: @recipes
    end

    def show
      @recipe = Recipe.find(params[:id])
      render json: @recipe, include: :recipe_ingredients
    end
  
    # POST /api/v1/recipes
    def create
      @recipe = Recipe.new(recipe_params)
      if @recipe.save
        render json: @recipe, status: :created
      else
        render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
        @recipe = Recipe.find(params[:id])
        if @recipe.update(recipe_params)
          render json: @recipe 
        else
          render json: @recipe.errors, status: :unprocessable_entity
        end
      end
      
      def destroy
        @recipe = Recipe.find(params[:id])
        @recipe.destroy
        head :no_content
      end
  
    private
  
    def recipe_params
      params.require(:recipe).permit(:name, :price, :category)
    end
  end