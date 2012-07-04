class AddCountryIdToPlace < ActiveRecord::Migration
  def change
  	add_column :places, :country_id, :integer
  end
end
