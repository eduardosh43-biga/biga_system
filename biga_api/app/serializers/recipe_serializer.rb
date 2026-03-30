class RecipeSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :name, :price, :category, :total_cost, :margin_percentage, :status_health, :image_url
  
  has_many :recipe_ingredients

  def image_url
    if object.image.attached?
      # Solo genera la URL si el archivo está ahí
      rails_blob_url(object.image, only_path: true)
    else
      nil
    end
  rescue
    nil # Si algo falla con Active Storage, mandamos nil y no rompemos la app
  end
  
end