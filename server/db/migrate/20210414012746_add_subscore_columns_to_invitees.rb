class AddSubscoreColumnsToInvitees < ActiveRecord::Migration[6.1]
  def change
    add_column :participants, :location_score, :float
    add_column :participants, :masks_social_dist_score, :float
    add_column :participants, :group_size_score, :float
    add_column :participants, :food_score, :float
  end
end
