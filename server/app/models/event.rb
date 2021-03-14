class Event < ApplicationRecord
    belongs_to :user
    has_many :participants

    alias_attribute :user_id, :host_id
end
