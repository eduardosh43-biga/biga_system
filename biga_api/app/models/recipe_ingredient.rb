# app/models/recipe.rb
class RecipeIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :ingredient

  # Validaciones básicas
  validates :quantity, presence: true, numericality: { greater_than: 0 }
end