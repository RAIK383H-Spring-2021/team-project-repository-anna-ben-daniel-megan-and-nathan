require "test_helper"

class InviteesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get invitees_index_url
    assert_response :success
  end

  test "should get create" do
    get invitees_create_url
    assert_response :success
  end
end
