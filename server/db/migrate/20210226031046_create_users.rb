class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :first_name
      t.string :last_name
      t.string :password_hash
      t.integer :questionnaire_id
      t.integer :privacy_level

      t.timestamps
    end
  end
end
