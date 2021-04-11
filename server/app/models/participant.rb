class Participant < ApplicationRecord
    belongs_to :events, optional: true
    belongs_to :users, optional: true

    validates :user_id, :event_id, presence:true

    before_save :default_values

    private

    def default_values
      self.questionnaire_complete = false if self.questionnaire_complete.nil?
    end
end
