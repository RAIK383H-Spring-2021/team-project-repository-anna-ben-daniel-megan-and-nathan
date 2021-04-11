class Event < ApplicationRecord
    belongs_to :user, optional: true
    has_many :participants

    alias_attribute :user_id, :host_id

    validates :title, :date_time, :location, presence:true

    before_save :default_values

    private

    def default_values
      self.food_prepackaged = false if self.food_prepackaged.nil?
      self.food_buffet = false if self.food_buffet.nil?
      self.indoor = false if self.indoor.nil?
      self.outdoor = false if self.outdoor.nil?
      self.remote = false if self.remote.nil?
    end
end
