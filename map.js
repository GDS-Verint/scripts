//If max selected assets is undefined then use Luthfans draw asset layer
/*Luthfans */
var luthfan = true;
var faultReportingSearchResults = new Object();
var streetAddress='';

var sx_customer_id='';

var site_name_temp = '';

 function parseRSMarker(response){

 var xmax = esrimap.extent['xmax'];
 var ymax = esrimap.extent['ymax'];
 var xmin = esrimap.extent['xmin'];
 var ymin = esrimap.extent['ymin'];
 

     require([ "esri/graphic", "esri/Color", "esri/InfoTemplate", "esri/symbols/PictureMarkerSymbol", "dojo/domReady!" ],
        function(Graphic,  Color, InfoTemplate, PictureMarkerSymbol) {
            caseLayer = new esri.layers.GraphicsLayer({id:"case_marker_layer"});
              $.each(response.data, function( i, result ) {
                  
                     var point = new Point(Number(result.longitude), Number(result.latitude), new esri.SpatialReference({ wkid: 27700 }));
    				 var markerSymbol = new PictureMarkerSymbol(result.icon, 64, 64);
    			
    				 markerSymbol.setOffset(0, 0);
    				 var caseGraphic = new Graphic(point, markerSymbol);
    				 caseGraphic.setAttributes({"title":'', "description": result.description, "caseid": result.title, "latitude": result.latitude, "longitude": result.longitude});
    				 
                     caseLayer.add(caseGraphic);

             });
               caseLayer.on('click', function(event) {
                     esrimap.infoWindow.hide();
                      //console.log(event.graphic.attributes.latitude)
                        
                       esrimap.setInfoWindowOnClick(false);
                    
                      KDF.setVal('txt_case_id_subscribe', event.graphic.attributes.caseid)
                	  if (typeof esrimap.getLayer("graphicsLayer2") !== 'undefined') {
                           esrimap.getLayer("graphicsLayer2").hide();
                       }
                           
                       var lan = event.graphic.attributes.latitude ;
                       var long =  event.graphic.attributes.longitude ;
                       
                       //var centerpoint = new Point(parseInt(long), parseInt(lan), new esri.SpatialReference({wkid: 27700}));
		               // esrimap.centerAndZoom(centerpoint, 6);
                           
                       luthfancallInfoWindow2(parseInt(lan), parseInt(long));
                       
                     });
                           
            	esrimap.addLayer(caseLayer);
       }); 
             //console.log(esrimap)
}

$(document).on('keypress','#dform_widget_txt_postcode',function() {
  if (event.keyCode == 13) {
    event.preventDefault();
    searchBegin();
  }
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
function keatonHighlightMissingAsset(globalX, globalY) {
    
    clearPreviousLayer();
    showLoading();
            
	var newlayer = new GraphicsLayer();
	var xcoord = parseInt(globalX);
	var ycoord = parseInt(globalY);
	console.log('ini geometry x ' + xcoord);

	var url = getMapParams().addressSearchService.base;
	url += '&location='+xcoord+'%2C+'+ycoord;//KS is the + within the string suposed to be there?
	
	console.log(url);

	$.ajax({url: url,  crossDomain: true}).done(function(result) {
		streetAddress = result.address;
		console.log(result.address);

		hideLoading();
		console.log(streetAddress.Address);
		 var content = streetAddress.Address + '</br></br>'
		 + '<button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm Location</button></div>' ;

		 var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: getMapParams().WKID}));

		var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-blue.png', 64, 64);
		markerSymbol.setOffset(0, 32);
		var marker = new Graphic(centerpoint, markerSymbol);
		marker.setAttributes({"value1": '1', "value2": '2', "value3": '3'});
		newlayer.add(marker);
		newlayer.on('click', function(event) {
			setInfoWindowContent(content,xcoord,ycoord);
		});
		esrimap.addLayer(newlayer);

		setInfoWindowContent(content,xcoord,ycoord);
	}).fail(function() {
		KDF.showError('It looks like the connection to our mapping system has failed, please try to log the fault again');
	});
		
}

function luthfanHighlightMissingAsset(globalX, globalY){//Override if luthfan = true
	    
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
function luthfanDrawAssetLayer(){//TODO update URL
	    
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
        /*
        var infoTemplate = new InfoTemplate();
        
         infoTemplate.setTitle("hello there");
         infoTemplate.setContent("please pop up");

        assetLayer.setInfoTemplate(infoTemplate);
        */
        var redColor = Color.fromArray([0, 204, 153]);
			    //KS: use defind object to create marker
				sms = new SimpleMarkerSymbol(specifics.markerSymbol);
		    
        var sms;
			if (specifics.markerSymbol){}else{
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
								value.attributes.feature_location + '</br><b>Site name : </b>' + value.attributes.site_name
								+ '</br><b>Type name : </b>' + value.attributes.feature_type_name
								 + '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm location</button></div>';
	        } else {
	            //console.log('litter')
	         infoWindowContent = '<b>Asset ID</b> : ' + value.attributes.ASSET_ID + '</br><b>Location : </b>' + 
								value.attributes.LOCATION + '</br><b>Site name : </b>' + value.attributes.SITE_NAME + '</br><b>Type name : </b>' + value.attributes.TYPE_NAME
								 + '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm location</button></div>';
         
	        }
	        
	        var point = new Point(Number(value.geometry.x), Number(value.geometry.y), new esri.SpatialReference({ wkid: 27700 }));
	        var graphic = new esri.Graphic(point, sms);  
	        
	         if (KDF.getVal('asset_layer')) {
	             graphic.setAttributes({"title": '', "description": infoWindowContent, "latitude":value.geometry.y, "longitude":value.geometry.x, "site_code": value.attributes.site_code});
	        } else {
                 graphic.setAttributes({"title": '', "description": infoWindowContent,"latitude":value.geometry.y, "longitude":value.geometry.x, "site_code": value.attributes.SITE_CODE, "ASSET_ID": value.attributes.ASSET_ID});
	        }
	
	      
		    assetLayer.add(graphic);
	    });
	    
	         // assign the click event to the 
    	     assetLayer.on('click', function(event) {
    	         console.log(event.graphic.attributes)
    	         
    	         //esrimap.setInfoWindowOnClick(false);
    	    
    				if (typeof esrimap.getLayer("graphicsLayer2") !== 'undefined') {
                        esrimap.removeLayer(esrimap.getLayer("graphicsLayer2"));
                    }
                    
                    var lan = event.graphic.attributes.latitude ;
                    var long =  event.graphic.attributes.longitude ;
                    
                     KDF.customdata('reverse-geocode-edinburgh', 'create', true, true, {'longitude': long.toString() , 'latitude' : lan.toString()});
                    KDF.unlock();
                    
                    if (typeof KDF.getVal('txt_confirm_lat') != 'undefined' && KDF.getVal('txt_confirm_lon') != 'undefined') {
                        KDF.setVal('txt_confirm_lat', lan.toString());
                        KDF.setVal('txt_confirm_lon', long.toString());
                    }
                    
                    if (typeof KDF.getVal('txt_confirm_sitecode') != 'undefined') {
                        KDF.setVal('txt_confirm_sitecode', event.graphic.attributes.site_code);
                    }
                    
                    KDF.setVal('txt_confirm_assetid', event.graphic.attributes.ASSET_ID);
                    
                   // esrimap.centerAndZoom(new Point(long, lan, new esri.SpatialReference({ wkid: 27700 })), 6);
                  //assetLayer.redraw();
                  luthfancallInfoWindow(event.graphic.attributes.description, lan, long);
                  
                  // esrimap.centerAt(new Point(long, lan, new esri.SpatialReference({ wkid: 27700 })));
                   
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

function keatonDrawAssetLayer(layersToKeep){
    //console.log('layersToKeep:')
    //console.log(layersToKeep)
    //KS: layersToKeep e.g. [esrimap.Graphics.graphics[0], esrimap.Graphics.graphics[1]]
	//    should be the recreated each time
	
	//KS: if layers to keep is array - use it otherwise define as array
	var activeLayers;
	if (layersToKeep !== null && Array.isArray(layersToKeep)){
	    activeLayers=layersToKeep
	}else {
	    activeLayers=[]
	}
	
	KDF.hideMessages();
	
	//KS: calculate windoiw size
	var xy = getWindowDrawBounds({
	    xMax:esrimap.extent.xmax,
	    yMax:esrimap.extent.ymax,
	    xMin:esrimap.extent.xmin,
	    yMin:esrimap.extent.ymin,
	});
	
	
	//KS maybe use multiplyer to expand search radius
	var eachPoints=[];
	
	//KS call url builder - can't assume it's in specified format in the future
	var esriAssetUrl = getCommunalAssetURl() + '&geometry=%7B%22xmin%22%3A' + xy['xMin'] + '%2C%22ymin%22%3A' + xy['yMin'] + '%2C%22xmax%22%3A' + xy['xMax'] + '%2C%22ymax%22%3A' + xy['yMax'] + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A'+getMapParams().WKID+'%7D%7D';
	//console.log('RestURL: '+esriAssetUrl)
	$.ajax({url: esriAssetUrl, dataType: 'jsonp', crossDomain: true}).done(function(response) {
		//console.log('response: ');console.log(response);console.log('getMapParams().selectStorage.length:');console.log(getMapParams().selectStorage.length);
		//getMapParams().selectStorage[0].points = [];getMapParams().selectStorage[1].points = [];if(getMapParams().selectStorage.length=3)getMapParams().selectStorage.splice(2,1);
		response.features.forEach(function(point){
		    //if (point.attributes['FEATURE_ID']=='RHD05'){console.log('RHD05 '+point.attributes['OBJECTID']);console.log(point);}
		    var notUsed = true;
		    getMapParams().selectStorage.forEach(function(filter){
		        if (filter.selectedAssets.includes(point.attributes[filter.uniqueField])){
		            filter.points.push([point.geometry.x, point.geometry.y]);
		            notUsed=false;
		        }
		    })
		    if (notUsed){
		        eachPoints.push([point.geometry.x, point.geometry.y]);
		    }
		    /*if (getMapParams().selectStorage.selectedAssets.includes(point.attributes[getMapParams().selectStorage.uniqueField])){
		        console.log(point.attributes[getMapParams().selectStorage.uniqueField])
		        selectedPoints.push([point.geometry.x, point.geometry.y]);
		    }else{
		        eachPoints.push([point.geometry.x, point.geometry.y]);
		    }*/
			//KS using ~OBJECTID must be used here - since that information gets stripped out when added
		    //replaceSymbol(graphic, getMapParams().selectStorage.uniqueField, getMapParams().selectStorage.selectedAssets, getMapParams().selectStorage.selectSymbol)
		
		});
		
		var sms;
		if (getMapParams().markerSymbol){
			//KS: use defind object to create marker
			sms = getMapParams().markerSymbol;
		}else{
			//KS: use default marker
			sms = {	color: [0, 204, 153],
				size: "12",
				outline: {color: [0, 153, 255],width: "5px",}
			}
		}
		
		var featureFilters = JSON.parse(JSON.stringify(getMapParams().selectStorage));
		featureFilters.push({//KS: assets that didn't have a filter applied
		    points:eachPoints,
            uniqueField:false,
        	selectedAssets:true,
        	selectSymbol:sms,
        	wkid:getMapParams().WKID,
		});
		
		getMapParams().selectStorage.forEach(function(filter){
		    //KS: clean up getMapParams().selectStorage
		    filter.points = [];
		});
		
		//console.log('featureFilters:');console.log(featureFilters);
		
		featureFilters.forEach(function(filter){
		    //KS BUG and old layer is kept! Doubles assets on select!
		    filter.points=new esri.geometry.Multipoint({"points":filter.points,"spatialReference":({"wkid":filter.wkid})});
		    filter.selectSymbol=new SimpleMarkerSymbol(filter.selectSymbol);
		    filter.graphic=new esri.Graphic(filter.points, filter.selectSymbol);
		    filter.graphic.setAttributes({"title": new Date().getTime()})
		    //console.log('Before activeLayers.unshift:');console.log(activeLayers);
		    activeLayers.unshift(filter.graphic);
		    //console.log('After activeLayers.unshift:');console.log(activeLayers);
		    if(filter.graphic.geometry.points.length > 0){
			    esrimap.graphics.add(filter.graphic);
		    }
		});
		

		removeLayers(esrimap.graphics, activeLayers);
	}).fail(function() {
		KDF.showError('It looks like the connection to our mapping system has failed, please try to log the fault again');
	});	
}

/**/


//KS: use this to get status
var mapScriptStatus = jQuery.Deferred();

var Map, Point, SimpleMarkerSymbol, PictureMarkerSymbol, Graphic, GraphicsLayer, InfoWindow, Circle, Units, GeometryService, SpatialReference, Color, Popup, Geocoder, OverviewMap, Identify, Find, InfoTemplate, PictureMarkerSymbol;

require(["esri/map", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/graphic", "esri/layers/GraphicsLayer", "esri/dijit/InfoWindow", "esri/geometry/Circle", "esri/units", "esri/tasks/GeometryService", "esri/SpatialReference", "esri/Color", "esri/dijit/Popup", "esri/dijit/Geocoder", "esri/dijit/OverviewMap", "esri/tasks/identify", "esri/tasks/find", "esri/InfoTemplate", "esri/symbols/PictureMarkerSymbol", "dojo/domReady!"],
	function(classMap, classPoint, classSimpleMarkerSymbol, classPictureMarkerSymbol, classGraphic, classGraphicsLayer, classInfoWindow, classCircle, classUnits, classGeometryService, classSpatialReference, classColor, classPopup, classGeocoder, classOverviewMap, classIdentify, classFind, classInfoTemplate, classPictureMarkerSymbol) {
		Map=classMap; Point=classPoint; SimpleMarkerSymbol=classSimpleMarkerSymbol; PictureMarkerSymbol=classPictureMarkerSymbol; Graphic=classGraphic; GraphicsLayer=classGraphicsLayer; InfoWindow=classInfoWindow; Circle=classCircle; Units=classUnits; GeometryService=classGeometryService; SpatialReference=classSpatialReference; Color=classColor; Popup=classPopup; Geocoder=classGeocoder; OverviewMap=classOverviewMap; Identify=classIdentify; Find=classFind; InfoTemplate=classInfoTemplate; PictureMarkerSymbol=classPictureMarkerSymbol;
		mapScriptStatus.resolve();//KS allows you to identify when classes are loaded
		//Trig: When all the classes are loaded. A better method that can be used in a function is mapScriptStatus.done()
		$(formName()).trigger('_map_classesLoaded');
	}
);


var mapParams = {
    //KS: normally would be empty (maybe a few empty properties), but it being populated simulates adding global varables that would've been added by an extra script
    extent: [334905.5753111506, 310733.193633054, 680181.2782575564, 663544.2449834899],// minX, maxX, minY, maxY
	WKID: 27700,
	WKIDProj4: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
	geolocateButton: true,
	geolocateAuto: false,
	geolocateWKID: 4326,
	geolocateWKIDProj4:'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',//likely is the proj4 for 4326
	centerLonLat: {x:325226.83303699945, y:673836.5572347812},
	centerZoom: 1,
	geometryServer: 'https://edinburghcouncilmaps.info/arcgis/rest/services/Utilities/Geometry/GeometryServer',
	drawWindowMultiplier:1.25,
	selectMultiple:true, //Default is false
	selectStorage:[/*{
            points:[],
            uniqueField:'OBJECTID',
    	    selectedAssets:[11888935,12144406,12144405,12144948,12144862],
    	    selectSymbol:{color:[25, 135, 6], size:"12", outline:{color: [6, 6, 89],width: "1"}},
    	    wkid:27700,
        },*/{
            points:[],
            uniqueField:'FEATURE_ID',
        	selectedAssets:['RHF12','RHF10','RHF24'],
        	selectSymbol:{color:[4, 4, 100], size:"5", outline:{color: [100, 6, 6],width: "1"}},
        	wkid:27700,
    }],
	searchURL:{base: window.location.origin+'/locatorhub/arcgis/rest/services/CAG/POSTCODE/GeocodeServer/findAddressCandidates?&SingleLine=&Fuzzy=true&outFields=*&maxLocations=2000&f=pjson&outSR=27700',varParams:['LH_POSTCODE']},
	baseLayerService: window.location.origin+'/arcgis/rest/services/Basemaps/BasemapColour/MapServer/find',
	backgroundMapService: window.location.origin+'/arcgis/rest/services/Basemaps/BasemapColour/MapServer',
	addressSearchService:{base: window.location.origin+'/arcgis/rest/services/CAG/ADDRESS/GeocodeServer/reverseGeocode?distance=300&outSR=27700&f=json'},
	//processResultURL: window.location.origin+'/ci/AjaxCustom/cagSearch',
	processResultURL:{base: window.location.origin+'/locatorhub/arcgis/rest/services/CAG/STREET/GeocodeServer/findAddressCandidates?SingleLine=&Fuzzy=true&outFields=*&maxLocations=2000&outSR=27700&f=pjson',varParams:['LH_STREET']}
	
};

function getMapParams(){return mapParams;}//KS accessor to give a level of abstraction when we need it
function deleteMapParam(propertyName){
	var noRefCopy = JSON.parse(JSON.stringify(getMapParams()[propertyName]))
	var isDeleted = delete getMapParams()[propertyName];
	//Trig[propDeleted, isDeleted, copyOfContents]: lets you know if something from mapParams was deleted and if so, what it was
	$(formName()).trigger('_map_paramDeleted',[propertyName, isDeleted, noRefCopy]);
}
function setMapParams(obj){
	//KS Overwrites properties
	for(var property in obj){
		getMapParams()[property] = obj[property];
	}
	
}
var specifics = mapParams;function setSpecifics(obj){setMapParams(obj);}function getSpecifics(){getMapParams();}
function drawAssetLayer(layersToKeep){
	if (getMapParams().selectQueueSize > 1){
		keatonDrawAssetLayer(layersToKeep);
	}else{
		luthfanDrawAssetLayer();
	}
}

function getWindowDrawBounds(xyMinMax){
    var scale = 1;
    if (getMapParams().drawWindowMultiplier !== null){
        scale = getMapParams().drawWindowMultiplier 
    }
    return {
        //KS it expands the two xy points by the scale: 1 = normal area; 1.5 = 4*normal area; 2 = 9*normal area;
        xMax:xyMinMax['xMax']+((scale-1)*(xyMinMax['xMax']-xyMinMax['xMin'])),
        yMax:xyMinMax['yMax']+((scale-1)*(xyMinMax['yMax']-xyMinMax['yMin'])),
        xMin:xyMinMax['xMin']-((scale-1)*(xyMinMax['xMax']-xyMinMax['xMin'])),
        yMin:xyMinMax['yMin']-((scale-1)*(xyMinMax['yMax']-xyMinMax['yMin'])),
    }
}
function removeLayers(esriGraphics, layersToKeep){
	for (var i = 0; i < esriGraphics.graphics.length; i++){
		var remove = true;
		layersToKeep.forEach(function(layer){
		    ///KS for timestamp of creation/id console.log(layer.attributes['title'])
			if (esriGraphics.graphics[i]==layer)remove = false;
		});
		if (remove) esriGraphics.remove(esriGraphics.graphics[i]);
	}
}
function replaceSymbol(graphicLayer, fieldID, selectArray, selectSymbol){
	//KS select
}
function removeSelectedAssets(graphicLayer){
	
}
function getAssetInfoFromCoord(point){
    
}
$('#dform_container').off('_KDF_mapReady').on('_KDF_mapReady', function(event, kdf, type, name, map, positionLayer, markerLayer, marker, projection) {
	//KS currently not working with map like _KDF_search is in style-4.js is
	console.log('Script side _KDF_mapReady tiggered');
	if (getMapParams().geolocateButton){
		addGeolocateButton($("[data-type='gis']"));
	}
	if (getMapParams().geolocateAuto){
		geolocate();
	}
	//KS to avoid the bug with customerFeilds not being constructed at _KDF_ready
	/*if (typeof regexSearch = 'function')*/ regexSearch("[0-9A-Za-z ]{3,}");
	
});

var faultReportingSearchResults = new Object();
var streetAddress='';

$(document).on('click','.mapConfirm',function() {
    KDF.setVal('txt_issuestreet',KDF.getVal('le_gis_rgeo_desc'));
    KDF.gotoNextPage();
 });
 
$(document).on('click','#dform_widget_button_but_search',function() {
	
  if (!$('#dform_widget_txt_postcode').hasClass('dform_fielderror')){//KS: prevent search if it has an error
	searchBegin();  
  }
});

function getCommunalAssetURl() {
    //KS now supports a url asset code defined on an element called 'asset_layer' and a URL defined in the scriting tab within 'getMapParams().assetURL'. If none is found then return false (since no reasonable default can be supplied)
    if (KDF.getVal('asset_layer')){ //Returns true if defined
        //KS asset layer NUMBER defined on form TODO check it's number and 'continue' if not to avoid assigning invalid assetURL, might still be possible to use an excisting one
        getMapParams().assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/' + KDF.getVal('asset_layer') + '/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
        //console.log(getMapParams().assetURL)
        return getMapParams().assetURL;
    }//KS else statement avoided due to return above - TODO allows block above to continue if number is invalid
    //KS no asset_layer defined on form
    if (getMapParams().assetURL){
        //KS assetURL defined in object - assume it's the entire URL
        return getMapParams().assetURL;
    }
    if (getMapParams().formName){//LB
        if (getMapParams().formName === 'road_sign'){
	    if (KDF.getVal('rad_problem_type') === 'unlit' ){
		getMapParams().assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/7/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
		return getMapParams().assetURL;
	    } else if (KDF.getVal('rad_problem_type') === 'lit' ){
		getMapParams().assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/3/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
		return getMapParams().assetURL;
	    }   
        }else if (specifics.formName === 'litter_flytipping'){
	     specifics.assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/26/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
	     console.log('call bro 2')
	     return specifics.assetURL;
	}
        
    }
    else{
        //KS no URL specified - since no resonable default can be used - assign false to aid with error handaling
        return false;
    }
}

function postcodeSearch(searchInput) {
	//KS perhaps we could apply a regex to seperate searches into difffrent rest api
    var esriServiceURL = getMapParams().searchURL.base
    esriServiceURL += '&LH_POSTCODE='+searchInput;
	
    var xcoord;
    var ycoord;
    var USRN;
    
	$.ajax({url: esriServiceURL, dataType: 'json', crossDomain: true}).done(function(response) {
        //console.log('Response below:')
        //console.log(response.candidates.length)
        
        if (response.candidates.length > 2){
        
           $.each(response.candidates, function( key, value ) {
                 xcoord=value.location.x;
                 ycoord=value.location.y;
                 USRN=value.attributes.USRN;
           });
           
           if (typeof KDF.getVal('txt_confirm_sitecode') !== 'undefined') {
            	     KDF.setVal('txt_confirm_sitecode', USRN);
            	   }
           
			hideLoading();
			var popCenterpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: getMapParams().WKID}));
    		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: getMapParams().WKID}));
    		esrimap.centerAndZoom(centerpoint, 6);
    		
    		KDF.showWidget('but_no_map');
        } else {
            KDF.showWidget('html_nosearchfound');
		    hideLoading();
        }
	}).fail(function() {
		KDF.showError('We where unable to complete a postcode search - please ensure a valid postcode was used');
	});
        
    
}

function getAssetInfo(globalX, globalY) {
   clearPreviousLayer();

   var point = new Point([globalX, globalY]);
   var centerpoint = new Point(globalX, globalY, new esri.SpatialReference({wkid: getMapParams().WKID}));

	var circleGeometry = new Circle(centerpoint,{"radius": 15, "numberOfPoints": 4, "radiusUnit": Units.METERS, "type": "extent"});
	var esriServiceURL = '';
	var content = '';

	showLoading();
	//console.log(circleGeometry);

	var xmaxE = circleGeometry.getExtent().xmax;
	var ymaxE = circleGeometry.getExtent().ymax;
	var xminE = circleGeometry.getExtent().xmin;
	var yminE = circleGeometry.getExtent().ymin;
		//KS might make more sense to use encodeURI() and decodeURI()
		esriServiceURL = getCommunalAssetURl() + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A'+getMapParams().WKID+'%7D%7D';
		//console.log(esriServiceURL);

			$.ajax({url: esriServiceURL, dataType: 'jsonp', crossDomain: true}).done(function(response) {
				//console.log('Response below: k')
				//console.log(response)
				
				hideLoading();
				console.groupCollapsed('Feature responces:')
				console.log('Actual responce (we should implement the closest one soon):');
				console.log(response)
				$.each(response.features, function( key, value ) {
					//KS implementation of dynamicly displayed properties
					content = ''; //KS otherwise will display all resukts - maybe update when we're using PopUp
					if (KDF.getVal('asset_popup_fields')){
						//KS TODO implement form based way to display fields e.g. on a table that has same information
						//console.log('asset_popup_fields defined');
					}else{
					    console.log(value.attributes['FEATURE_ID'])
					    console.log(value)
						//console.log('asset_popup_fields not defined');
			//console.log(value.attributes);
						if(getMapParams().popupFields){//KS object is defined (test with empty object, will return true but we might want that, considering default is null)
							//console.log('getMapParams().popupFields defined');
							getMapParams().popupFields.forEach(function(element){
								content += '<b>'+element[0]+'</b>'+ value.attributes[element[1]]+"</br>";
							});
							if (getMapParams().popupConfirmText){
								//KS defined button text
								content += '</br><button id="" class="mapConfirm btn-continue" data-asset_id="">'+getMapParams().popupConfirmText+'</button></div>';
							}else{
								//KS default text
								content += '</br><button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm</button></div>';
							}
						} else if(getMapParams().formName){
							if (getMapParams().formName === 'road_sign') {
								var bisa=value.attributes;

								content = '<b>Asset ID</b> : ' + bisa.ASSET_ID + '</br><b>Location : </b>' + 
								bisa.LOCATION + '</br><b>Site Name : </b>' + bisa.SITE_NAME + '</br><b>Type Name : </b>' + bisa.TYPE_NAME
								+ '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Report this sign</button></div>' ;
							}

							if (getMapParams().formName === 'communal_bin') {
									//console.log('getMapParams().popupFields undefined. Value is:');
							//console.log(value)
							//KS what will be default? maybe display all (do we need formatting?)
							//KS untill I update it for him, it will be for LB's form

							content = '<b>Asset ID</b> : ' + value.attributes['ASSET_ID'] + '</br><b>Location : </b>' + 
							value.attributes['feature_location'] + '</br><b>Site Name : </b>' + value.attributes['site_name']
							+ '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Report this bin</button></div>';
							}
						} 

						else {
							//console.log('getMapParams().popupFields undefined. Value is:');
							//console.log(value)
							//KS what will be default? maybe display all (do we need formatting?)
							//KS untill I update it for him, it will be for LB's form

							content = '<b>Asset ID</b> : ' + value.attributes['ASSET_ID'] + '</br><b>Location : </b>' + 
							value.attributes['feature_location'] + '</br><b>Site Name : </b>' + value.attributes['site_name']
							+ '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Report this bin</button></div>';
						}
					}

				});
				console.groupEnd() 
				var newlayer = new GraphicsLayer();
				var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-blue.png', 64, 64);
				markerSymbol.setOffset(0, 32);
				var marker = new Graphic(centerpoint, markerSymbol);
				newlayer.add(marker);
				newlayer.on('click', function(event) {
					//console.log('newLayer.on > callInfoWindow');
					//if(popupOrZoomTo(esrimap, centerpoint)){
						callInfoWindow(content, marker, esrimap);
					//}
				});
				
				esrimap.addLayer(newlayer);
				//console.log('Single after newLayer.on > callInfoWindow');
				//if(popupOrZoomTo(esrimap, centerpoint)){
					callInfoWindow(content, marker, esrimap);
				//}
				//Trig[content, esriServiceURL]: provides the content of the asset response and the url used to return it.
				$(formName()).trigger('_map_assetInfoReturned',[content, esriServiceURL]);
				esrimap.centerAndZoom(centerpoint, (esrimap.getLevel() != null)?esrimap.getLevel():1 )
				
		}).fail(function() {
		KDF.showError('Was unable to get asset details at this time, please try again');
	});
}    

function callInfoWindow(content, marker, map){
    console.groupCollapsed('infowindow content:');
    console.log(content);
    console.groupEnd();
        if(content == null || content==''){
            if(getMapParams().defaultPopupContent){
			    content = (getMapParams().defaultPopupContent instanceof Function) ? getMapParams().defaultPopupContent() : getMapParams().defaultPopupContent;
			} else{
				content = '<u><b>Asset not found.</b></u></br></br><u><b>If you believe there is an asset here please click below button to report.</b></u>'
            + '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Report this location</button></div>';
			}
        }

		var centerpoint = new Point(marker.geometry.x, marker.geometry.y, new esri.SpatialReference({wkid: getMapParams().WKID}));

		map.infoWindow.setTitle('');
		map.infoWindow.setContent(content);
		map.infoWindow.show(centerpoint);
		//esrimap.centerAndZoom(centerpoint, 18);
		drawAssetLayer();
		
}

function luthfancallInfoWindow(content, lat, long){
    esrimap.infoWindow.hide();
    console.groupCollapsed('infowindow content:');
    console.log(content);
    console.groupEnd();

		var centerpoint = new Point(long, lat, new esri.SpatialReference({wkid: getMapParams().WKID}));

		esrimap.infoWindow.setTitle('');
		esrimap.infoWindow.setContent(content);
		
		esrimap.infoWindow.anchor = "right";
		esrimap.infoWindow.show(centerpoint);
		
		 if (esrimap.getLevel() != '6') {
            	        console.log('test');
            	        esrimap.centerAndZoom(centerpoint, 6);
            	    } else {
            	        esrimap.centerAt(centerpoint);
            	    }
    	
		//esrimap.centerAndZoom(centerpoint,6);
		
		console.log(esrimap);
}

function luthfancallInfoWindow2(lat, long){
    esrimap.infoWindow.hide();

		var centerpoint = new Point(long, lat, new esri.SpatialReference({wkid: getMapParams().WKID}));

		//esrimap.infoWindow.setTitle('');
		//esrimap.infoWindow.setContent('');
		
		esrimap.infoWindow.anchor = "right";
		esrimap.infoWindow.show(centerpoint);
		esrimap.centerAndZoom(centerpoint,6);
		
}

function zoomChanged(evt){
	//drawAssetLayer();
	if (evt['levelChange']==true) {console.log('Zoom: '+evt.lod.level);}
	//KS won't be implemented due to demo
	//Should we prevent clicking?
	if (getMapParams().assetMaxDrawZoom){
	    //console.log('has level defined');
	    //KS implement user specified zoom extent 
	    if (evt.lod.level >= getMapParams().assetMaxDrawZoom){
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
		    //console.log('zoom under default');
	    //KS zoom is at or more magnified than max level - so draw it
	        drawAssetLayer();
			if (luthfan) {
				var xmaxE = esrimap.extent.xmax;
				var ymaxE = esrimap.extent.ymax;
				var xminE = esrimap.extent.xmin;
				var yminE = esrimap.extent.ymin;
				getOpenCaseMarker(xmaxE, xminE, ymaxE, yminE);
			}
	    }else{
		    //console.log('zoom over default');
	        //KS remove assets if above extent - aesthetic only
	        esrimap.graphics.clear();
	    }
	}
	
}


$(document).on('change','#dform_widget_fault_reporting_search_results' , function() {
 
  var selectResult = $('select#dform_widget_fault_reporting_search_results option:checked').val();
  //console.log(faultReportingSearchResults);
   if (selectResult !== "") {
          $.each(faultReportingSearchResults, function(
            key,
            faultReportingSearchResults
          ) {
              
               if (selectResult == faultReportingSearchResults.site_name) {
                esrimap.centerAndZoom(new Point(faultReportingSearchResults.xCoord, faultReportingSearchResults.yCoord, new esri.SpatialReference({ wkid: 27700 })), 6);
                KDF.showWidget('but_no_map');
                
                   if (typeof KDF.getVal('txt_confirm_sitecode') !== 'undefined') {
            	     KDF.setVal('txt_confirm_sitecode', faultReportingSearchResults.USRN);
            	   }
            	   
            	   KDF.setVal('txt_street_id', '');
    	              KDF.setVal('txt_set_title', '');
    	             KDF.setVal('txt_confirm_lon', '');
    	              KDF.setVal('txt_confirm_lat', '');
    	              KDF.setVal('txt_confirm_assetid', '');
            	   
            	   KDF.setStreetID(faultReportingSearchResults.LOCATOR_DESCRIPTION,false,'');
               }
          });
        }
});
// unused fo now
function callEsriSearch (searchInput){
	var token ='';
	var findMapService = getMapParams().baseLayerService;
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
	if (getMapParams().selectQueueSize > 1){
		keatonHighlightMissingAsset(globalX, globalY)
	}else{
		luthfanHighlightMissingAsset(globalX, globalY)
	}
}

function processResult(searchInput){
    KDF.hideMessages();
	
	var resultCount = 0;
	
	var resultAssetArray = new Object();
	
	var esriServiceURL = getMapParams().processResultURL.base
    esriServiceURL += '&LH_STREET='+searchInput+'*';

	$.ajax({url: esriServiceURL, dataType: 'json', crossDomain: true, method: 'GET'
	}).done(function(response) {
	    //console.log(response);
	   	if(response.length === 2){
    		KDF.showWidget('html_nosearchfound');
    		hideLoading();
	    } else {
	        $.each(response.candidates, function( key, value ) {
                resultAssetArray[value.attributes.STREET_DESCRIPTOR] = new Object();
                resultAssetArray[value.attributes.STREET_DESCRIPTOR]['site_name'] = value.attributes.LOCATOR_DESCRIPTION;
                resultAssetArray[value.attributes.STREET_DESCRIPTOR]['xCoord'] = value.location.x;
                resultAssetArray[value.attributes.STREET_DESCRIPTOR]['yCoord'] = value.location.y;
				resultAssetArray[value.attributes.STREET_DESCRIPTOR]['USRN']= value.attributes.USRN;
          
	        });
	        
	        console.log(resultAssetArray);
	    }
	        
	          $.each(response.candidates, function( key, value ) {
	             resultCount++;
	          });
	         
	          console.log(resultCount);
	         
	          
	          if(resultCount == 1){
	              
	              $.each(resultAssetArray, function(key, resultAssetArray ) {
					if (typeof KDF.getVal('txt_confirm_sitecode') !== 'undefined') {
    	                  KDF.setVal('txt_confirm_sitecode', resultAssetArray.USRN);
    	              }
    	              
    	              KDF.setVal('txt_street_id', '');
    	              KDF.setVal('txt_set_title', '');
    	             KDF.setVal('txt_confirm_lon', '');
    	              KDF.setVal('txt_confirm_lat', '');
    	               KDF.setVal('txt_confirm_assetid', '');
    	              
    	              KDF.setStreetID(resultAssetArray.LOCATOR_DESCRIPTION,false,'');
    	              esrimap.centerAndZoom(new Point(resultAssetArray.xCoord, resultAssetArray.yCoord, new esri.SpatialReference({ wkid: 27700 })), 6);
		                KDF.showWidget('but_no_map');
	              });
				  
	               // centreOnEsriResult('', '', xmax, xmin, ymax, ymin, '', '');
	          }  else {
	               $('label[for=dform_widget_fault_reporting_search_results]').html('<label for="dform_widget_fault_reporting_search_results">Multiple results, please select one:</label>');
	               $('#dform_widget_fault_reporting_search_results').append($('<option>', {value: 'Please select a location',text: 'Please select'}))
	               $.each(resultAssetArray, function(key, resultAssetArray2 ) {
	                   console.log(resultAssetArray2.site_name);
    		    	   $('#dform_widget_fault_reporting_search_results').append($('<option>', {value: resultAssetArray2.site_name,text: resultAssetArray2.site_name}))
    		        
    		           KDF.showWidget('fault_reporting_search_results');
	               });
	          }
	         
	    
	   
	    faultReportingSearchResults = resultAssetArray;
	    
	   
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
		var popCenterpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: getMapParams().WKID}));
		esrimap.infoWindow.setTitle('Please confirm street address.');
		esrimap.infoWindow.setContent(content);
		esrimap.infoWindow.show(popCenterpoint);
		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: getMapParams().WKID}));
		esrimap.centerAndZoom(centerpoint, esrimap.getLevel());//KS:herts update
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
    //console.log('call b')
	KDF.hideWidget('ahtm_cool_loading_gif');
	changeAllLayersOpacity('0.9');
	esrimap.enableMapNavigation();
	esrimap.showZoomSlider();
}

function searchBegin(){
        
       //KDF.showWidget('ahtm_report_without_map');
      
       KDF.hideWidget('but_no_map');
       KDF.hideMessages();
       searchInput = KDF.getVal('txt_postcode');
       $('#dform_widget_fault_reporting_search_results').empty();
       KDF.hideWidget('fault_reporting_search_results');
       KDF.hideWidget('html_nosearchfound');
  
       showLoading();
       
       if (searchInput.charAt(0) !== 'E' && searchInput.charAt(1) !== 'H'){
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
    var backgroundMapService = getMapParams().backgroundMapService;
    bglayer = new esri.layers.ArcGISTiledMapServiceLayer(backgroundMapService,{opacity:1, id: "bglayer"});
    esrimap.addLayer(bglayer);
}

function drawResultsLayer(){
    resultslayer = new esri.layers.GraphicsLayer({id: "resultslayer"});
	esrimap.addLayer(resultslayer);
}

function clearPreviousLayer(){
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


function centreOnEsriResult(geometryX, geometryY, xmax, xmin, ymax, ymin, north, east){
    
    if (geometryY!=''){
		var newlayer = new GraphicsLayer();
		var xcoord = geometryX;
		var ycoord = geometryY;
		console.log(xcoord);
		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: getMapParams().WKID}));
		esrimap.centerAndZoom(new Point(xcoord, ycoord), esrimap.getLevel());
		var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-red.png', 64, 64);
		markerSymbol.setOffset(0, 32);
		var marker = new Graphic(centerpoint, markerSymbol);
		marker.setAttributes({"value1": '1', "value2": '2', "value3": '3'});
		newlayer.add(marker);
		esrimap.addLayer(newlayer);
		
		console.log('geometryY!=')
    } else if (ymin!='') {
		  var spatialref = new esri.SpatialReference({ wkid: getMapParams().WKID }); //ref to British national grid projected coordinates
		  var selectedExtent = new esri.geometry.Extent(xmax,ymax,xmin,ymin,spatialref);
            console.log('ymin!=')
		  esrimap.setExtent(selectedExtent);
		  if (parseInt(esrimap.getZoom()) !== 6){
		      console.log('helo')
		        esrimap.setZoom(6);
		  }
		
    } else if (north != '') {
		  var e = parseInt(east);
		  var n = parseInt(north);
		  var spatialref = new esri.SpatialReference({ wkid: getMapParams().WKID }); //ref to British national grid projected coordinates
		  var selectedExtent = new esri.geometry.Extent(e - 250, n - 250, e + 250 , n + 250, spatialref);

		  esrimap.setExtent(selectedExtent);
		  console.log('north !=')
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
	if (getMapParams().assetMaxDrawZoom){
		if (getMapParams().assetMaxDrawZoom > aMap.getLevel()){//KS: center and zoom
			aMap.centerAndZoom(location, getMapParams().assetMaxDrawZoom);
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
	if (inputSR.type && inputSR.type == 'Proj4'){
		//E.G. convertLonLat([0,0],{},{},)
		//KS is there anyway to convert the Proj4 projection to a SpatialReference? then we could drop the outputSR.wkid
		var conversion = proj4(inputSR.projection, outputSR.projection, lonLatArray);
		callbackFunction({
			x:conversion[0],
			y:conversion[1],
			WKID:outputSR.WKID
		});
	}else {
		//KS: the callback function is the name (no ()) of the function the return value should call
		var inLon = lonLatArray[0];//Y
		var inLat = lonLatArray[1];//X
		var inSR = new SpatialReference({wkid: inputSR});
		var outSR = new SpatialReference({wkid: outputSR});

		var outPoint;

		var requestURL = getMapParams().geometryServer+'/project?f=pjson&inSR='
			+inputSR+'&outSR='
			+outputSR+'&geometries=%7B%22geometryType%22%3A%22esriGeometryPoint%22%2C%22geometries%22%3A%5B%7B%22x%22%3A'
			+inLon+'%2C%22y%22%3A'
			+inLat+'%7D%5D%7D';

		$.ajax({url: requestURL, dataType: 'jsonp', crossDomain: true}).done(function(response){
			return callbackFunction({
				x:response.geometries[0].x,
				y:response.geometries[0].y,
				WKID:outSR
			});
		}).fail(function(response){
			return callbackFunction(false);
		});
	}
	
}

function geolocate(){
	if( navigator.geolocation ) { 
		navigator.geolocation.getCurrentPosition(function(pos){
			console.log(pos)
			//convertLonLat([pos.coords.longitude, pos.coords.latitude],4326,getMapParams().WKID,geolocateLogic)//callback function
			convertLonLat(
				[pos.coords.longitude, pos.coords.latitude],
				{WKID:getMapParams().geolocateWKID, projection:getMapParams().geolocateWKIDProj4, type:'Proj4'},
				{WKID:getMapParams().WKID, projection:getMapParams().WKIDProj4, type:'Proj4'},
				geolocateLogic//callback function
			);
		});
		console.log("geolocate working")
	}else{
		console.log("navigator.geolocation undefined")
	}
}

function geolocateLogic(lonLatWkid){
	if (lonLatWkid){
		var point = new Point(lonLatWkid.x, lonLatWkid.y, lonLatWkid.WKID);
		console.log(point)
		var withinExtent = isPointWithinSquare([point.x, point.y], getMapParams().extent);
		if (withinExtent){
			//KS: zoom to where assets are beginning to be drawn
			esrimap.centerAndZoom(point, (getMapParams().assetMaxDrawZoom) ? getMapParams().assetMaxDrawZoom : 6).then(drawAssetLayer())
		}else{
			var centerPoint = new Point(getMapParams().centerLonLat.x, getMapParams().centerLonLat.y, new SpatialReference(getMapParams().WKID));
			esrimap.centerAndZoom(centerPoint, getMapParams().centerZoom);
		}
		//Trig[longitude, latitude, WKID, withinExtent]: Only if successful, provides location and if it's within the maps extent
		$(formName()).trigger('_map_geolocated',[point.x, point.y, withinExtent]);
	} else {
		console.log("Couldn't geolocate - point was undefined")	
	}
}
function addGeolocateButton(le_gis){
	var locateCharacter = (getMapParams().locateChar) ? getMapParams().locateChar : '⌕';
	var parent = le_gis.find('> .esriMapContainer')
	var content = '<div class="esriSimpleSlider esriLocateButton" style="z-index: 30;top: 82px;left: 20px;"><div title="Locate"><span>'+ locateCharacter +'</span></div></div>'
	
	parent.prepend(content);
	
	//KS add (and remove excisitng) event listener
	$('.esriLocateButton').off('click').on('click',function(){
		geolocate();
	});
	
	$(formName()).trigger('_map_geolocateButtonAdded',[parent.find('.esriLocateButton'), content]);
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


function formName(){
	//KS: I want triggers to work same way as api.js, so need this to get name
	//KS: for the love of StackExchance, don't put a trigger in here
	if (KDF.kdf().name){
		return '#dform_'+KDF.kdf().name;
	}else{
		//KS: just incase, this will work in most cases (it's what was used before)
		return '#dform_container';
	}
}
