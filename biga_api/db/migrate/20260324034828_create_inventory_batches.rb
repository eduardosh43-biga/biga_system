class CreateInventoryBatches < ActiveRecord::Migration[8.0]
  def change
    create_table :inventory_batches do |t|
      t.references :ingredient, null: false, foreign_key: true
      t.decimal :quantity
      t.decimal :cost_per_unit
      t.date :expiry_date

      t.timestamps
    end
  end
end
