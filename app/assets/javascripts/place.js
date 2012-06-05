
window.onload = function(){
    latitudeField  = document.getElementById('place_latitude');
    longitudeField = document.getElementById('place_longitude');
    locate_button  = document.getElementById('locate_button');
} 



var LATITUDE, LONGITUDE, MAP, latitudeField, longitudeField, locate_button;
var initial_guide_text = 'Just move the mouse on the map to fill latitude and longitude ( click on the map to save )';
var guide_text_after_save = 'Just focus on one of the coordinates fields and move the mouse on the map to change latitude and longitude' ;
var coordinates_focus_event_needed = false;
var minLengthForAddressField = 8;
var wait = false;
var markers = [];


function success(position){

   var mapcanvas = document.createElement('div');
   mapcanvas.id  = 'mapcanvas';
   mapcanvas.style.height = '670px';
   mapcanvas.style.width  = '1265px';
   document.getElementById('map').innerHTML = '';
   document.getElementById('map').appendChild(mapcanvas);
   
   LATITUDE =  position.coords.latitude;  
   LONGITUDE = position.coords.longitude; 
   
   var latlng = new google.maps.LatLng(LATITUDE, LONGITUDE);
   
   var myOptions = {
      mapTypeControl: false,
      zoom: 11,
      center: latlng,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  
  MAP = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

  /*var infowindow = new google.maps.InfoWindow({
    content: "You are here"
  });
  
  infowindow.open(MAP, latlng);
  */
 
  var marker = new google.maps.Marker({
    position: latlng,
    map: MAP,
    title:"You are here!"
  });

  markers.push(marker);
 
 
 google.maps.event.addListener(marker, 'click', function() {
   infowindow.open(MAP,marker);  
 });
 
  google.maps.event.addListener(MAP, 'mousemove', function(event) {
    latitudeField.style.background = longitudeField.style.background ='yellow'; 
    //console.log(event.latLng.lat())
    latitudeField.value  =  event.latLng.lat();
    longitudeField.value =  event.latLng.lng();
  });
  
  
  google.maps.event.addListener(MAP, 'click', function(event) {
    latitudeField.style.background = longitudeField.style.background ='yellow';
    removeListenerToCoordinates();
    document.getElementById('text_guide').innerHTML =  guide_text_after_save;
    jQuery('#text_guide').fadeOut();
    jQuery('#text_guide').fadeIn();
    jQuery('input.coordinates').blur();
    latitudeField.value  =  event.latLng.lat();
    longitudeField.value =  event.latLng.lng();
    coordinates_focus_event_needed = true
    afterSaveEventToCoordinateField();
  });
  

  
  google.maps.event.addListener(MAP, 'mouseout', function(event) {
    latitudeField.style.background = longitudeField.style.background ='white'; 
  });
  
 marker.setMap(MAP);
}

/*--------------------------------------------------------------------*/

function error(){
  $('#map').html('Can not locate your current location')
}

/*--------------------------------------------------------------------*/
/*28.57, 77.32*/
function markLocations(places_array){   
   
   var mapcanvas = document.createElement('div');
   
   mapcanvas.id  = 'mapcanvas';
   mapcanvas.style.height = '670px';
   mapcanvas.style.width  = '1265px';
   
   document.getElementById('map').innerHTML = '';
   document.getElementById('map').appendChild(mapcanvas);
   
   var myOptions = {
      mapTypeControl: false,
      zoom: 12,
      center: new google.maps.LatLng(0,0),
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  
   MAP = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
   
   var bounds = new google.maps.LatLngBounds();
   
   for( i=0; i < places_array.markers.length; i++){
    
    var lat = places_array.markers[i].latitude;  
    var lng = places_array.markers[i].longitude; 
    var latlng = new google.maps.LatLng(lat, lng)   
    marker = new google.maps.Marker({
        position: latlng,
        map: MAP,
        draggable: false,
        animation: google.maps.Animation.DROP
    });
    
    bounds.extend(latlng);
    MAP.fitBounds(bounds); 
    
    setTimeout(function(){ 
        markers.push( marker); 
     }, '2000');
    
   } 
} 
/*--------------------------------------------------------------------*/

function afterSaveEventToCoordinateField(){
    if( coordinates_focus_event_needed ){
        coordinates_focus_event_needed = false;
        jQuery('input.coordinates').bind('focus', function(){
        addListenerToCoordinates() 
      });
    }
}

/*--------------------------------------------------------------------*/

function markCurrentLocation(){
    if (navigator.geolocation) 
     navigator.geolocation.getCurrentPosition(success, error);
    else
      error('not supported');
}

/*--------------------------------------------------------------------*/

function addListenerToCoordinates(){
    google.maps.event.addListener(MAP, 'mousemove', function(event) {
      document.getElementById('text_guide').innerHTML = initial_guide_text;
      latitudeField.style.background = longitudeField.style.background ='yellow'; 
      latitudeField.value  =  event.latLng.lat();
      longitudeField.value =  event.latLng.lng();
    });
}

/*--------------------------------------------------------------------*/

function removeListenerToCoordinates(){
    google.maps.event.clearListeners(MAP, 'mousemove', function(event){}); 
}

/*--------------------------------------------------------------------*/

function resetAddressField(){
    var timer;
    $('#place_address').removeClass('no-validate');
    removeListenerToCoordinates()
   // $('.coordinates').addClass('no-validate').val(''); 
    unWrapErrorMessage();
    $('#place_address_visible').val('true');
    $('#place_address')
    .live('focus', function(){
        /* There must be some better way to do it */
        //if(document.activeElement == $(this)[0] && $(this).val().length > minLengthForAddressField && !wait) 
        $(locate_button).removeAttr('disabled');
        timer = setInterval("if( document.activeElement == $('#place_address')[0] && $('#place_address').val().length > minLengthForAddressField && !wait)  fetchCoordinates()", 15000);
    })
    .live('blur', function(){
        clearInterval(timer);
        if( latitudeField.value.length > 0 && longitudeField.value.length > 0)
            setTimeout("mapCoordinates()", 1000);
    });
}

/*--------------------------------------------------------------------*/

function resetCoordinatesField(){
    $('#place_address').addClass('no-validate'); 
    addListenerToCoordinates();
    $('.coordinates').removeClass('no-validate'); 
    unWrapErrorMessage();
    $('#place_address_visible').val('false');
}

/*--------------------------------------------------------------------*/

function fetchCoordinates(){
    wait = true;
    var url = $('#url_for_request_coordinates').val();
    var jqxhr = $.get(url, { address: $('#place_address').val() })
    .success( function(response){ 
        wait = false;
        if( response.lat == null  || response.lng == null ){
            $('#place_address').blur();
            locate_button.disabled = 'disabled';
           }
        else{
             $('#place_latitude').val(response.lat);
             $('#place_longitude').val(response.lng);
             mapCoordinates();
          }
     })
    .error(function(){
        wait = false; 
        alert("Oops! Something went wrong..working on it.."); 
     });
}

/*--------------------------------------------------------------------*/

function mapCoordinates(){
   clearOverlays();
   var latlng = new google.maps.LatLng($('#place_latitude').val(), $('#place_longitude').val() );
   var myOptions = {
      mapTypeControl: false,
      zoom: 11,
      center: latlng,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var marker = new google.maps.Marker({
        position: latlng,
        map: MAP,
        title:"You are here!"
  });
  MAP = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
  markers.push(marker);
  marker.setMap(MAP);
}

/*--------------------------------------------------------------------*/

function clearOverlays() {
  if (markers) {
    for (var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }
  }  
}

/*--------------------------------------------------------------------*/

$(function(){
    $('#place_tag_list').tagsInput({
       placeholderColor: '#3A87AD'     
    });
    $('input.coordinates').bind('keydown', function(e){
        return false;
    });
    $('#locate_button').bind('click', function(e){
        e.preventDefault;
        fetchCoordinates();
        return false;
    });
});

