// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
/* require_tree .*/




$(function(){
    $('form.validate')
    .bind('ajax:error', function(event, response, status, xhr){
        var form = $(this);
        var data = $.parseJSON(response.responseText);    
        $.each(data.errors, function(k, v){
            wrapErrorMessage(k , v, form.attr('resource'));
        });
    });
});

/* function for inserting error messages */
var wrapErrorMessage = function( label, message, resource ){
    var input_field = $('#' + resource + '_' + label );
    if( !input_field.parent().hasClass('field_with_errors') ){
        var wrapper  = $('<div/>').addClass('field_with_errors')
        input_field.wrap(wrapper);
        var error_label = $('<label for = ' + resource + '_' + label + ' class=' + 'message>' + message + '</label>')
        error_label.insertAfter(input_field)
     }
  }
  
$(function(){
   $('.toggle').bind('click', function(e){
     e.preventDefault();
     var target  = $(this).attr('target');
     var source = $(this).attr('source');
     $('#' + target).toggle('slow');
     if(source.length){
       $('#' + source).hide('fast');
     }
   });
});
