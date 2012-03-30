/*var head       = document.getElementsByTagName('head')[0];
var script     = document.createElement('script');
script.type    = 'text/javascript';

script.onload  = script.onreadystatechange = function(){ 
  if(google){
    markCurrentLocation();
  }
  
} 

script.src= "http://maps.googleapis.com/maps/api/js?sensor=false" ;   
head.appendChild(script);
*/



var LATITUDE, LONGITUDE, MAP, latitudeField, longitudeField;
var initial_guide_text = 'Just move the mouse on the map to fill latitude and longitude ( click on the map to save )';
var guide_text_after_save = 'Just focus on one of the coordinates fields and move the mouse on the map to change latitude and longitude' 
var coordinates_focus_event_needed = false;

window.onload = function(){
    latitudeField  = document.getElementById('place_latitude');
    longitudeField = document.getElementById('place_longitude');
} 

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
      zoom: 10,
      center: latlng,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  
  MAP = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

  var infowindow = new google.maps.InfoWindow({
    content: "<p>You are here</p>"
  });

  var marker = new google.maps.Marker({
    position: latlng,
    map: MAP,
    title:"You are here!"
  });

/* infowindow.open(MAP,marker); */
 
 
 /*google.maps.event.addListener(marker, 'click', function() {
   infowindow.open(MAP,marker);  
 });*/
 
  google.maps.event.addListener(MAP, 'mousemove', function(point) {
    latitudeField.style.background = longitudeField.style.background ='yellow'; 
    latitudeField.value  =  point.latLng.Ta;
    longitudeField.value =  point.latLng.Ua;
  });
  
  
  google.maps.event.addListener(MAP, 'click', function(point) {
    latitudeField.style.background = longitudeField.style.background ='yellow';
    google.maps.event.clearListeners(MAP, 'mousemove', function(point){});
    document.getElementById('text_guide').innerHTML =  guide_text_after_save;
    jQuery('#text_guide').fadeOut();
    jQuery('#text_guide').fadeIn();
    jQuery('input.coordinates').blur();
    latitudeField.value  =  point.latLng.Ta;
    longitudeField.value =  point.latLng.Ua;
    coordinates_focus_event_needed = true
    afterSaveEventToCoordinateField();
  });
  

  
  google.maps.event.addListener(MAP, 'mouseout', function(point) {
    latitudeField.style.background = longitudeField.style.background ='white'; 
  });
  
 marker.setMap(MAP);
}

/*--------------------------------------------------------------------*/

function error(){
  alert('Can not locate your current location')
}
 
/*--------------------------------------------------------------------*/

function afterSaveEventToCoordinateField(){
    if( coordinates_focus_event_needed ){
        coordinates_focus_event_needed = false;
        jQuery('input.coordinates').bind('focus', function(){
         google.maps.event.addListener(MAP, 'mousemove', function(point) {
          document.getElementById('text_guide').innerHTML = initial_guide_text;
          latitudeField.style.background = longitudeField.style.background ='yellow'; 
          latitudeField.value  =  point.latLng.Ta;
          longitudeField.value =  point.latLng.Ua;
        });
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

/* Starting Point */
setTimeout('markCurrentLocation()', 1000);

$(function(){
    $('#place_tag_list').tagsInput({
       placeholderColor: '#3A87AD'     
    });
    $('input.coordinates').bind('keydown', function(e){
        return false;
    });
});
