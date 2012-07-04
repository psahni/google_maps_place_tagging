namespace :place_app   do
	
	desc  "=> Add country to place"
	task :add_country_to_place => :environment  do 
	  
	  Place.all.each do |place|
	    puts "==> fetching country for place #{ place.name }"
	    country = Country.find_or_create_by_name(place.country_via_reverse_geocoding)
	    puts "==> Country fetched #{ country.name }"
	    place.country = country
	    place.save!
	  end

	end ##Task

end