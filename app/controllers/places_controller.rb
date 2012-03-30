class PlacesController < ApplicationController
  
  def index
  end


  def new
    @place = Place.new
  end


  def create
    @place = Place.new(params[:place])
    if @place.save
      respond_to do |format|
        format.html { redirect_to @place, :notice => 'Place has been successfullu created' }
        format.js {}
     end
    else
      respond_to do |format|
        format.html{ render 'new'}
        format.js { render :json => { :errors => @place.errors, :status => :unprocessable_entity   } }
      end
    end #if-else
  end  
  
  def fetch_coordinates
    
  end
  
end
