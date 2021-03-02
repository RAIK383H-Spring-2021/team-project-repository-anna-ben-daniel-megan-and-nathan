require "test_helper"

class InviteesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get "/events/:event_id/invitees/"
    assert_response :success
  end

  test "should get create" do
    post "/events/:event_id/invitees/"
    assert_response :success
  end
end
