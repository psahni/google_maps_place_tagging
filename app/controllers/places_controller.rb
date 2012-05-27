class PlacesController < ApplicationController
  
  def index
    @places = Place.all :include => :tags
    respond_to do |format|
      format.html
      format.json{ 
              render :json => { :markers => @places }
          }
    end
  end


  def new
    @place = Place.new
    render :layout => 'map'
  end


  def create
    @place = Place.new(params[:place])
    if @saved = @place.save
      respond_to do |format|
        format.html { redirect_to @place, :notice => 'Place has been successfully created' }
        format.js {}
     end
    else
      respond_to do |format|
        format.html{ render 'new'}
        format.js { render :json => { :errors => @place.errors, :status => :unprocessable_entity   } }
      end
    end #if-else
  end  

  def edit
    
  end
  
  def update
    
  end
    
  def fetch_coordinates
    address =  params[:address]
    lat,lan = Geocoder.coordinates(address)
    render :json => { :lat => lat, :lng => lan}
  end
  
  def full_map
    render :layout => 'map'
  end
  
end
