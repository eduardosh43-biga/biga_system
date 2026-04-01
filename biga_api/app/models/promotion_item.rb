class PromotionItem < ApplicationRecord
  belongs_to :promotion
  belongs_to :recipe # Aquí solo jalamos de recetas, como pediste

  validates :quantity, presence: true, numericality: { greater_than: 0 }
end