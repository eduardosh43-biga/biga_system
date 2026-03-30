class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.string :customer_name
      t.string :status
      t.decimal :total_price

      t.timestamps
    end
  end
end
