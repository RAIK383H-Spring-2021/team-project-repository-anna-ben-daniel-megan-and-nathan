require "test_helper"

class SuggestionsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get "/events/:event_id/suggestions/"
    assert_response :success
  end

  test "should get show" do
    get "/events/:event_id/suggestions/:suggestion_id/"
    assert_response :success
  end
end
