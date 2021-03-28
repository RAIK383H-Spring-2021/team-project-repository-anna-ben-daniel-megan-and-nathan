class AddInviteeScoreColumn < ActiveRecord::Migration[6.1]
  def change
    add_column :participants, :score, :float
  end
end
