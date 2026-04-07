class RecipeSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :name, :price, :category, :total_cost, :margin_percentage, :status_health
  
  has_many :recipe_ingredients

  def image_url
    if object.image.attached?      
      rails_blob_url(object.image, only_path: true)
    else
      nil
    end
  rescue
    nil
  end
  
end