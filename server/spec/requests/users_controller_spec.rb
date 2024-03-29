require 'rails_helper'

RSpec.describe "user controller requests", type: :request do
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
      get '/users'

      expect(response).to have_http_status(:unauthorized)
    end

    it "does not return the authorized user's email, meaning they can't search for themselves to add as an invitee" do
      get '/users', params: { q: "test@test.test" }, headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res["users"]).to be_empty
    end

    it "gets all users matching query when user is authenticated" do
      get '/users', params: { q: "" }, headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res.keys).to match_array(["users"])
      expect(@res["users"][0]["email"]).to eq("hello@hello.hello")
    end
  end

  describe "POST #create" do
    it "returns conflict http error when email already exists" do
      post '/users', params: { email: "test@test.test" }

      expect(response).to have_http_status(:conflict)
    end

    it "returns unprocessable entity http error if any fields other than privacy are not provided" do
      post '/users', params: { email: "testemail@email.com" }

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "successfully encodes token and sends back after user creation" do
      post '/users', params: { email: "testemail@email.com", first_name: "name", last_name: "namename", password: "password" }

      @res = JSON.parse(response.body)

      expect(@res.keys).to match_array(["token"])
    end
  end

  describe "GET #show" do
    it "returns unauthorized http error if no auth token provided" do
      get "/users/#{@user.id}"

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns unauthorized http error if auth token provided but attempts to get information for user other than self" do
      get "/users/#{@user.id + 1}", headers: { "Authorization": "Bearer #{@token}"}

      expect(response).to have_http_status(:unauthorized)
    end

    it "gets all hosted events correctly" do
      get "/users/#{@user.id}", headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res["hosted_events"][0]["title"]).to eq("test")
    end
    it "gets all invited events correctly" do
      get "/users/#{@user.id}", headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res["invited_events"][0]["title"]).to eq("invited test")
    end
  end

  describe "PUT #update" do
    it "returns unauthorized http error if no auth token provided" do
      put "/users/#{@user.id}"

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns unauthorized http error if auth token provided but attempts to get information for user other than self" do
      put "/users/#{@user.id + 1}", headers: { "Authorization": "Bearer #{@token}"}

      expect(response).to have_http_status(:unauthorized)
    end

    it "should properly update provided user information" do
      put "/users/#{@user.id}", params: {email: "updated", first_name: "updated", last_name: "updated", password: "password", privacy_level: 1}, headers: { "Authorization": "Bearer #{@token}"}

      @updated_user = User.find(@user.id)

      expect(response).to have_http_status(:success)
      expect(@updated_user.email).to eq("updated")
      expect(@updated_user.first_name).to eq("updated")
      expect(@updated_user.last_name).to eq("updated")
    end
  end

  describe "POST #login" do
    it "returns not found http error when invalid email provided" do
      post '/users/login', params: { email: "lol" }

      expect(response).to have_http_status(:not_found)
    end

    it "returns unauthorized http error when invalid email provided" do
      post '/users/login', params: { email: "test@test.test", password: "lol" }

      expect(response).to have_http_status(:unauthorized)
    end

    it "correctly returns token when valid login provided" do
      post '/users/login', params: { email: "test@test.test", password: "password" }

      @res = JSON.parse(response.body)
      expect(@res.keys).to match_array(["token"])
    end
  end

  describe "GET #invitations" do
    it "returns unauthorized http error if no auth token provided" do
      get "/users/#{@user.id}/invitations"

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns unauthorized http error if auth token provided but attempts to get information for user other than self" do
      get "/users/#{@user.id + 1}/invitations", headers: { "Authorization": "Bearer #{@token}"}

      expect(response).to have_http_status(:unauthorized)
    end

    it "properly gets new (questionnaire incomplete) events for user" do
      get "/users/#{@user.id}/invitations", headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res["new_events"][0]["title"]).to eq("invited test incomplete")
    end

    it "properly gets other (questionnaire complete) events for user" do
      get "/users/#{@user.id}/invitations", headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res["other_events"][0]["title"]).to eq("invited test")
    end
  end

  describe "GET #events" do
    before do
      # gets token/user object for a user with no hosted events
      post '/users/login', params: { email: "no@event.user", password: "password" }
      @res = JSON.parse(response.body)
      @no_event_token = @res["token"]

      # get user
      @no_event_user = User.find_by(email: "no@event.user")
    end

    it "returns unauthorized http error if no auth token provided" do
      get "/users/#{@user.id}/events"

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns unauthorized http error if auth token provided but attempts to get information for user other than self" do
      get "/users/#{@user.id + 1}/events", headers: { "Authorization": "Bearer #{@token}"}

      expect(response).to have_http_status(:unauthorized)
    end

    it "properly gets events when user has hosted events" do
      get "/users/#{@user.id}/events", headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res["events"][0]["title"]).to eq("test")
    end

    it "properly returns empty array when user has no hosted events" do
      get "/users/#{@no_event_user.id}/events", headers: { "Authorization": "Bearer #{@no_event_token}"}

      @res = JSON.parse(response.body)

      expect(@res["events"]).to be_empty
    end
  end
end
