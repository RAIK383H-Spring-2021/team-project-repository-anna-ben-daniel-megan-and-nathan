class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.string :title
      t.integer :host_id, :references => [:users, :id]
      t.string :description
      t.datetime :date_time
      t.boolean :food_prepackaged
      t.boolean :food_buffet
      t.string :location
      t.boolean :indoor
      t.boolean :outdoor
      t.boolean :remote
      t.float :score

      t.timestamps
    end
  end
end
