require 'rails_helper'

RSpec.describe "suggestions controller requests", type: :request do
    before do
        # get token for authentication purposes
        post '/users/login', params: { email: "test@test.test", password: "password" }
        @res = JSON.parse(response.body)
        @token = @res["token"]

        # get user corresponding to above auth token
        @user = User.find_by(email: "test@test.test")
    end

    describe "GET #index" do
        it "returns unauthorized when user is not authenticated" do
            get '/events/1/suggestions'

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns unauthorized when user is not authenticated (not host of event)" do
            get "/events/2/suggestions", headers: { "Authorization": "Bearer #{@token}"}

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns not found http error when there are not enough responses to the questionnaire" do
          get "/events/4/suggestions", headers: { "Authorization": "Bearer #{@token}"}

          expect(response).to have_http_status(:not_found)
        end

        it "gets suggestions from event1 correctly" do
            get "/events/1/suggestions", headers: { "Authorization": "Bearer #{@token}"}

            @res = JSON.parse(response.body)
            expect(@res["suggestions"]["indoor"]["score"]).to eq(2.0586244615027125)
            expect(@res["suggestions"]["outdoor"]["score"]).to eq(2.0586244615027125)
            expect(@res["suggestions"]["remote"]["score"]).to eq(1)
        end

        it "gets suggestions from event2 correctly" do
            post '/users/login', params: { email: "hello@hello.hello", password: "password" }
            @resUserTwo = JSON.parse(response.body)
            @tokenUserTwo = @resUserTwo["token"]
            get "/events/2/suggestions", headers: { "Authorization": "Bearer #{@tokenUserTwo}"}

            @res = JSON.parse(response.body)
            expect(@res["suggestions"]["indoor"]["score"]).to eq(3.75)
            expect(@res["suggestions"]["outdoor"]["score"]).to eq(4.25)
            expect(@res["suggestions"]["remote"]["score"]).to eq(4)
        end

        it "gets suggestions from event8 correctly" do
            post '/users/login', params: { email: "hello@hello.hello", password: "password" }
            @resUserTwo = JSON.parse(response.body)
            @tokenUserTwo = @resUserTwo["token"]
            get "/events/8/suggestions", headers: { "Authorization": "Bearer #{@tokenUserTwo}"}

            @res = JSON.parse(response.body)
            expect(@res["suggestions"]["indoor"]["score"]).to eq(2.522015589266693)
            expect(@res["suggestions"]["outdoor"]["score"]).to eq(3.060912725157515)
            expect(@res["suggestions"]["remote"]["score"]).to eq(2.5)
        end
    end
end