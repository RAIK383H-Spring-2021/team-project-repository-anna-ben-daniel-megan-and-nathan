require 'rails_helper'

RSpec.describe "questionnaires controller requests", type: :request do
    before do
        # get token for authentication purposes
        post '/users/login', params: { email: "privacy@hello.hello", password: "password" }
        @res = JSON.parse(response.body)
        @token = @res["token"]

        # get user corresponding to above auth token
        @user = User.find_by(email: "privacy@hello.hello")
    end

    describe "GET #show" do
        it "returns unauthorized http error if no auth token provided" do
            get "/users/#{@user.id + 1}/questionnaire"
    
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns unauthorized error if questionnaire is private" do
            get "/users/1/questionnaire", headers: { "Authorization": "Bearer #{@token}"}

            expect(response).to have_http_status(:unauthorized)
        end

        it "gets questionnaire from no event user correctly" do
            post '/users/login', params: { email: "no@event.user", password: "password" }
            @resIndividualTest = JSON.parse(response.body)
            @tokenIndividualTest = @resIndividualTest["token"]
            get "/users/3/questionnaire", headers: { "Authorization": "Bearer #{@tokenIndividualTest}"}

            @res = JSON.parse(response.body)
            expect(@res["id"]).to eq(3)
        end
    end

    describe "PUT #update" do
        it "returns unauthorized http error if no auth token given" do
            put "/events/1/invitees/#{@user.id + 1}/questionnaire"

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns unauthorized http error if auth id is not the user id" do
            put "/events/1/invitees/1/questionnaire", headers: { "Authorization": "Bearer #{@token}"},
                params: {     "q1":1,
                              "q2":1,
                              "q3":1,
                              "q4":1,
                              "q5":1,
                              "q6":1,
                              "q7":1,
                              "q8":1,
                              "q9":1,
                              "q10":1,
                              "q11":1,
                              "q12":1,
                              "q13":1,
                              "q14":1,
                              "q15":1}
            expect(response).to have_http_status(:unauthorized)
        end

        it "update no event user" do
            post '/users/login', params: { email: "test@test.test", password: "password" }
            @resFirst = JSON.parse(response.body)
            @tokenFirst = @resFirst["token"]

            put "/events/2/invitees/3/questionnaire", headers: { "Authorization": "Bearer #{@tokenFirst}"},
                params: {     "q1":1,
                              "q2":1,
                              "q3":1,
                              "q4":1,
                              "q5":1,
                              "q6":1,
                              "q7":1,
                              "q8":1,
                              "q9":1,
                              "q10":1,
                              "q11":1,
                              "q12":1,
                              "q13":1,
                              "q14":1,
                              "q15":1}

            @res = JSON.parse(response.body)

            expect(@res["questionnaire"]["q1"]).to eq(1)
            expect(@res["questionnaire"]["id"]).to eq(1)
        end
    end
end