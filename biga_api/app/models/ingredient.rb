class Ingredient < ApplicationRecord
    has_many :inventory_batches,dependent: :destroy
    validates :name, presence: true, uniqueness: {case_sensitive: false}
    validates :unit, presence: true
    validates :stock, numericality: {greater_than_or_equal_to: 0}
    validates :minimum_stock, numericality: {greater_than_or_equal_to: 0}
    before_save:format_name
        private
        def format_name
            self.name = name.strip.titleize if name.present?
        end
end
