// Avoid `console` errors in browsers that lack a console.
(function() {

  var CUSTOM_STYLES = !true;
  var lat=59.3571220;
  var lon=18.0552270;
  var map;

  var markers = [];
  var patches = [];

  function initialize() {

    if (CUSTOM_STYLES) {

      /*
      var layer = "watercolor";
      map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: new google.maps.LatLng(lat, lon),
        zoom: 15,
        mapTypeId: layer,
        mapTypeControlOptions: {
            mapTypeIds: [layer]
        }
      });

      map.mapTypes.set(layer, new google.maps.StamenMapType(layer));
      console.log(layer);
      */
      var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(59.3571220,18.0552270)
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      

    } else {
      // var kmlUrl = '/kml/dzialka.kml';
      // var kmlOptions = {
      //   suppressInfoWindows: !true,
      //   preserveViewport: false,
      //   map: map
      // };
      // var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);


      // Create an array of styles.
      var styles = [
        {
          stylers: [
            { hue: 0 },
            { saturation: -60 }
          ]
        },{
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { lightness: 100 },
            { visibility: "simplified" }
          ]
        },{
          featureType: "road",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        }
      ];

    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles,
      {name: "Patchmap"});

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng(lat, lon),
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

    console.log('>>>', input)    

    var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();

      // For each place, get the icon, place name, and location.
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        bounds.extend(place.geometry.location);
      }

      map.fitBounds(bounds);
    });
    // [END region_getplaces]

  }

    // Init parse 
    Parse.initialize("wFUtsCkSqOff2CzUc1T5v75quD4kgy0hzenu6PQy", "4LnUhkWbhKNAs3N5rzGtgDoVz38NdxxhL6gPMbBg");

    var PatchObject = Parse.Object.extend("patch");
    var query = new Parse.Query(PatchObject);
    query.find({
      success: function(results) {
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) { 
          var owner    = results[i].get("owner");
          var farmer   = results[i].get("farmer");
          var location = results[i].get("location");
          var process  = results[i].get("process");
          var product  = results[i].get("product");
          var radius   = results[i].get("radius");

          console.log("PATCH: " + owner + ", " + farmer + ", " + location.latitude + ", " + location.longitude + ", " + process + ", " + product );
          patches[i] =  results[i];    

          var myLatlng = new google.maps.LatLng(location.latitude, location.longitude);
          // Construct the circle for each value in citymap.
          // Note: We scale the population by a factor of 20.
          var populationOptions = {
            strokeColor: '#00FF00',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 0.35,
            map: map,
            center: myLatlng,
            radius: radius
          };
          // Add the circle for this city to the map.
          cityCircle = new google.maps.Circle(populationOptions);

          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title:"Hello World!"
          });
          markers.push(marker);      
        }

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
    });
  }

  // Init
  google.maps.event.addDomListener(window, 'load', initialize);

}());
