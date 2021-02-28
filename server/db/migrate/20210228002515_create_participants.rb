class CreateParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :participants do |t|
      t.references :users, null: false, foreign_key: true
      t.references :events, null:false, foreign_key: true
      t.boolean :questionnaire_complete

      t.timestamps
    end
  end
end
