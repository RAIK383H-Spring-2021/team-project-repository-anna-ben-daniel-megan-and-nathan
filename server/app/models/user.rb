class User < ApplicationRecord
    has_secure_password

    has_many :participants
    has_many :events
    belongs_to :questionnaire

    alias_attribute :password_digest, :password_hash

    validates :first_name, :last_name, :password, :questionnaire_id, presence: true
    before_save :default_values

    private

    def default_values
      self.privacy_level = 1 if self.privacy_level.nil?
    end
end
