require 'rails_helper'

RSpec.describe Questionnaire, type: :model do
    it "successfully creates a new questionnaire entry when all fields are valid" do
        Questionnaire.create(q1: 1,
        q2: 1, 
        q3: 1, 
        q4: 1,
        q5: 1,
        q6: 1,
        q7: 1, 
        q8: 1, 
        q9: 1,
        q10: 1,
        q11: 1,
        q12: 1, 
        q13: 1, 
        q14: 1,
        q15: 1)

        @quest = Questionnaire.find_by(id: 6)

        expect(@quest).to be_truthy
    end

    it "successfully creates a new questionnaire when non-required fields are not included, sets them to default values" do
        Questionnaire.create()

        @quest = Questionnaire.find_by(id: 7)

        expect(@quest.q1).to eq(1)
        expect(@quest.q2).to eq(1)
        expect(@quest.q3).to eq(1)
        expect(@quest.q4).to eq(1)
        expect(@quest.q5).to eq(1)
        expect(@quest.q6).to eq(1)
        expect(@quest.q7).to eq(1)
        expect(@quest.q8).to eq(1)
        expect(@quest.q9).to eq(1)
        expect(@quest.q10).to eq(1)
        expect(@quest.q11).to eq(1)
        expect(@quest.q12).to eq(1)
        expect(@quest.q13).to eq(1)
        expect(@quest.q14).to eq(1)
        expect(@quest.q15).to eq(1)
    end
end
