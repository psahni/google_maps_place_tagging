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



var LATITUDE, LONGITUDE; 

function success(position){

   var mapcanvas = document.createElement('div');
   mapcanvas.id  = 'mapcanvas';
   mapcanvas.style.height = '300px';
   mapcanvas.style.width  = '500px';
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
    title:"You are here!"
  });

 infowindow.open(MAP,marker);
 
 google.maps.event.addListener(marker, 'click', function() {
  infowindow.open(MAP,marker);  
 });

 marker.setMap(MAP);
}

function error(){

}
 

  
function markCurrentLocation(){
    if (navigator.geolocation) 
     navigator.geolocation.getCurrentPosition(success, error);
    else
      error('not supported');

}

setTimeout('markCurrentLocation()', 1000)
