class EventChangeMasks < ActiveRecord::Migration[6.1]
  def change
    add_column :events, :social_distancing_masks, :integer
    add_column :events, :social_distancing_no_masks, :integer
  end
end
