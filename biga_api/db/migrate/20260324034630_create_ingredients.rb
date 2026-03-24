class CreateIngredients < ActiveRecord::Migration[8.0]
  def change
    create_table :ingredients do |t|
      t.string :name
      t.string :unit
      t.decimal :stock
      t.decimal :minimum_stock

      t.timestamps
    end
  end
end
