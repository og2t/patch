// Avoid `console` errors in browsers that lack a console.
(function() {

  var CUSTOM_STYLES = true;
  var lat = 59.3571220;
  var lon = 18.0552270;
  var map;
  var searchBox;

  var markers = [];
  var patches = [];
  var users   = [];

  function initialize() {

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

    searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));

    if (CUSTOM_STYLES) {

      var layer = "watercolor";
      map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: new google.maps.LatLng(lat, lon),
        zoom: 2,
        mapTypeId: layer,
        mapTypeControlOptions: {
            mapTypeIds: [layer]
        }
      });

      map.mapTypes.set(layer, new google.maps.StamenMapType(layer));

    } else {

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

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
  }

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

    // doesn't work but still...
    google.maps.event.addListener(map,'mouseover',function(e){
      $('html, body').stop();
    });

    // Init parse 
    Parse.initialize("wFUtsCkSqOff2CzUc1T5v75quD4kgy0hzenu6PQy", "4LnUhkWbhKNAs3N5rzGtgDoVz38NdxxhL6gPMbBg");

    // users 
    var UserObject = Parse.Object.extend("User");
    var queryUser = new Parse.Query(UserObject);
    queryUser.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
          users[i] = results[i];

          var user     = results[i].get("username");
          var email    = results[i].get("email");
          var objectId = results[i].id;
          var role     = results[i].get("role");

          console.log("USER: " + objectId + ", " + user + ", " + email + ", " + role);
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

    // patches 
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

          var circleColor = '#007733';
          if (process > 0) {
            circleColor = '#222222';
          }

          var myLatlng = new google.maps.LatLng(location.latitude, location.longitude);
          // Construct the circle for each value in citymap.
          // Note: We scale the population by a factor of 20.
          var populationOptions = {
            strokeColor: circleColor,
            strokeOpacity: 0.9,
            strokeWeight: 0.2,
            fillColor: circleColor,
            fillOpacity: 0.35,
            map: map,
            center: myLatlng,
            radius: radius
          };
          // Add the circle for this city to the map.
          cityCircle = new google.maps.Circle(populationOptions);

          var image = 'images/apple_green.png';

          switch(product)
          {
            case "carrot":
              if (process > 0) {
                image = 'images/carrot_black.png';
              } else {
                image = 'images/carrot_green.png';
              }
            break;
          case "apple":
              if (process > 0) {
                image = 'images/apple_black.png';
              } else {
                image = 'images/apple_green.png';
              }
            break;
          case "onion":
              if (process > 0) {
                image = 'images/onion_black.png';
              } else {
                image = 'images/onion_green.png';
              }
            break;
          case "pear":
              if (process > 0) {
                image = 'images/pear_black.png';
              } else {
                image = 'images/pear_green.png';
              }
            break;
          case "strawberry":
              if (process > 0) {
                image = 'images/strawberry_black.png';
              } else {
                image = 'images/strawberry_green.png';
              }
            break;
          default:
          }
          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: image,
            id: i
          });

          google.maps.event.addListener(marker, 'click', $.proxy(showInfoWindow, this, marker));

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



  function showInfoWindow(marker) {

    var patch = patches[marker.id];
    var ownerId = patch.get('owner');
    var farmerId = patch.get('farmer');

    console.log('farmerId', farmerId);

    var ownerName = "unknown";
    for (var i = 0; i < users.length; i++) {
      userId = users[i].id;
      if (userId == ownerId) {
        ownerName = users[i].get("username");
        break;
      }
    }

    var farmerName = "unknown";
    for (var i = 0; i < users.length; i++) {
      userId = users[i].id;
      if (userId == farmerId) {
        farmerName = users[i].get("username");
        break;
      }
    }

    var process = patch.get("process");
    var occupied = "";
    if (process == 0) {
      occupied = "";
    } else {
      occupied = '<div class="farmer"><p><strong>Farmer </strong>' + farmerName + "</p></div>";
    }

    var contentString =
      '<div class="overlay-content">' +
        '<div class="address">' +
          "<p><strong>Location </strong>" + patch.get('address') + "</p>" +
        '</div>' +
        '<div class="size">' +
          "<p><strong>Area </strong>" + patch.get('radius') + " m<sup>2</sup></p>" +
        '</div>' +
        '<div class="owner"><p><strong>Owner </strong>' + ownerName + '</p></div>' +
        occupied +
        '<div class="info">' +
          "<p><strong>Info </strong>" + patch.get('description') + "</p>" +
        '</div>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500
    });

    infowindow.open(map, marker);
  }


  // Init
  google.maps.event.addDomListener(window, 'load', initialize);


}());
