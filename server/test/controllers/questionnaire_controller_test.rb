require "test_helper"

class QuestionnaireControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get "/users/:id/questionnaire/"
    assert_response :success
  end

  test "should get update" do
    put "/users/:id/questionnaire/"
    assert_response :success
  end
end
