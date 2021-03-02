class CreateParticipants < ActiveRecord::Migration[6.1]
  def up
    create_table :participants do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event, null:false, foreign_key: true
      t.boolean :questionnaire_complete

      t.timestamps
    end
  end

  def down
    drop_table :participants
  end
end
