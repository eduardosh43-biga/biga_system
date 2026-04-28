
# # 1. Limpiamos para evitar duplicados si lo corres varias veces
# InventoryBatch.destroy_all
# Ingredient.destroy_all

# # 2. Creamos los ingredientes base de BIGA
# harina = Ingredient.create!(name: "Harina 00", unit: "kg", stock: 25.0, minimum_stock: 5.0)
# queso = Ingredient.create!(name: "Mozzarella", unit: "kg", stock: 10.0, minimum_stock: 2.0)
# tomate = Ingredient.create!(name: "Tomate Pelati", unit: "unid", stock: 12.0, minimum_stock: 3.0)

# # 3. Creamos los lotes con los costos reales (S/ 7.61 para la harina)
# InventoryBatch.create!(ingredient: harina, quantity: 25.0, cost_per_unit: 7.61, expiry_date: 6.months.from_now)
# InventoryBatch.create!(ingredient: queso, quantity: 10.0, cost_per_unit: 25.0, expiry_date: 1.month.from_now)
# InventoryBatch.create!(ingredient: tomate, quantity: 12.0, cost_per_unit: 5.50, expiry_date: 1.year.from_now)

# puts "🍕 ¡Inventario de BIGA cargado con éxito en la base de datos!"
# Limpiamos la mesa antes de empezar
puts "Limpiando base de datos de usuarios..."
User.destroy_all

puts "Creando equipo de BIGA..."

# 1. TÚ (El Administrador)
User.create!(
  name: "Eduardo Admin",
  email: "admin@biga.com",
  password: "password123", # Rails lo convertirá en password_digest automáticamente
  role: :admin
)

# 2. EL MOZO (Para el punto de venta)
User.create!(
  name: "Mesero Biga",
  email: "ventas@biga.com",
  password: "password123",
  role: :waiter
)

# 3. EL COCINERO (Para la pantalla de cocina)
User.create!(
  name: "Chef Biga",
  email: "cocina@biga.com",
  password: "password123",
  role: :cook
)

puts "✅ ¡Equipo creado con éxito!"
puts "Admin: admin@biga.com / password123"