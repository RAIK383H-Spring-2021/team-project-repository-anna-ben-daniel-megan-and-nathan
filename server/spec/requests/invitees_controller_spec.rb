require 'rails_helper'

RSpec.describe "invitees controller requests", type: :request do
    before do
        # get token for authentication purposes
        post '/users/login', params: { email: "test@test.test", password: "password" }
        @res = JSON.parse(response.body)
        @token = @res["token"]
    
        # get user corresponding to above auth token
        @user = User.find_by(email: "test@test.test")
    end

    describe "GET #index" do
        it "returns unauthorized if no auth token provided" do
            get '/events/1/invitees'

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns unauthorized if user id does not equal host id" do
            get '/events/2/invitees', headers: { "Authorization": "Bearer #{@token}"}

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns a singular participant for an event" do
            get '/events/4/invitees', headers: { "Authorization": "Bearer #{@token}"}

            @res = JSON.parse(response.body)

            expect(@res[0]["id"]).to eq(2)
        end

        it "returns multiple participants for an event" do
            get '/events/1/invitees', headers: { "Authorization": "Bearer #{@token}"}
    
            @res = JSON.parse(response.body)

            expect(@res[0]["id"]).to eq(2)
            expect(@res[1]["id"]).to eq(3)
        end
    end
    
    describe "POST #create" do
        it "returns unauthorized if no auth token provided" do
            post '/events/1/invitees'

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns unauthorized if user id does not match host id" do
            post '/events/3/invitees',  headers: { "Authorization": "Bearer #{@token}"}

            expect(response).to have_http_status(:unauthorized)
        end

        it "creates a new invitee, returns id" do
            post '/events/4/invitees', headers: { "Authorization": "Bearer #{@token}" }, params: {user_id: 3,
            event_id: 4,
            questionnaire_complete: 0}

            @res = JSON.parse(response.body)

            expect(@res["id"]).to eq(11)
        end
    end
end
