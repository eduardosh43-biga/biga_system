class DropOldOrdersAndItems < ActiveRecord::Migration[8.0]
  def change
    drop_table :order_items if table_exists?(:order_items)
    drop_table :orders if table_exists?(:orders)
  end
end
