class Participant < ApplicationRecord
    belongs_to :events, optional: true
    belongs_to :users, optional: true
end
