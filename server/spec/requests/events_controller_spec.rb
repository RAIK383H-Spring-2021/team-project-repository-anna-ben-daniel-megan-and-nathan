require 'rails_helper'

RSpec.describe "events controller requests", type: :request do
    before do
        # get token for authentication purposes
        post '/users/login', params: { email: "test@test.test", password: "password" }
        @res = JSON.parse(response.body)
        @token = @res["token"]
    
        # get user corresponding to above auth token
        @user = User.find_by(email: "test@test.test")
    end

    describe "POST #create" do
        it "returns unauthorized if no auth token provided" do 
            post '/events'

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns conflict http error when required fields not included" do
            post '/events', headers: { "Authorization": "Bearer #{@token}"}, params: { food_prepackaged: true }
    
            expect(response).to have_http_status(:unprocessable_entity)
        end

        it "returns id when event created" do
            post '/events', headers: { "Authorization": "Bearer #{@token}"}, params: { title: "Updated Title", 
            host_id: 2,
            description: "test event",
            date_time: Time.now,
            food_prepackaged: true,
            food_buffet: false,
            location: "test",
            indoor: true,
            outdoor: false,
            remote: false,
            score: 1 }

            @res = JSON.parse(response.body)

            expect(@res["id"]).to eq(10)
        end
    end

    describe "GET #show" do
        it "returns unauthorized http error if no auth token provided" do
            get "/events/1"
    
            expect(response).to have_http_status(:unauthorized)
        end

        it "returns unauthorized http error if the auth id is not a participant or host" do 
            post '/users/login', params: { email: "no@event.user", password: "password" }
            @resIndividualTest = JSON.parse(response.body)
            @tokenIndividualTest = @resIndividualTest["token"]

            get "/events/2", headers: { "Authorization": "Bearer #{@tokenIndividualTest}"}

            @res = JSON.parse(response.body)

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns not found http error if event does not exist" do 
            get "/events/50", headers: { "Authorization": "Bearer #{@token}"}

            expect(response).to have_http_status(:not_found)
        end

        it "gets event 2 correctly" do
            get "/events/2", headers: { "Authorization": "Bearer #{@token}"}
  
           @res = JSON.parse(response.body)

            expect(@res["event"]["title"]).to eq("invited test")
        end

        it "gets event 1 correctly" do
            get "/events/1", headers: { "Authorization": "Bearer #{@token}"}
  
            @res = JSON.parse(response.body)

            expect(@res["event"]["title"]).to eq("test")
        end
    end

    describe "PUT #update" do
        it "returns unauthorized http error if no auth token given" do
            put "/events/1"

            expect(response).to have_http_status(:unauthorized)
        end

        it "returns unauthorized http error if auth id is not the host id" do
            put "/events/2", headers: { "Authorization": "Bearer #{@token}"}, params: { title: "Updated Title", 
            host_id: 2,
            description: "test event",
            date_time: Time.now,
            food_prepackaged: true,
            food_buffet: false,
            location: "test",
            indoor: true,
            outdoor: false,
            remote: false,
            score: 1 }

            expect(response).to have_http_status(:unauthorized)
        end

        it "update event 1" do 
            put "/events/1", headers: { "Authorization": "Bearer #{@token}"}, params: { title: "Updated Title", 
            host_id: 2,
            description: "test event",
            date_time: Time.now,
            food_prepackaged: true,
            food_buffet: false,
            location: "test",
            indoor: true,
            outdoor: false,
            remote: false,
            score: 1 }

            @res = JSON.parse(response.body)

            expect(@res["title"]).to eq("Updated Title")
            expect(@res["host_id"]).to eq(2)
        end
    end

    describe "DEL #destroy" do
        it "destroy event with 2 participants" do
            delete "/events/1", headers: { "Authorization": "Bearer #{@token}"}

            expect(response).to have_http_status(:ok)
        end

        it "destroy event returns unauthorized if user is not the host" do
            delete "/events/2", headers: { "Authorization": "Bearer #{@token}"}

            expect(response).to have_http_status(:unauthorized)
        end

        it "destroy event one, but not authorized" do
            delete "/events/1"

            expect(response).to have_http_status(:unauthorized)
        end
    end
end