class AddCategoryToPromotions < ActiveRecord::Migration[8.0]
  def change
    add_column :promotions, :category, :string
  end
end
