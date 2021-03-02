require "test_helper"

class EventsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    post "/events/"
    assert_response :success
  end

  test "should get show" do
    get "/events/:event_id/"
    assert_response :success
  end

  test "should get update" do
    put "/events/:event_id/"
    assert_response :success
  end

  test "should get destroy" do
    delete "/events/:event_id"
    assert_response :success
  end
end
