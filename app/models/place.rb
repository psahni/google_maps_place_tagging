class Place < ActiveRecord::Base


  acts_as_taggable
  
  attr_accessor :address_visible
  
  scope :name_blank, where('name IS NOT NULL')

  #=> Validations  
 
  validates :name, :latitude, :longitude, :presence => :true 
  
  validates :address, :presence => :true , :if => lambda{|o| o.coordinates_blank? }
  
  validates :name, :uniqueness => :true
  
  def coordinates_blank?
    return true if address_visible?
    latitude.blank? && longitude.blank?
  end

  def self.find_all_with_tag(tag_str)
    tagged_with(tag_str)    
  end
  
  def address_visible?
    address_visible == 'true'
  end  
end

#https://github.com/mbleigh/acts-as-taggable-on
