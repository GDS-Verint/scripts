//KS: use this to get status
var mapScriptStatus = jQuery.Deferred();

var Map, Point, SimpleMarkerSymbol, PictureMarkerSymbol, Graphic, GraphicsLayer, InfoWindow, Circle, Units, GeometryService, SpatialReference, Color, Popup, Geocoder, OverviewMap, Identify, Find;

require(["esri/map", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/graphic", "esri/layers/GraphicsLayer", "esri/dijit/InfoWindow", "esri/geometry/Circle", "esri/units", "esri/tasks/GeometryService", "esri/SpatialReference", "esri/Color", "esri/dijit/Popup", "esri/dijit/Geocoder", "esri/dijit/OverviewMap", "esri/tasks/identify", "esri/tasks/find", "dojo/domReady!"],
	function(classMap, classPoint, classSimpleMarkerSymbol, classPictureMarkerSymbol, classGraphic, classGraphicsLayer, classInfoWindow, classCircle, classUnits, classGeometryService, classSpatialReference, classColor, classPopup, classGeocoder, classOverviewMap, classIdentify, classFind) {
		Map=classMap; Point=classPoint; SimpleMarkerSymbol=classSimpleMarkerSymbol; PictureMarkerSymbol=classPictureMarkerSymbol; Graphic=classGraphic; GraphicsLayer=classGraphicsLayer; InfoWindow=classInfoWindow; Circle=classCircle; Units=classUnits; GeometryService=classGeometryService; SpatialReference=classSpatialReference; Color=classColor; Popup=classPopup; Geocoder=classGeocoder; OverviewMap=classOverviewMap; Identify=classIdentify; Find=classFind;
		mapScriptStatus.resolve();//KS allows you to identify when classes are loaded
	}
);
//testing only

/*KS 
In order to have this working with more forms in the future but not requiring a script per page I think that we have an an object with optional params and (if they're required) implement defaults.
If we do we'll be getting fimilar with this expression: Object.is(x, undefined) ? y : x;
Maybe for the displying popup we could have something like the object below... 
{
    confirmText:"Report this bin",
    //BLW: array of arrays. Inner array is field. With the first value being the plain text and the second being what it's defined as when it's returned
    infoWindowFields:[['Location:','LOCATION'],['Site:','SITE_ADDRE'],['Light ID:','ASSET_ID']],
    //ABV: this would allow use to illiterate through all the fields and display what we'd like.
}
The defaults for the above would be something like 'Confirm' for the confirmText and a check before illitering infoWindowFields that would display text simalar to 'Location of asset'
In addition some features that I think would be particulary useful - hopefully we get time to develop them together in the future:
    Draw assets when at or below specified zoom level
    Once clicked, zoom into map. Maybe default of 3rd level from maximum - possibily configuable if we consider the levels set in designer
    Applying a style to a selected asset.
    Keep a queue of selected assets - with a max length
    Use the PopUp instead of the deprecited InfoWindow - simple change that add more functionility, testing is the main thing e.g. can display multiple assets in one window and '<- navagate ->' through them.
    Possibly implement .setFeatureReduction(reduces points into a single lgarger point) example https://developers.arcgis.com/javascript/3/jssamples/fl_clustering_basic.html
*/


var faultReportingSearchResults = new Object();
var streetAddress='';

var sx_customer_id='';

var mapParams= {
    extent:[334905.5753111506,
    310733.193633054,
    680181.2782575564,
    663544.2449834899],
    WKID:27700,
    WKIDProj4:"+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs",
    geolocateButton:!0,
    geolocateAuto:!1,
    geolocateWKID:4326,
    geolocateWKIDProj4:"+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
    centerLonLat: {
        x: 325226.83303699945, y: 673836.5572347812
    }
    ,
    centerZoom:1,
    geometryServer:"https://edinburghcouncilmaps.info/arcgis/rest/services/Utilities/Geometry/GeometryServer",
    drawWindowMultiplier:1.25,
    selectMultiple:!0,
    selectStorage:[ {
        points:[],
        uniqueField:"FEATURE_ID",
        selectedAssets:["RHF12",
        "RHF10",
        "RHF24"],
        selectSymbol: {
            color:[4,
            4,
            100],
            size:"5",
            outline: {
                color: [100, 6, 6], width: "1"
            }
        }
        ,
        wkid:27700
    }
    ],
    searchURL: {
        base: "https://edinburghcouncilmaps.info/locatorhub/arcgis/rest/services/CAG/POSTCODE/GeocodeServer/findAddressCandidates?&SingleLine=&Fuzzy=true&outFields=*&maxLocations=2000&f=pjson&outSR=27700", varParams: ["LH_POSTCODE"]
    }
    ,
    baseLayerService:"https://edinburghcouncilmaps.info/arcgis/rest/services/Basemaps/BasemapColour/MapServer/find",
    backgroundMapService:"https://edinburghcouncilmaps.info/arcgis/rest/services/Basemaps/BasemapColour/MapServer",
    addressSearchService: {
        base: "https://edinburghcouncilmaps.info/locatorhub/arcgis/rest/services/CAG/ADDRESS/GeocodeServer/reverseGeocode?distance=300&outSR=27700&f=json"
    }
    ,
    processResultURL:"https://my.edinburgh.gov.uk/ci/AjaxCustom/cagSearch"
};

var site_name_temp = '';
var specifics = {};//KS allows form to override defaults
function getSpecifics(){return specifics;}//KS accessor to give a level of abstraction when we need it
function setSpecifics(obj){specifics = obj;}
//call to getCommunalAssetURl() would be try to get val from from 

//KS: need to move to a specifc global varible script but will be her for now.
var mapGlobal = {
	extent: [334905.5753111506, 310733.193633054, 680181.2782575564, 663544.2449834899],// minX, maxX, minY, maxY
	WKID: 27700,
	centerLonLat: {x:325226.83303699945, y:673836.5572347812},
	centerZoom: 1,
}

/*
function parseRSMarker(e) {
    var a = getWindowDrawBounds({
        xMax: esrimap.extent.xmax,
        yMax: esrimap.extent.ymax,
        xMin: esrimap.extent.xmin,
        yMin: esrimap.extent.ymin
    });
    console.log("1"), $.each(e.data, function(e, t) {
        if (a.xMax >= t.longitude && a.yMax >= t.latitude && a.xMin <= t.longitude && a.yMin <= t.latitude) {
            var r = new Point(Number(t.longitude), Number(t.latitude), new esri.SpatialReference({
                    wkid: getMapParams().WKID
                })),
                o = new PictureMarkerSymbol(t.icon, 64, 64);
            o.setOffset(0, 0);
            var s = new Graphic(r, o);
            s.setAttributes({
                title: "",
                description: t.description
            }), esrimap.graphics.add(s), $(formName()).trigger("_map_caseMarkerDisplayed", [t.longitude, t.latitude, getMapParams().WKID, t.description])
        }
    }), console.log("2")
}
    */
function getWindowDrawBounds(e) {
    var a = 1;
    return null !== getMapParams().drawWindowMultiplier && (a = getMapParams().drawWindowMultiplier), {
        xMax: e.xMax + (a - 1) * (e.xMax - e.xMin),
        yMax: e.yMax + (a - 1) * (e.yMax - e.yMin),
        xMin: e.xMin - (a - 1) * (e.xMax - e.xMin),
        yMin: e.yMin - (a - 1) * (e.yMax - e.yMin)
    }
}


function getMapParams(){return mapParams}



 function parseRSMarker(response){

 var xmax = esrimap.extent['xmax'];
 var ymax = esrimap.extent['ymax'];
 var xmin = esrimap.extent['xmin'];
 var ymin = esrimap.extent['ymin'];

     require([ "esri/symbols/SimpleMarkerSymbol", "esri/graphic", "esri/Color", "esri/InfoTemplate", "esri/symbols/PictureMarkerSymbol", "dojo/domReady!" ],
        function(SimpleMarkerSymbol,  Graphic,  Color, InfoTemplate, PictureMarkerSymbol) {
            caseLayer = new esri.layers.GraphicsLayer({id:"case_marker_layer"});
              $.each(response.data, function( i, result ) {
                  
                     var point = new Point(Number(result.longitude), Number(result.latitude), new esri.SpatialReference({ wkid: 27700 }));
    				 var markerSymbol = new PictureMarkerSymbol(result.icon, 64, 64);
    			
    				 markerSymbol.setOffset(0, 0);
    				 var caseGraphic = new Graphic(point, markerSymbol);
    				 caseGraphic.setAttributes({"title":'', "description": result.description, "caseid": result.title});
    				 //console.log(result.description);
    				 //esrimap.graphics.add(marker);
                     caseLayer.add(caseGraphic);

             });
             //console.log(caseLayer)
               caseLayer.on('click', function(event) {
                  console.log(event.graphic.attributes.caseid)
                  KDF.setVal('txt_case_id_subscribe', event.graphic.attributes.caseid)
    		   if (typeof esrimap.getLayer("graphicsLayer2") !== 'undefined') {
                   esrimap.getLayer("graphicsLayer2").hide();
               }
    			});
    			esrimap.addLayer(caseLayer);
             }); 
            
            //console.log('esrimap length boys' + esrimap.graphicsLayerIds.length)
            //esrimap.reorderLayer(esrimap.getLayer("case_marker_layer"), esrimap.graphicsLayerIds.length + 1);
             //console.log(esrimap)
}

//testing only
$(document).on('click','#dform_widget_button_but_layerberapa',function() {
 var graphicLayerIds = esrimap.graphicsLayerIds;
 var len = graphicLayerIds.length;
 console.log('map layernya ' + len);
});
 
// listen to enter key pressed to start searching on search textbox
$(document).on('keypress','#dform_widget_txt_postcode',function() {
  if (event.keyCode == 13) {
    event.preventDefault();
    searchBegin();
  }
});

// let's get back to this after the meeting
$(document).on('click','.mapConfirm',function() {
    KDF.setVal('txt_issuestreet',KDF.getVal('le_gis_rgeo_desc'));
    //call process adapter
   // KDF.customdata('get_street_id', 'create', true, true, {'street_name': site_name_temp});
    KDF.gotoNextPage();
 });
 
$(document).on('click','#dform_widget_button_but_search',function() {
  searchBegin();
});


$(document).on('click','#dform_widget_button_but_nextcall',function() {
  console.log('next clicked');
    
    if (typeof esrimap !== 'undefined'){
		clearPreviousLayer();
		esrimap.infoWindow.hide();
        drawBaseLayer();
        //esrimap.setZoom(2);
        var centerpoint = new Point(325375, 673865, new esri.SpatialReference({wkid: 27700}));
		esrimap.centerAndZoom(centerpoint, 2);
    }
  
});


function getCommunalAssetURl() {
    //KS now supports a url asset code defined on an element called 'asset_layer' and a URL defined in the scriting tab within 'getSpecifics.assetURL'. If none is found then return false (since no reasonable default can be supplied)
    if (KDF.getVal('asset_layer')){ //Returns true if defined
        //KS asset layer NUMBER defined on form TODO check it's number and 'continue' if not to avoid assigning invalid assetURL, might still be possible to use an excisting one
        specifics.assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/' + KDF.getVal('asset_layer') + '/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
        //console.log(specifics.assetURL)
        return specifics.assetURL;
    }//KS else statement avoided due to return above - TODO allows block above to continue if number is invalid
    //KS no asset_layer defined on form
    if (specifics.assetURL){
        //KS assetURL defined in object - assume it's the entire URL
        return specifics.assetURL;
    }
    if (setSpecifics.formName){//LB
        console.log('call broasd')
        if (setSpecifics.formName === 'road_sign'){
	        specifics.assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/7/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
	        
	        console.log('call bro')
		   return specifics.assetURL;
		   
	     }  else if (specifics.formName === 'litter_flytipping'){
	        specifics.assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/26/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
	        
	        console.log('call bro 2')
		   return specifics.assetURL;
		   
	     }
    }
    else{
        //KS no URL specified - since no resonable default can be used - assign false to aid with error handaling
        console.log('the call bro')
        return false;
    }
}

function postcodeSearch(searchInput) {
    var esriServiceURL = 'https://edinburghcouncilmaps.info/locatorhub/arcgis/rest/services/CAG/POSTCODE/GeocodeServer/findAddressCandidates?&SingleLine=&Fuzzy=true&outFields=*&maxLocations=2000&outSR=27700&f=pjson';
    //LH_POSTCODE=EH1+1BN
    var xcoord;
    var ycoord;
    
    esriServiceURL = esriServiceURL + '&LH_POSTCODE=' + searchInput;
    
	$.ajax({url: esriServiceURL, dataType: 'jsonp', crossDomain: true, jsonp: true}).done(function(response) {
        console.log('Response below:')
        //console.log(response.candidates.length)
        
        if (response.candidates.length !== 0){
        
           $.each(response.candidates, function( key, value ) {
                 xcoord=value.location.x;
                 ycoord=value.location.y;
           });
			hideLoading();
			var popCenterpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
    		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
    		esrimap.centerAndZoom(centerpoint, 5);
		
        } else {
            KDF.showWidget('html_nosearchfound');
		    hideLoading();
        }
	});
        
    
}

// unused for now
function getAssetInfo(globalX, globalY) {

   //clearPreviousLayer();

   var point = new Point([globalX, globalY]);
   var centerpoint = new Point(globalX, globalY, new esri.SpatialReference({wkid: 27700}));

	var circleGeometry = new Circle(centerpoint,{"radius": 5, "numberOfPoints": 4, "radiusUnit": Units.METERS, "type": "extent"});
	var esriServiceURL = '';
	var content = '';
    var contentGlobal ='';
	showLoading();

	var xmaxE = circleGeometry.getExtent().xmax;
	var ymaxE = circleGeometry.getExtent().ymax;
	var xminE = circleGeometry.getExtent().xmin;
	var yminE = circleGeometry.getExtent().ymin;

		esriServiceURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/7/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false' + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A27700%7D%7D';
			$.ajax({url: esriServiceURL, dataType: 'jsonp', crossDomain: true, async: false}).done(function(response) {
				console.log('Response below: k')
				console.log(response)

				hideLoading();

				$.each(response.features, function( key, value ) {

							var bisa=value.attributes;

								content = '<b>Asset ID</b> : ' + bisa.ASSET_ID + '</br><b>Location : </b>' + 
								bisa.LOCATION + '</br><b>Site Name : </b>' + bisa.SITE_NAME + '</br><b>Type Name : </b>' + bisa.TYPE_NAME
				});
				
			
		});

}


function zoomChanged(evt){
    
	//drawAssetLayer();
	//console.log(evt)
	//console.log('Zoom: '+evt.lod.level)
	//KS won't be implemented due to demo
	//Should we prevent clicking?
	if (specifics.assetMaxDrawZoom){
	    //console.log('has level defined');
	    //KS implement user specified zoom extent 
	    if (evt.lod.level >= specifics.assetMaxDrawZoom){
		    //console.log('Zoom at or less');
	        drawAssetLayer();
	    }else{
		    //console.log('Zoom is more');
	        //KS remove assets if above extent - aesthetic only
	        esrimap.graphics.clear();
	    }
	}else{
		//console.log(' level undefined');
	    //KS implement default zoom extent
	    if (evt.lod.level >= 6){
	        
	        var xmaxE = esrimap.extent.xmax;
            var ymaxE = esrimap.extent.ymax;
            var xminE = esrimap.extent.xmin;
            var yminE = esrimap.extent.ymin;
	        
	    //console.log('zoom under default');
	    //KS zoom is at or more magnified than max level - so draw it
	        drawAssetLayer();
	        getOpenCaseMarker(xmaxE, xminE, ymaxE, yminE);
	     
		 
	    }else{
		    //console.log('zoom over default');
	        //KS remove assets if above extent - aesthetic only

	        esrimap.graphics.clear();
	    }
	}
	
}

function drawAssetLayer(){
    
    // if flytipping & overflowing litter bin then return false | litter & flytipping form speisifc
    if (KDF.getVal('rad_problem_option')) {
        if (KDF.getVal('rad_problem_option') === 'flytipping' ) {
            return false;
        }
    } 
    
    if (KDF.getVal('txt_formname')) {
        if (KDF.getVal('txt_formname') === 'dog_fouling') {
            return false;
        }
    }
    
    
    KDF.hideMessages();
    
    var esriAssetUrl='';
    
    if (typeof esrimap.getLayer("asset_layer") !== 'undefined') {
        esrimap.removeLayer(esrimap.getLayer("asset_layer"));
    }
    
    if (typeof esrimap.getLayer("case_marker_layer") !== 'undefined') {
        esrimap.removeLayer(esrimap.getLayer("case_marker_layer"));
    }

    var xmaxE = esrimap.extent.xmax;
    var ymaxE = esrimap.extent.ymax;
    var xminE = esrimap.extent.xmin;
    var yminE = esrimap.extent.ymin;
    
    //console.log(xmaxE + ' ' + ymaxE + ' ' + xminE + ' ' + yminE);
    
    var infoWindowContent;
    
    if (KDF.getVal('txt_formname')){
        if (KDF.getVal('txt_formname') === 'road_sign'){
            esriAssetUrl = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/7/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false' + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A27700%7D%7D';
        } else if (KDF.getVal('txt_formname') === 'litter_flytipping'){ 
            esriAssetUrl = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/26/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false' + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A27700%7D%7D';   
        }
    } else if (KDF.getVal('asset_layer')){ // communal bin spesific
        //KS asset layer NUMBER defined on form TODO check it's number and 'continue' if not to avoid assigning invalid assetURL, might still be possible to use an excisting one
        esriAssetUrl = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/' + KDF.getVal('asset_layer') + '/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false' + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A27700%7D%7D';;
    }

    //var esriAssetUrl = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/7/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false' + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A27700%7D%7D';

    $.ajax({url: esriAssetUrl, dataType: 'jsonp', crossDomain: true
	}).done(function(response) {
	    //console.log(response.features);

	    require([ "esri/symbols/SimpleMarkerSymbol", "esri/graphic", "esri/Color", "dojo/domReady!" ],
        function(SimpleMarkerSymbol,  Graphic,  Color) {

		assetLayer = new esri.layers.GraphicsLayer({id:"asset_layer"});

        var redColor = Color.fromArray([0, 204, 153]);
        var sms;
			if (specifics.markerSymbol){
			    //KS: use defind object to create marker
				sms = new SimpleMarkerSymbol(specifics.markerSymbol);
		    }else{
			    //KS: use default marker
				sms = new SimpleMarkerSymbol({
                  color: redColor,
                  size: "12",
                  outline: {
                    color: [0, 153, 255],
                    width: "5px",
                  }
                });
		    }
		   sms.setOffset(0, 0);
        
	    $.each(response.features, function( key, value ) {
	        //console.log(value.geometry.x); 
	        
	        infoWindowContent = '';
	        
	        if (KDF.getVal('asset_layer')) {
	            infoWindowContent = '<b>Asset ID</b> : ' + value.attributes.ASSET_ID + '</br><b>Location : </b>' + 
								value.attributes.feature_location + '</br><b>Site Name : </b>' + value.attributes.site_name
								+ '</br><b>Type Name : </b>' + value.attributes.feature_type_name
								 + '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm location</button></div>';
	        } else {
	            //console.log('litter')
	         infoWindowContent = '<b>Asset ID</b> : ' + value.attributes.ASSET_ID + '</br><b>Location : </b>' + 
								value.attributes.LOCATION + '</br><b>Site Name : </b>' + value.attributes.SITE_NAME + '</br><b>Type Name : </b>' + value.attributes.TYPE_NAME
								 + '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm location</button></div>';
         
	        }
	        
	        var point = new Point(Number(value.geometry.x), Number(value.geometry.y), new esri.SpatialReference({ wkid: 27700 }));
	        var graphic = new esri.Graphic(point, sms);  
	         if (KDF.getVal('asset_layer')) {
	              graphic.setAttributes({"title": '', "description": infoWindowContent, "site_name":value.attributes.site_name, "latitude":value.geometry.y, "longitude":value.geometry.x});
	        } else {
                 graphic.setAttributes({"title": '', "description": infoWindowContent, "site_name": value.attributes.SITE_NAME, "latitude":value.geometry.y, "longitude":value.geometry.x});
	        }
	     
		    assetLayer.add(graphic);
	    });
	    
	         // assign the click event to the 
    	     assetLayer.on('click', function(event) {
    	         console.log(event.graphic.attributes)
    	         
    	         site_name_temp = event.graphic.attributes.site_name;
    				//console.log(event.mapPoint.x);
    				if (typeof esrimap.getLayer("graphicsLayer2") !== 'undefined') {
                        esrimap.removeLayer(esrimap.getLayer("graphicsLayer2"));
                    }
                    
                    var lan = event.graphic.attributes.latitude ;
                    var long =  event.graphic.attributes.longitude ;
                    
                     KDF.customdata('reverse-geocode-edinburgh', 'create', true, true, {'longitude': long.toString() , 'latitude' : lan.toString()});
                    KDF.unlock();
                   // esrimap.centerAt(new Point(event.mapPoint.x, event.mapPoint.y, new esri.SpatialReference({ wkid: 27700 })));
    			});

        	 esrimap.addLayer(assetLayer);
		 
		    //console.log(esrimap);
		  
		      for (var i = 0; i < esrimap.graphics.graphics.length -1; i++){
                  //KS Remove all but last layer
                  console.log(esrimap.graphics.graphics[i])
                  esrimap.graphics.remove(esrimap.graphics.graphics[i]);
              }

        });
	}).fail(function() {
	    KDF.showError('It looks like the connection to our mapping system has failed, please try to log the fault again');
	});	
}

$(document).on('change','#dform_widget_fault_reporting_search_results' , function() {
 
  var selectResult = $('select#dform_widget_fault_reporting_search_results option:checked').val();
  //console.log(faultReportingSearchResults);
   if (selectResult !== "") {
          $.each(faultReportingSearchResults, function(key,faultReportingSearchResults) {
            if (selectResult == faultReportingSearchResults.site_name) {
                
                      //get usrn after user do search
    	              if (typeof KDF.getVal('txt_usrn') !== 'undefined') {
    	                  KDF.setVal('txt_usrn', faultReportingSearchResults.USRN);
    	              }
	                  
                
                  if (faultReportingSearchResults.east !==undefined && faultReportingSearchResults.east !=='' && faultReportingSearchResults.north !==undefined && faultReportingSearchResults.north !==''){
    							console.log(faultReportingSearchResults.north);
    							centreOnEsriResult('', '', '', '', '', '', faultReportingSearchResults.north, faultReportingSearchResults.north);
    						}
    			  else {
            			  var xmax = parseFloat(faultReportingSearchResults.xmax);
                          var xmin = parseFloat(faultReportingSearchResults.xmin);
                          var ymax = parseFloat(faultReportingSearchResults.ymax);
                          var ymin = parseFloat(faultReportingSearchResults.ymin);
            
                          centreOnEsriResult('','',xmax,xmin,ymax,ymin,'','');
    			       }

            }
          });
        }
});
// unused fo now
function callEsriSearch (searchInput){
	var token ='';
	var findMapService = 'https://edinburghcouncilmaps.info/arcgis/rest/services/Basemaps/BasemapColour/MapServer/find';
	find = new esri.tasks.FindTask(findMapService);
	findparams = new esri.tasks.FindParameters();
	findparams.contains = true;
	findparams.returnGeometry = true;
	findparams.layerIds = [7];
	findparams.searchFields = [""];
	findparams.outSpatialReference = new esri.SpatialReference({wkid: 4326});
	findparams.searchText = searchInput;
	find.execute(findparams, processResult);
}
//unused for now
function mapClicked(marker, map) {
    
           console.log('long : '+marker.geometry.x+' lat : '+marker.geometry.y + KDF.getVal('le_gis_rgeo_desc'));
                esrimap.graphics.clear();
                var graphicLayerIds = map.graphicsLayerIds;
                var len = graphicLayerIds.length;
                console.log('length before: '+len);
                
                var gLayer = esrimap.getLayer(graphicLayerIds[len-1]);
				gLayer.clear();   
                for (var i = 0; i<len; i++) {
                    var gLayer = map.getLayer(graphicLayerIds[i]);
                    gLayer.clear();
                }
                
                getAssetInfo(marker, map);
}

function highlightMissingAsset(globalX, globalY) {
    
    //clearPreviousLayer();
    showLoading();
            
	//var newlayer = new GraphicsLayer();
	var xcoord = parseInt(globalX);
	var ycoord = parseInt(globalY);
	//console.log('ini geometry x ' + xcoord);

	var url = 'https://edinburghcouncilmaps.info/locatorhub/arcgis/rest/services/CAG/ADDRESS/GeocodeServer/reverseGeocode?location=' + xcoord + '%2C+' + ycoord +'&distance=300&outSR=27700&f=json';
	console.log(url);

	$.ajax({url: url ,  dataType: 'jsonp', crossDomain: true, jsonp: true}).done(function(result) {
		streetAddress = result.address;
		//console.log(result.address);

		hideLoading();
		//console.log(streetAddress.Address);
		 var content = streetAddress.Address + '</br></br>'
		 + '<button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm Location</button></div>' ;
         
         esrimap.infoWindow.setTitle('');
        	esrimap.infoWindow.setContent(content);
		 var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
         esrimap.infoWindow.show(centerpoint);
         
         //getOpenCaseMarker();
         
        /*
		var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-blue.png', 64, 64);
		markerSymbol.setOffset(0, 32);
		var marker = new Graphic(centerpoint, markerSymbol);
		marker.setAttributes({"value1": '1', "value2": '2', "value3": '3'});
		newlayer.add(marker);
		newlayer.on('click', function(event) {
			setInfoWindowContent(content,xcoord,ycoord);
		});
		esrimap.addLayer(newlayer);
        */
        
        
		//setInfoWindowContent(content,xcoord,ycoord);
		/*
		if (typeof esrimap.getLayer("case_marker_layer") !== 'undefined' ) {
		    esrimap.reorderLayer(esrimap.getLayer("case_marker_layer"), esrimap.graphics.graphics.length + 1);
		}*/
	});
		
}

function processResult(searchInput){
    KDF.hideMessages();
	
	var resultCount = 0;
	
	var resultAssetArray = new Object();

	$.ajax({url: 'https://my.edinburgh.gov.uk/ci/AjaxCustom/cagSearch',  crossDomain: true, method: 'POST',
	data: {w_id: '6', search_term: searchInput, search_type: 'street'}
	}).done(function(response) {
	   console.log(response);
	   	if(response.length === 0){
    		KDF.showWidget('html_nosearchfound');
    		hideLoading();
	    } else {
	        $.each(jQuery.parseJSON(response), function( key, value ) {
                
                resultAssetArray[value.Abbreviation] = new Object();
                resultAssetArray[value.Abbreviation]['site_name'] = value.Abbreviation;
                resultAssetArray[value.Abbreviation]['xmax'] = value.Street_Start_X;
                resultAssetArray[value.Abbreviation]['ymax'] = value.Street_Start_Y;
                resultAssetArray[value.Abbreviation]['xmin']= value.Street_End_X;
                resultAssetArray[value.Abbreviation]['ymin']= value.Street_End_Y;
                resultAssetArray[value.Abbreviation]['USRN']= value.USRN;
          
	        });
	        
	        console.log('result asset array');
	        console.log(resultAssetArray);
	        
	          $.each(jQuery.parseJSON(response), function( key, value ) {
	             resultCount++;
	          });
	          
	          //console.log(resultCount);
	          
	          if(resultCount == 1){
	         
	              
	              var xmax, xmin, ymax, ymin;
	              $.each(resultAssetArray, function(key, resultAssetArray ) {
	                  //console.log(resultAssetArray.xmax);
	                  
    	              //get usrn after user do search
    	              if (typeof KDF.getVal('txt_usrn') !== 'undefined') {
    	                  KDF.setVal('txt_usrn', resultAssetArray.USRN);
    	              }
	                  
	                  xmax = parseFloat(resultAssetArray.xmax);
	                  xmin = parseFloat(resultAssetArray.xmin);
	                  ymax = parseFloat(resultAssetArray.ymax);
	                  ymin = parseFloat(resultAssetArray.ymin);
	              });
	                //console.log(xmin + ' ' + ymin + ' ' + xmax + ' '+ ymax);
	              centreOnEsriResult('', '', xmax, xmin, ymax, ymin, '', '');
	          } else {
	               $('label[for=dform_widget_fault_reporting_search_results]').html('<label for="dform_widget_fault_reporting_search_results">Multiple results, please select one:</label>');
	               $('#dform_widget_fault_reporting_search_results').append($('<option>', {value: 'Please select a location',text: 'Please select'}))
	               $.each(resultAssetArray, function(key, resultAssetArray2 ) {
	                   //console.log(resultAssetArray2.site_name);
    		    	   $('#dform_widget_fault_reporting_search_results').append($('<option>', {value: resultAssetArray2.site_name,text: resultAssetArray2.site_name}))
    		        
    		           KDF.showWidget('fault_reporting_search_results');
    		           
    		           faultReportingSearchResults = resultAssetArray;
	               });
	          }
	         
	    }
	    
	    
	    	hideLoading();

	    }).fail(function() {
	        KDF.showError('It looks like request blocked by the CROSS Origin Policy, contact the system administrator');
	        hideLoading();
	    });
}
	
	
function setInfoWindowContent(content, xcoord, ycoord) {

    if (esrimap === undefined || esrimap.infoWindow === undefined) {
        KDF.showError('Unable to populate case details, popup does not exist.');
    } else {
        //map.infoWindow.setContent(content);
		var popCenterpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
		esrimap.infoWindow.setTitle('Please confirm street address.');
		esrimap.infoWindow.setContent(content);
		esrimap.infoWindow.show(popCenterpoint);
		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
		esrimap.centerAndZoom(centerpoint, 18);
	}
}
	
function showLoading(){
    //console.log('call a')
	KDF.showWidget('ahtm_cool_loading_gif');
	changeAllLayersOpacity('0.2');
	esrimap.disableMapNavigation();
	esrimap.hideZoomSlider();
}

function hideLoading(error){
   // console.log('call b')
	KDF.hideWidget('ahtm_cool_loading_gif');
	changeAllLayersOpacity('0.9');
	esrimap.enableMapNavigation();
	esrimap.showZoomSlider();
}

function searchBegin(){
       KDF.hideMessages();
       searchInput = KDF.getVal('txt_postcode');
       $('#dform_widget_fault_reporting_search_results').empty();
       KDF.hideWidget('fault_reporting_search_results');
       KDF.hideWidget('html_nosearchfound');
  
       showLoading();
       
       if (searchInput.charAt(0) !== 'E'){
           processResult(searchInput);
       } else {
           postcodeSearch(searchInput);
       }
       
}

function changeAllLayersOpacity(opacity){
    var layerIds = esrimap.layerIds;
    var len = layerIds.length;
    for (var i = 0; i < len; i++) {
        var layer = esrimap.getLayer(layerIds[i]);
        layer.setOpacity(opacity);
    }
}

function drawBaseLayer(){
    var backgroundMapService = 'https://edinburghcouncilmaps.info/arcgis/rest/services/Basemaps/BasemapColour/MapServer';
    bglayer = new esri.layers.ArcGISTiledMapServiceLayer(backgroundMapService,{opacity:1, id: "bglayer"});
    esrimap.addLayer(bglayer);
}

function drawResultsLayer(){
    resultslayer = new esri.layers.GraphicsLayer({id: "resultslayer"});
	esrimap.addLayer(resultslayer);
}

function clearPreviousLayer(){
    
    if (typeof esrimap !== undefined){
          esrimap.graphics.clear();
          var graphicLayerIds = esrimap.graphicsLayerIds;
          var len = graphicLayerIds.length;
         //console.log('length before: '+len);
                    
         var gLayer = esrimap.getLayer(graphicLayerIds[len-1]);
    	 gLayer.clear();   
         for (var i = 0; i<len; i++) {
         var gLayer = esrimap.getLayer(graphicLayerIds[i]);
         gLayer.clear();
        }
    }
}


function centreOnEsriResult(geometryX, geometryY, xmax, xmin, ymax, ymin, north, east){
    
    if (geometryY!=''){
		var newlayer = new GraphicsLayer();
		var xcoord = geometryX;
		var ycoord = geometryY;
		console.log(xcoord);
		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
		esrimap.centerAndZoom(new Point(xcoord, ycoord), 20);
		var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-red.png', 64, 64);
		markerSymbol.setOffset(0, 32);
		var marker = new Graphic(centerpoint, markerSymbol);
		marker.setAttributes({"value1": '1', "value2": '2', "value3": '3'});
		newlayer.add(marker);
		esrimap.addLayer(newlayer);
    } else if (ymin!='') {
        
        //console.log('ymin dipanggil');
        
       // console.log(xmin + ' ' + ymin + ' ' + xmax + ' '+ ymax);
		  var spatialref = new esri.SpatialReference({ wkid: 27700 }); //ref to British national grid projected coordinates
		  var selectedExtent = new esri.geometry.Extent(xmax,ymax,xmin,ymin,spatialref);
		  esrimap.setExtent(selectedExtent);
    } else if (north != '') {
		  var e = parseInt(east);
		  var n = parseInt(north);
		  var spatialref = new esri.SpatialReference({ wkid: 27700 }); //ref to British national grid projected coordinates
		  var selectedExtent = new esri.geometry.Extent(e - 250, n - 250, e + 250 , n + 250, spatialref);

		  esrimap.setExtent(selectedExtent);
    }
    
}
function distanceBetweenPoints(lat1, lon1, lat2, lon2){
	//KS: converted from https://verint-lagan01.squiz.co.uk/generator/form/map_dist_betw_2_points
	//KS: I don't know how well it'll work with diffrent WKID so may need to convert to WKID:4326 for actual M
	// Uses the Haversine formula to calculate the distance between two lat/longs 
	var pi = Math.PI;   
	var R = 6371e3; // metres
	var φ1 = lat1*(pi/180);
	var φ2 = lat2*(pi/180);
	var Δφ = (lat2-lat1)*(pi/180);
	var Δλ = (lon2-lon1)*(pi/180);

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		Math.cos(φ1) * Math.cos(φ2) *
		Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;

	return d; 
}
function isPointInPolygon(point, polygon){
	//KS: must be same wkid - and it's a tiny bit off at the edges
	//KS e.g. isPointInPolygon([1.5,1.5],[[1,1],[1,2],[2,2],[2,1]]);
	// ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function isPointWithinSquare(lonXLatY, extent){
	//KS: lonXLatY should be in the format lonX, LatY
	//    extent should be in the formant minLonX, maxLonX, minLatY, maxLatY
	return isPointInPolygon(
		[lonXLatY[0], lonXLatY[1]], 
		[[extent[0],extent[2]],[extent[1],extent[2]],[extent[1],extent[3]],[extent[0],extent[3]]]
	);
}

function popupOrZoomTo(aMap, aPoint){
	var location = aPoint;//new Point(lon, lat, wkid);
	if (specifics.assetMaxDrawZoom){
		if (specifics.assetMaxDrawZoom > aMap.getLevel()){//KS: center and zoom
			aMap.centerAndZoom(location, specifics.assetMaxDrawZoom);
			return false;
		}else{//KS: popup window
			return true;
		}
	} else {
		if (6 > aMap.getLevel()){//KS: center and zoom
			aMap.centerAndZoom(location, 6);
			return false;
		}else{//KS: popup window
			return true;
		}
	}
}

function convertLonLat(lonLatArray, inputSR, outputSR, callbackFunction){
	//KS: the callback function is the name (no ()) of the function the return value should call
	var inSR = new SpatialReference({wkid: inputSR});
	var outSR = new SpatialReference({wkid: outputSR});
	var inLon = lonLatArray[0];//Y
	var inLat = lonLatArray[1];//X
	var outPoint;

	var requestURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/Utilities/Geometry/GeometryServer/project?f=pjson&inSR='
		+inputSR+'&outSR='
		+outputSR+'&geometries=%7B%22geometryType%22%3A%22esriGeometryPoint%22%2C%22geometries%22%3A%5B%7B%22x%22%3A'
		+inLon+'%2C%22y%22%3A'
		+inLat+'%7D%5D%7D';

	$.ajax({url: requestURL, dataType: 'jsonp', crossDomain: true}).done(function(response){
		return callbackFunction(Point(response.geometries[0].x, response.geometries[0].y, outSR));
	}).fail(function(response){
		return callbackFunction(false);
	});
}

function geolocate(){
	if( navigator.geolocation ) { 
		navigator.geolocation.getCurrentPosition(function(pos){
			console.log(pos)
			convertLonLat([pos.coords.longitude, pos.coords.latitude],4326,mapGlobal.WKID,geolocateLogic)//callback function
		});
		console.log("geolocate working")
	}else{
		console.log("navigator.geolocation undefined")
	}
}

function geolocateLogic(point){
	if (point){
		console.log(point)
		if (isPointWithinSquare([point.x, point.y], mapGlobal.extent)){
			//KS: zoom to where assets are beginning to be drawn
			esrimap.centerAndZoom(point, (specifics.assetMaxDrawZoom) ? specifics.assetMaxDrawZoom : 6).then(drawAssetLayer())
		}else{
			var centerPoint = new Point(mapGlobal.centerLonLat.x, mapGlobal.centerLonLat.y, new SpatialReference(mapGlobal.WKID));
			esrimap.centerAndZoom(centerPoint, mapGlobal.centerZoom);
		}
	} else {
		console.log("Couldn't geolocate - point was undefined")	
	}
}
function addGeolocateButton(le_gis){
	var locateCharacter = (specifics.locateChar) ? specifics.locateChar : '⌕';
	le_gis.find('> .esriMapContainer').prepend(
		'<div class="esriSimpleSlider esriLocateButton" style="z-index: 30;top: 82px;left: 20px;"><div title="Locate"><span>'
		+ locateCharacter +'</span></div></div>'
	)
	//KS add (and remove excisitng) event listener
	$('.esriLocateButton').off('click').on('click',function(){
		geolocate();
	});
}

function getOpenCaseMarker(xmax, xmin, ymax, ymin){
       if (KDF.getVal('txt_eventcode')) { 
                 
                 //console.log('mantap')
                 //console.log(KDF.getVal('txt_customer_id'))
                 if (typeof KDF.getVal('txt_customer_id') !== undefined && KDF.getVal('txt_customer_id') !== "") {
                   sx_customer_id = KDF.getVal('txt_customer_id'); 
                    //console.log('asdf')
                 } else if (KDF.getVal('txt_customer_id') === "") {
                    sx_customer_id = '999999999'; 
                     //console.log('assdf11df')
                 }
                 //console.log(sx_customer_id);
               KDF.customdata('open_case_marker', 'create', true, true, {'eventcode': KDF.getVal('txt_eventcode'),'customerid': sx_customer_id, 'xmax': xmax.toString(), 'xmin':xmin.toString(), 'ymax': ymax.toString(), 'ymin': ymin.toString()});
                //KDF.customdata('get_open_case_marker', 'create', true, true, {'eventcode': KDF.getVal('txt_eventcode')});
                KDF.unlock();
             }   
}
