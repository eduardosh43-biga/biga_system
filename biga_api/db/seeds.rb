
# 1. Limpiamos para evitar duplicados si lo corres varias veces
InventoryBatch.destroy_all
Ingredient.destroy_all

# 2. Creamos los ingredientes base de BIGA
harina = Ingredient.create!(name: "Harina 00", unit: "kg", stock: 25.0, minimum_stock: 5.0)
queso = Ingredient.create!(name: "Mozzarella", unit: "kg", stock: 10.0, minimum_stock: 2.0)
tomate = Ingredient.create!(name: "Tomate Pelati", unit: "unid", stock: 12.0, minimum_stock: 3.0)

# 3. Creamos los lotes con los costos reales (S/ 7.61 para la harina)
InventoryBatch.create!(ingredient: harina, quantity: 25.0, cost_per_unit: 7.61, expiry_date: 6.months.from_now)
InventoryBatch.create!(ingredient: queso, quantity: 10.0, cost_per_unit: 25.0, expiry_date: 1.month.from_now)
InventoryBatch.create!(ingredient: tomate, quantity: 12.0, cost_per_unit: 5.50, expiry_date: 1.year.from_now)

puts "🍕 ¡Inventario de BIGA cargado con éxito en la base de datos!"