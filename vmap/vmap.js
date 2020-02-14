class VMap {
  constructor(mapParams) {
    this.mapParams = mapParams;
  }
  getMapParams() {
    return this.mapParams;
  }
}

/**
 * extentChanged
 * Simplified function, calls layerDrawingFunc at mapParams.assetMaxDrawZoom level or greater.
 * If assetMaxDrawZoom is not set defaults to 6.
 * If more fleibility is required. See @function zoomLevelChanged
 * @param  {} evt
 * @param  {} layerDrawingFunc
 */
VMap.prototype.extentChanged = function extentChanged(evt, layerDrawingFunc) {
  if (evt["levelChange"] == true) {
    if (this.getMapParams().assetMaxDrawZoom) {
      if (evt.lod.level >= this.getMapParams().assetMaxDrawZoom) {
        layerDrawingFunc(evt);
      } else {
        this.getMapParams().map.graphics.clear();
      }
    } else {
      if (evt.lod.level >= 6) {
        layerDrawingFunc(evt);
      } else {
        this.getMapParams().map.graphics.clear();
      }
    }
  }
};

/**
 * zoomLevelChanged
 * Checks if ExtentChange event is a levelChange and calls zoomChanged callback passing event.
 * @param  {} evt
 * @param  {} zoomChanged
 */
VMap.prototype.zoomLevelChanged = function zoomLevelChanged(evt, zoomChanged) {
  if (evt["levelChange"] == true) {
    zoomChanged(evt);
  }
};
/**
 * drawDynamicLayer
 * draws an ArcGISDynamicMapServiceLayer for a given layer configuration
 * layerConfig {url, code, id}
 * @param  {} layerConfig
 */
VMap.prototype.drawDynamicLayer = function drawDynamicLayer(layerConfig) {
  //layerConfig {url, code, id}
  var layer = new esri.layers.ArcGISDynamicMapServiceLayer(layerConfig.url, {
    id: layerConfig.id
  });
  layer.setVisibleLayers(layerConfig.codes);
  layer.setOpacity(0.9);
  this.getMapParams().map.addLayer(layer);
};
/**
 * loadCaseMarkers
 * Takes custom action response object and creates case marker layer for given response
 * Custom action response data items should consist of longitude, latitude, icon, title.
 * Upon selection of case marker selectedCaseCallback is called passing event grapic.
 * @param  {} response
 * @param  {} selectedCaseCallback
 */
VMap.prototype.loadCaseMarkers = function loadCaseMarkers(response, selectedCaseCallback) {
  var map = this.getMapParams().map;
  var mapParams = this.getMapParams();
  map.graphics.clear();
  require([
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "dojo/domReady!"
  ], function(Point, PictureMarkerSymbol, Graphic, GraphicsLayer) {
    var newlayer = new GraphicsLayer({ id: "custom_marker_layer" });
    $.each(response.data, function() {
      var markerinfo = this;
      var point = new Point(
        Number(markerinfo.longitude),
        Number(markerinfo.latitude),
        new esri.SpatialReference(mapParams.WKID)
      );
      var markerSymbol = new PictureMarkerSymbol(markerinfo.icon, 20, 32);
      markerSymbol.setOffset(0, 0); //0,32
      var marker = new Graphic(point, markerSymbol);
      marker.setAttributes({
        title: "",
        description: '<img src="/dformresources/content/ajax-loader.gif" />',
        caseid: markerinfo.title
      });
      newlayer.add(marker);
    });
    newlayer.on("click", function(event) {
      setTimeout(function() {
        selectedCaseCallback(event.graphic);
      }, 200);
    });
    map.addLayer(newlayer);
  });
};

/**
 * centerAtLonLat
 * centres map upon a given centerConfig
 * centerConfig = {lon:,lat:}
 * @param  {} centreConfig
 */
VMap.prototype.centerAtLonLat = function centerAtLonLat(centerConfig) {
  var params = this.getMapParams();
  var config = centerConfig;
  require(["esri/geometry/Point", "esri/SpatialReference"], function(Point, SpatialReference) {
    var point = new Point(Number(config.lon), Number(config.lat), new SpatialReference(params.WKID));
    params.map.centerAt(point);
  });
};

VMap.prototype.geoLocate = function geoLocate(success, error) {
  if (navigator.geolocation) {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
    // console.log("geolocate enabled");
  } else {
    console.log("navigator.geolocation undefined");
  }
};

/**
 * setInfoWindow
 * Sets Map InfoWindow content for given infoWindowConfig
 * infoWindowConfig {xcoord:, ycoord:, title:'', content:''}
 * @param  {} infoWindowConfig
 */
VMap.prototype.setInfoWindow = function setInfoWindow(infoWindowConfig) {
  var wkid = this.getMapParams().WKID;
  var map = this.getMapParams().map;
  require(["esri/geometry/Point", "esri/SpatialReference"], function(Point, SpatialReference) {
    var point = new Point(infoWindowConfig.xcoord, infoWindowConfig.ycoord, new SpatialReference(wkid));
    map.infoWindow.setTitle(infoWindowConfig.title);
    map.infoWindow.setContent(infoWindowConfig.content);
    map.infoWindow.show(point);
    // map.infoWindow.reposition();
  });
};
/**
 * findFeaturesNear
 * Query feature layer passing returned FeatureSet to featureSetHandler callback
 * Query is formed using marker as centre point of circle polygon with given radius.
 * Radius is set in mapParams.assetClickRadius
 * @param  {} marker
 * @param  {} layerConfig
 * @param  {} featureSetHandler
 */
VMap.prototype.findFeaturesNear = function findFeaturesNear(marker, layerConfig, featureSetHandler, errorCallback) {
  var assetClick = this.getMapParams().assetClick;
  var wkid = this.getMapParams().WKID;
  var map = this.getMapParams().map;
  var queryLayerConfig = layerConfig;
  require([
    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",
    "esri/geometry/Circle",
    "esri/tasks/query",
    "esri/SpatialReference"
  ], function(InfoTemplate, FeatureLayer, Circle, Query, SpatialReference) {
    var infoTemplate = new InfoTemplate("Attributes", "${*}");
    var featureLayer = new FeatureLayer(queryLayerConfig.url, {
      mode: FeatureLayer.MODE_ONDEMAND,
      infoTemplate: infoTemplate,
      outFields: ["*"]
    });

    var circle = new Circle(marker.geometry, {
      radius: assetClick.radius,
      radiusUnit: assetClick.radiusUnit
    });

    if (queryLayerConfig.wkid) {
      circle.spatialReference = new SpatialReference(queryLayerConfig.wkid);
    }
    
    var query = new Query();
    query.geometry = circle;
    query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
    query.returnGeometry = true;
    query.outFields = ["*"];

    featureLayer.queryFeatures(query, function(featureSet) {
      featureSetHandler(marker, featureSet);
    }, function(error) {
      errorCallback(error);
    });
  });
};

/**
 * addPoint
 * Adds point at given longitude & latitude
 * pointConfig = {longitude: ,  latitude: , marker:{"url":, "width":, "height":}, layer:}
 * @param  {} pointConfig
 */
VMap.prototype.addPoint = function addPoint(pointConfig) {
  var config = pointConfig;
  var mapParams = this.getMapParams();
  require([
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "dojo/domReady!"
  ], function(Point, PictureMarkerSymbol, Graphic, GraphicsLayer) {
    var point = new Point(
      Number(config.longitude),
      Number(config.latitude),
      new esri.SpatialReference({ wkid: Number(mapParams.WKID) })
    );
    var markerSymbol = new PictureMarkerSymbol(config.marker.url, config.marker.width, config.marker.height);
    markerSymbol.setOffset(0, 20);
    var graphic = new Graphic(point, markerSymbol);
    var markerLayer = new GraphicsLayer(config.layer);
    mapParams.map.addLayer(markerLayer, 0);
    markerLayer.add(graphic);
  });
};
/**
 * removePoints
 * Remove all points/graphics from a map layer
 * @param  {} layerId
 */
VMap.prototype.removePoints = function removePoints(layerId) {
  if (this.getMapParams().map.getLayer(layerId)) {
    this.getMapParams()
      .map.getLayer(layerId)
      .clear();
  }
};
/**
 * convertLonLat
 * Convert Lon Lat from one projection to another using Proj4js
 * config {coordinates: {x:, y:}, inputProjection:, outputProjection:, successCallBack:}
 * @param  {} config
 */
VMap.prototype.convertLonLat = function convertLonLat(config) {
  var result = proj4(config.inputProjection.projection, config.outputProjection.projection, config.coordinates);
  config.successCallBack(result);
};

VMap.prototype.addSearch = function addSearch() {
  var mapParams = this.getMapParams();
  require(["esri/config", "esri/dijit/Search"], function(esriConfig, Search) {
    esriConfig.defaults.geometryService = mapParams.hostUrl + mapParams.geometryService;
    var search = new Search(
      {
        map: mapParams.map
      },
      "search"
    );
    search.startup();
  });
};
