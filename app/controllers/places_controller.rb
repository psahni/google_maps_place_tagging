class PlacesController < ApplicationController
  
  
  def index
  end


  def new
    @place = Place.new
  end


  def create
    @place = Place.new(params[:place])
    if @place.save
      redirect_to @place, :notice => 'Place has been successfullu created'
    else
      render 'new'
    end
  end  
  
end
