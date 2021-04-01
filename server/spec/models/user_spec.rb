require 'rails_helper'

RSpec.describe User, type: :model do
  it "does not validate when not all fields other than privacy_level are provided" do
    @user = User.new()

    expect(@user.valid?).to be false
  end

  it "successfully creates a new user entry when all fields are valid" do
    @quest = Questionnaire.create()
    User.create(email: "testemail@email.com", 
      first_name: "name", 
      last_name: "namename", 
      password: "password",
      password_confirmation: "password",
      questionnaire_id: @quest.id,
      privacy_level: 1
    )

    @user = User.find_by(email: 'testemail@email.com')

    expect(@user).to be_truthy
  end

  it "sets privacy_level to be true (1) if not provided" do
    @quest = Questionnaire.create()
    User.create(email: "testemail@email.com", 
      first_name: "name", 
      last_name: "namename", 
      password: "password",
      password_confirmation: "password",
      questionnaire_id: @quest.id,
    )

    @user = User.find_by(email: 'testemail@email.com')

    expect(@user.privacy_level).to be 1
  end
end
