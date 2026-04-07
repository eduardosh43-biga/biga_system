class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.string :order_type
      t.integer :daily_id
      t.string :customer_name
      t.string :table_number
      t.string :delivery_address
      t.decimal :delivery_fee
      t.decimal :total_price
      t.string :status
      t.string :payment_method

      t.timestamps
    end
  end
end
