require 'rails_helper'

RSpec.describe Participant, type: :model do
    it "does not validate when not all fields are provided" do
        @part = Participant.new()

        expect(@part.valid?).to be false
    end

    it "successfully creates a new participant entry when all fields are valid" do
        Participant.create(user_id: 3,
        event_id:2,
        questionnaire_complete: 0)
    
        @part = Participant.find_by(user_id: 3, event_id: 2)
    
        expect(@part).to be_truthy
    end

    it "successfully creates a new participant when non-required fields are not included, sets them to default values" do
        Participant.create(user_id: 3,
        event_id:3)

        @part = Participant.find_by(user_id: 3, event_id: 3)

        expect(@part.questionnaire_complete).to eq(false)
    end
end
