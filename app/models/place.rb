class Place < ActiveRecord::Base
  acts_as_taggable
  
  #=> Validations
  
  validates :name, :latitude, :longitude,  :presence => :true
end
