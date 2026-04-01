class CreatePromotionItems < ActiveRecord::Migration[8.0]
  def change
    create_table :promotion_items do |t|
      t.references :promotion, null: false, foreign_key: true
      t.references :recipe, null: false, foreign_key: true
      t.references :ingredient, null: false, foreign_key: true
      t.integer :quantity

      t.timestamps
    end
  end
end
