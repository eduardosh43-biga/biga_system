class RenameNmaeToNameInRecipes < ActiveRecord::Migration[8.0]
  def change
    rename_column :recipes, :nmae, :name
  end
end
