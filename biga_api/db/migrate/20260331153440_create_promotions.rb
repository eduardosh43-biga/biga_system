class CreatePromotions < ActiveRecord::Migration[8.0]
  def change
    create_table :promotions do |t|
      t.string :name
      t.decimal :sale_price
      t.text :description

      t.timestamps
    end
  end
end
