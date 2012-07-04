class Place < ActiveRecord::Base


  acts_as_taggable
  
  attr_accessor :address_visible
  
  scope :name_blank, where('name IS NOT NULL')

  belongs_to :country

  #=> Validations  
 
  validates :name, :latitude, :longitude, :presence => :true 
  
  validates :address, :presence => :true , :if => lambda{|o| o.coordinates_blank? }
  
  validates :name, :uniqueness => :true

  validate :locate_the_address_on_map


  #before_save :associate_country

  def locate_the_address_on_map
    if address_visible? && !address.blank? && latitude.blank? && longitude.blank?
      errors.add(:address, "Address is not located on the map")
    end
  end

  
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

  def associate_country
    self.country = Country.find_or_create_by_name(country_via_reverse_geocoding)
  end


  def country_via_reverse_geocoding
    result = Geocoder.search([self.latitude, self.longitude])
    result.first.country
  end

end

#https://github.com/mbleigh/acts-as-taggable-on
