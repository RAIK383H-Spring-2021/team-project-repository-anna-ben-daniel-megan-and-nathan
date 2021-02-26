class AddForeignKeyHostId < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :events, :users, column: :host_id
  end
end
