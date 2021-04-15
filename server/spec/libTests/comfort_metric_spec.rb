require 'rails_helper'

RSpec.describe "Comfort metric", type: :request do
    before do
        # get token for authentication purposes
        post '/users/login', params: { email: "test@test.test", password: "password" }
        @res = JSON.parse(response.body)
        @token = @res["token"]
    
        # get user corresponding to above auth token
        @user = User.find_by(email: "test@test.test")

        @globalQuestionnaire = Questionnaire.new(q1: 5,
        q2: 2, 
        q3: 1, 
        q4: 6,
        q5: 6,
        q6: 5,
        q7: 3, 
        q8: 1, 
        q9: 1,
        q10: 3,
        q11: 6,
        q12: 3, 
        q13: 4, 
        q14: 2,
        q15: 25)
    end

    describe "food score tests" do
        
        it "Correctly determines food score for indoor event with prepackaged food" do 
            @eventIndoorPrepackaged = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: true,
                food_buffet: false,
                location: "test",
                indoor: true,
                outdoor: false,
                remote: false,
                score: nil)

            @foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,true)
            expect(@foodScore).to eq(3)
        end

        it "Correctly determines food score for indoor event with buffet food" do 
            @eventIndoorPrepackaged = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: false,
                food_buffet: true,
                location: "test",
                indoor: true,
                outdoor: false,
                remote: false,
                score: nil)

            @foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,true)
            expect(@foodScore).to eq(1)
        end

        it "Correctly determines food score for outdoor event with prepackaged food" do 
            @eventIndoorPrepackaged = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: true,
                food_buffet: false,
                location: "test",
                indoor: false,
                outdoor: true,
                remote: false,
                score: nil)

            @foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,false)
            expect(@foodScore).to eq(4)
        end

        it "Correctly determines food score for outdoor event with buffet food" do 
            @eventIndoorPrepackaged = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: false,
                food_buffet: true,
                location: "test",
                indoor: false,
                outdoor: true,
                remote: false,
                score: nil)

            @foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,false)
            expect(@foodScore).to eq(2)
        end
    end

    # def self.generateGroupSizeScore(quest, event, indoor)

    #     comfortSize = -1
    #     if (indoor)
    #       comfortSize = quest.q9
    #     else
    #       comfortSize = quest.q15
    #     end
    
    #     eventSize = Participant.where(event_id: event.id).length
    #     return (comfortSize > eventSize) || (comfortSize == -1) ? 5 : groupSigmoid((comfortSize - eventSize)/comfortSize)
    #   end

    # def groupSigmoid(x)
    #     return (8 / (1 + Math.exp((-4)*x))) + 1
    #   end
    describe "group size comfort score test" do
        it "correctly gets score for event with less invitees than the person is comfortable with, indoor" do
            get "/events/5", headers: { "Authorization": "Bearer #{@token}"}

            @resId = JSON.parse(response.body)["event"]["id"]

            @event = Event.find(@resId)

            @groupSizeScore = ComfortMetric.generateGroupSizeScore(@globalQuestionnaire, @event, true)
            
            expect(@groupSizeScore). to eq(5)
        end

        

        it "correctly gets score for event with same invitees than the person is comfortable with, indoor" do
            get "/events/2", headers: { "Authorization": "Bearer #{@token}"}

            @resId = JSON.parse(response.body)["event"]["id"]

            @event = Event.find(@resId)

            @groupSizeScore = ComfortMetric.generateGroupSizeScore(@globalQuestionnaire, @event, true)
            
            expect(@groupSizeScore). to eq(5)
        end

        it "correctly gets score for event with 50% more invitees than the person is comfortable with, outdoor" do
            get "/events/6", headers: { "Authorization": "Bearer #{@token}"}

            @resId = JSON.parse(response.body)["event"]["id"]

            @event = Event.find(@resId)

            @localQuest = Questionnaire.new(q1: 5,
            q2: 2, 
            q3: 1, 
            q4: 6,
            q5: 6,
            q6: 5,
            q7: 3, 
            q8: 1, 
            q9: 1,
            q10: 3,
            q11: 6,
            q12: 3, 
            q13: 4, 
            q14: 2,
            q15: 2)

            @groupSizeScore = ComfortMetric.generateGroupSizeScore(@localQuest, @event, false).round(4)
            
            expect(@groupSizeScore).to eq(2.1844)
        end

        it "correctly gets score for event with more 100% invitees than the person is comfortable with, indoor" do
            get "/events/1", headers: { "Authorization": "Bearer #{@token}"}

            @resId = JSON.parse(response.body)["event"]["id"]

            @event = Event.find(@resId)

            @groupSizeScore = ComfortMetric.generateGroupSizeScore(@globalQuestionnaire, @event, true).round(4)
            
            expect(@groupSizeScore). to eq(1.2345)
        end
    end
end
