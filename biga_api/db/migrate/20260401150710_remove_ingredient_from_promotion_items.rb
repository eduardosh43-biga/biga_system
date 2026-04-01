class RemoveIngredientFromPromotionItems < ActiveRecord::Migration[8.0]
  def change
    remove_reference :promotion_items, :ingredient, null: false, foreign_key: true
  end
end
