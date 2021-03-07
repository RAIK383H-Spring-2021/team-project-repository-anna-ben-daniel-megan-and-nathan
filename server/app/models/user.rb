class User < ApplicationRecord
    has_secure_password

    alias_attribute :password_digest, :password_hash
end
