class CreateSuggestions < ActiveRecord::Migration[6.1]
  def change
    create_table :suggestions do |t|
      t.references :event, null: false, foreign_key: true
      t.boolean :masks
      t.integer :distance
      t.string :indoor_outdoor
      t.integer :room_size
      t.integer :food
      t.float :score

      t.timestamps
    end
  end
end
