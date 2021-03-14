class User < ApplicationRecord
    has_secure_password

    has_many :participants
    has_many :events

    alias_attribute :password_digest, :password_hash
end
