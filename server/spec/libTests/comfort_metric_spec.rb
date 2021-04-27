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

            foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,true)
            expect(foodScore).to eq(3)
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

            foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,true)
            expect(foodScore).to eq(1)
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

            foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,false)
            expect(foodScore).to eq(4)
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

            foodScore = ComfortMetric.generateFoodScore(@globalQuestionnaire, @eventIndoorPrepackaged,false)
            expect(foodScore).to eq(2)
        end
    end

    describe "group size comfort score test" do
        it "correctly gets score for event with less invitees than the person is comfortable with, indoor" do
            get "/events/5", headers: { "Authorization": "Bearer #{@token}"}

            @resId = JSON.parse(response.body)["event"]["id"]

            @event = Event.find(@resId)

            groupSizeScore = ComfortMetric.generateGroupSizeScore(@globalQuestionnaire, @event, true)
            
            expect(groupSizeScore). to eq(5)
        end

        

        it "correctly gets score for event with same invitees than the person is comfortable with, indoor" do
            get "/events/2", headers: { "Authorization": "Bearer #{@token}"}

            @resId = JSON.parse(response.body)["event"]["id"]

            @event = Event.find(@resId)

            groupSizeScore = ComfortMetric.generateGroupSizeScore(@globalQuestionnaire, @event, true)
            
            expect(groupSizeScore). to eq(5)
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

            groupSizeScore = ComfortMetric.generateGroupSizeScore(@localQuest, @event, false).round(4)
            
            expect(groupSizeScore).to eq(2.1844)
        end

        it "correctly gets score for event with more 100% invitees than the person is comfortable with, indoor" do
            get "/events/1", headers: { "Authorization": "Bearer #{@token}"}

            @resId = JSON.parse(response.body)["event"]["id"]

            @event = Event.find(@resId)

            groupSizeScore = ComfortMetric.generateGroupSizeScore(@globalQuestionnaire, @event, true).round(4)
            
            expect(groupSizeScore). to eq(1.2345)
        end
    end

    describe "mask social distancing score tests" do

        it "calculates indoor, social distancing with masks event, same tolerance for risk" do
            @event = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: false,
                food_buffet: true,
                location: "test",
                indoor: true,
                outdoor: false,
                remote: false,
                score: nil,
                social_distancing_masks: 6,
                social_distancing_no_masks:nil)
            
            score = ComfortMetric.generateMasksSocialDistancingScore(@globalQuestionnaire, @event, true)

            expect(score).to eq(5)
        end

        it "calculates indoor, social distancing with no mask events, different risk tolerances -> low score" do
            @event = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: false,
                food_buffet: true,
                location: "test",
                indoor: true,
                outdoor: false,
                remote: false,
                score: nil,
                social_distancing_masks: nil,
                social_distancing_no_masks: 0)

            score = ComfortMetric.generateMasksSocialDistancingScore(@globalQuestionnaire, @event, true).round(4)
                
            expect(score).to eq(1.162)
        end

        it "calculates outdoor, social distancing with mask events, different risk tolerances -> medium score" do
            @event = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: false,
                food_buffet: true,
                location: "test",
                indoor: false,
                outdoor: true,
                remote: false,
                score: nil,
                social_distancing_masks: 0,
                social_distancing_no_masks: nil)

            @localQuestionnaire = Questionnaire.new(q1: 5,
                q2: 2, 
                q3: 1, 
                q4: 6,
                q5: 6,
                q6: 5,
                q7: 3, 
                q8: 1, 
                q9: 1,
                q10: 6,
                q11: 6,
                q12: 3, 
                q13: 6, 
                q14: 2,
                q15: 25)

            score = ComfortMetric.generateMasksSocialDistancingScore(@localQuestionnaire, @event, false).round(4)
                
            expect(score).to eq(3.7503)
        end

        it "calculates outdoor, social distancing with no mask event different risk tolerances -> high (but not 5) score" do
            @event = Event.new(title: "Updated Title", 
                host_id: 1,
                description: "indoor event",
                date_time: Time.now,
                food_prepackaged: false,
                food_buffet: true,
                location: "test",
                indoor: false,
                outdoor: true,
                remote: false,
                score: nil,
                social_distancing_masks: nil,
                social_distancing_no_masks: 5)

            @localQuestionnaire = Questionnaire.new(q1: 5,
                q2: 2, 
                q3: 1, 
                q4: 6,
                q5: 6,
                q6: 5,
                q7: 3, 
                q8: 1, 
                q9: 1,
                q10: 6,
                q11: 6,
                q12: 1, 
                q13: 3, 
                q14: 2,
                q15: 25)

            score = ComfortMetric.generateMasksSocialDistancingScore(@localQuestionnaire, @event, false).round(4)
                
            expect(score).to eq(4.4905)
        end
    end

    describe "generate Total Score tests" do 
        it "correctly generate all scores in the correct format, food score exists" do 
            score = ComfortMetric.generateTotalScore(1,2)
            
            expect(score[:subscores][:location_score]).to eq(2)
            expect(score[:subscores][:masks_social_dist_score].round(4)).to eq(1.9683)
            expect(score[:subscores][:group_size_score]).to eq(5)
            expect(score[:subscores][:food_score]).to eq(3)
            expect(score[:total_score].round(4)).to eq(2.9921)
        end

        it "correctly generate all scores in the correct format, food score does not exist" do 
            score = ComfortMetric.generateTotalScore(1,3)
            
            expect(score[:subscores][:location_score]).to eq(3)
            expect(score[:subscores][:masks_social_dist_score].round(4)).to eq(2.3365)
            expect(score[:subscores][:group_size_score]).to eq(5)
            expect(score[:total_score].round(4)).to eq(3.4455)
        end

        it "correctly generate all scores in the correct format, remote event" do 
            score = ComfortMetric.generateTotalScore(1,7)
            expect(score[:total_score]).to eq(4)
        end
    end
end
