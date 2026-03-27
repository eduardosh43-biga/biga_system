class CreateRecipes < ActiveRecord::Migration[8.0]
  def change
    create_table :recipes do |t|
      t.string :nmae
      t.decimal :price

      t.timestamps
    end
  end
end
