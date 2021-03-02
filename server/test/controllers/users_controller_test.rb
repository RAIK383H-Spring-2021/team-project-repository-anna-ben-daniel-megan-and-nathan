require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get "/users/"
    assert_response :success
  end

  test "should get create" do
    post "/users/"
    assert_response :success
  end

  test "should get show" do
    get "/users/:user_id"
    assert_response :success
  end

  test "should get update" do
    put "/users/:user_id"
    assert_response :success
  end

  test "should get login" do
    get "/users/login"
    assert_response :success
  end

  test "should get invitations" do
    get "/users/:id/invitations"
    assert_response :success
  end

  test "should get events" do
    get "/users/:id/events"
    assert_response :success
  end
end
