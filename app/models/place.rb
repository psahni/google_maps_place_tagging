class Place < ActiveRecord::Base


  acts_as_taggable
  

  
  
  #=> Validations  
 
  validates :name, :latitude, :longitude, :presence => :true 
  
  validates :address, :presence => :true , :if => lambda{|o| o.coordinates_blank? }
  
  validates :name, :uniqueness => :true
  
  def coordinates_blank?
    latitude.blank? && longitude.blank?
  end
  
end
