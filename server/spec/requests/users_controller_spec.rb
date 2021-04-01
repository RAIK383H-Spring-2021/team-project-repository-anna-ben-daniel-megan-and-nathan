require 'rails_helper'

RSpec.describe "testing user controller", type: :request do
  before do
    # create dummy data (used for authentication purposes)
    @quest = Questionnaire.create()
    User.create(email: "test@test.test", 
      first_name: "first", 
      last_name: "last",
      password: "password",
      password_confirmation: "password",
      questionnaire_id: @quest.id,
      privacy_level: 1
    )
  end

  describe "GET #index" do
    before do
      post '/users/login', params: { email: "test@test.test", password: "password" }
      @res = JSON.parse(response.body)
      @token = @res["token"]

    end

    it "returns unauthorized when user is not authenticated" do
      get '/users'

      expect(response).to have_http_status(:unauthorized)
    end

    it "gets all users matching query when user is authenticated" do
      get '/users', params: { q: "" }, headers: { "Authorization": "Bearer #{@token}"}

      @res = JSON.parse(response.body)

      expect(@res.keys).to match_array(["users"])
      expect(@res["users"][0]["email"]).to eq("test@test.test")
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
end
