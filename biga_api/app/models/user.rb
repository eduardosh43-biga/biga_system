class User < ApplicationRecord
    has_secure_password # La magia de Rails que activa BCrypt

  # Definimos los roles para que Rails sepa quién es quién
  enum :role, { admin: 0, waiter: 1, cook: 2 }

  # Validaciones básicas
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, :role, presence: true
end
