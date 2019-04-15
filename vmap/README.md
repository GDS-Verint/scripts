# VMap JavaScript Library 
Designed with the intention of providing more functionality to existing Verint Online Forms VOF GIS Widget.


# Usage

## Initialization
To Initialize VMap pass a mapParams obj to a new VMapConstructor. The below example initialisation.
```javascript

var mapParams = {
  WKID: 27700,
  assetMaxDrawZoom: 17,
  assetClick: {radius: 500, radiusUnit: "esriMiles"},
  geometryServer: "/webmaps/rest/services/Utilities/Geometry/GeometryServer",
  hostUrl: "https://" + $(location).attr("hostname"),
  projections: {
    WGS84: { name: "EPSG:4326", projection: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs" },
    OSGB36: {
      name: "OSGB36",
      projection:
        "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs"
    }
  }
};

var vmap = new VMap(mapParams);
```

#### Integration with VOF GIS widget 
The below example initializes VMap, setting map.

``` javascript
$("#dform_sheff_map").off("_KDF_mapReady")
  .on("_KDF_mapReady", function(event, kdf, type, name, map, positionLayer, markerLayer, marker, projection) {
    mapParams.map = map;
    vmap = new VMap(mapParams);
});
```


## Functions

### drawDynamicLayer
Draw Dynamic Layer function accepts a layer configuration object. This creates a ArcGISDynamicMapServiceLayer and adds the layer to the map.
``` javascript
  const layerConfig = {
    url: vmap.getMapParams().hostUrl + "/webmaps/rest/services/appservices/highwaysassets/MapServer",
    code: 0,
    id: "highwaysAssetLayer"
  };
  vmap.drawDynamicLayer(layerConfig);
}
```

### addPoint
Add point function accepts a point configuration object
``` javascript
  var marker = { url: "/dformresources/content/map-pin.png", width: 22, height: 40 };
  var pointConfig = { longitude: result.x, latitude: result.y, marker: marker, layer:layerId };
  vmap.addPoint(pointConfig);
```

### removePoints
Remove points removes graphics from a particular layerId
``` javascript
  vmap.removePoints("layerId");
```

### convertLonLat
ConvertLonLat takes an x,y coord and using input and output Proj4Js projections will attempt to convert the x,y to the output projection. upon completion of the conversion resultCallBack will be called passing the result x,y.
``` javascript
  vmap.convertLonLat({
    coordinates: crd,
    inputProjection: vmap.getMapParams().projections.WGS84,
    outputProjection: vmap.getMapParams().projections.OSGB36,
    resultCallBack: coordConversionSuccess
  });
  function coordConversionSuccess(result) {
      console.log(result.x + ', ' + result.y);
  }
```

### findFeaturesNear
Find features near searches a feature layer for features near a circle geometry. the circle dimensions are configured using the mouse click and a pre defined asset click radius and radiusUnit. See mapParams for these values. The original click marker and returned feature set is then passed to the featureSetHandler callback function.

``` javascript
$("#dform_sheff_map").off("_KDF_mapClicked").on("_KDF_mapClicked", function(event, kdf, type, name, map, positionLayer, markerLayer, marker, lat, lon, plat, plon) {
    mapParams.map = map;
    // Assets Street light
    const streetLightLayerConfig = {
      url: vmap.getMapParams().hostUrl + "/webmaps/rest/services/appservices/highwaysassets/MapServer/0",
      code: 0,
      id: "streetLightAssetLayer"
    };
    vmap.findFeaturesNear(marker, streetLightLayerConfig, streetLightFeatureSetHandler);
});

function streetLightFeatureSetHandler(marker, featureSet) {
  if (featureSet.features.length == 1) {
    var asset = featureSet.features[0];
    console.log('Feature returned');
    console.log(asset);
  } else if (featureSet.features.length > 1) {
    console.log('More than one feature returned');
  } else {
    console.log('No feature returned');
  }
  
}
```

### centerAtLonLat
CenterAtLonLat centres map on a supplied longitude and latitude
``` javascript
vmap.centerAtLonLat({ lon: marker.geometry.x, lat: marker.geometry.y });
```

### setInfoWindow
Sets Map InfoWindow content for given infoWindowConfig
``` javascript
    const content =
      "No light selected. Missing asset perhaps?" +
      ' <br /><button type="button" class="btn-selecthighway">Select Highway</button>';

    vmap.setInfoWindow({
      xcoord: marker.geometry.x,
      ycoord: marker.geometry.y,
      title: "Warning",
      content: content
    });
```