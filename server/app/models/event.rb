class Event < ApplicationRecord
    belongs_to :user, optional: true
    has_many :participants

    alias_attribute :user_id, :host_id
end
