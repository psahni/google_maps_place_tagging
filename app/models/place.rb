class Place < ActiveRecord::Base
  acts_as_taggable
  
  #=> Validations
  validates :name, :latitude, :longitude,  :presence => :true
  
  attr_accessor :address_line_1, :address_line_2
end
