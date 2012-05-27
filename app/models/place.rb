class Place < ActiveRecord::Base


  acts_as_taggable
  

  
  scope :name_blank, where('name IS NOT NULL')
  #=> Validations  
 
  validates :name, :latitude, :longitude, :presence => :true 
  
  validates :address, :presence => :true , :if => lambda{|o| o.coordinates_blank? }
  
  validates :name, :uniqueness => :true
  
  def coordinates_blank?
    latitude.blank? && longitude.blank?
  end

  def self.find_all_with_tag(tag_str)
    tagged_with(tag_str)    
  end  
end

#https://github.com/mbleigh/acts-as-taggable-on