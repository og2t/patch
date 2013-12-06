// Avoid `console` errors in browsers that lack a console.
(function() {

var map;
var layer = "watercolor";

function initialize() {

  var map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: new google.maps.LatLng(59.3571220,18.0552270),
    zoom: 15,
    mapTypeId: layer,
    mapTypeControlOptions: {
        mapTypeIds: [layer]
    }
  });
  map.mapTypes.set(layer, new google.maps.StamenMapType(layer));

  // // Init parse 
  // Parse.initialize(wFUtsCkSqOff2CzUc1T5v75quD4kgy0hzenu6PQy, 
  //                  4LnUhkWbhKNAs3N5rzGtgDoVz38NdxxhL6gPMbBg);
    
  // var TestObject = Parse.Object.extend("TestObject");
  // var testObject = new TestObject();
  //   testObject.save({foo: "bar"}, {
  //   success: function(object) {
  //     $(".success").show();
  //   },
  //   error: function(model, error) {
  //     $(".error").show();
  //   }
  // });
}
google.maps.event.addDomListener(window, 'load', initialize);
    
}());