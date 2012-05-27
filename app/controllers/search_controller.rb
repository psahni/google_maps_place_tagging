class SearchController < ApplicationController

  def index
    @places = Place.find_all_with_tag(params[:search])
    render :template => 'places/index.html.erb'
  end

end
