//KS: use this to get status
var mapScriptStatus = jQuery.Deferred();

var Map, Point, SimpleMarkerSymbol, PictureMarkerSymbol, Graphic, GraphicsLayer, InfoWindow, Circle, Units, GeometryService, SpatialReference, Color, Popup, Geocoder, OverviewMap, Identify, Find;

require(["esri/map", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/graphic", "esri/layers/GraphicsLayer", "esri/dijit/InfoWindow", "esri/geometry/Circle", "esri/units", "esri/tasks/GeometryService", "esri/SpatialReference", "esri/Color", "esri/dijit/Popup", "esri/dijit/Geocoder", "esri/dijit/OverviewMap", "esri/tasks/identify", "esri/tasks/find", "dojo/domReady!"],
	function(classMap, classPoint, classSimpleMarkerSymbol, classPictureMarkerSymbol, classGraphic, classGraphicsLayer, classInfoWindow, classCircle, classUnits, classGeometryService, classSpatialReference, classColor, classPopup, classGeocoder, classOverviewMap, classIdentify, classFind) {
		Map=classMap; Point=classPoint; SimpleMarkerSymbol=classSimpleMarkerSymbol; PictureMarkerSymbol=classPictureMarkerSymbol; Graphic=classGraphic; GraphicsLayer=classGraphicsLayer; InfoWindow=classInfoWindow; Circle=classCircle; Units=classUnits; GeometryService=classGeometryService; SpatialReference=classSpatialReference; Color=classColor; Popup=classPopup; Geocoder=classGeocoder; OverviewMap=classOverviewMap; Identify=classIdentify; Find=classFind;
		mapScriptStatus.resolve();//KS allows you to identify when classes are loaded
	}
);
/*KS Temp*/
function regexSearch(regex){
	$(".search-gov input:text, #dform_widget_txt_postcode").attr('pattern',regex);
}
$('#dform_container').ready(function() {
	regexSearch("^[A-Za-z0-9 _]*$");
});

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
    Possibly implement .setFeatureReduction(reduces points into a single larger point) example https://developers.arcgis.com/javascript/3/jssamples/fl_clustering_basic.html
*/


var faultReportingSearchResults = new Object();
var streetAddress='';

var specifics = {};//KS allows form to override defaults
function getSpecifics(){return specifics;}//KS accessor to give a level of abstraction when we need it
function setSpecifics(obj){specifics = obj;}
//call to getCommunalAssetURl() would be try to get val from from 

//KS: need to move to a specifc global varible script but will be her for now.
var mapGlobal = {
	extent: [334905.5753111506, 310733.193633054, 680181.2782575564, 663544.2449834899],// minX, maxX, minY, maxY
	WKID: 27700,
	WKIDProj4: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
	geolocateWKID: 4326,
	geolocateWKIDProj4:'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',//likely is the proj4 for 4326
	centerLonLat: {x:325226.83303699945, y:673836.5572347812},
	centerZoom: 1,
	geometryServer: 'https://edinburghcouncilmaps.info/arcgis/rest/services/Utilities/Geometry/GeometryServer',
	
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
		if (!$('#dform_widget_txt_postcode').hasClass('dform_fielderror')){//KS: prevent search if it has an error
			searchBegin();  
		}
	}
});

// Jquery event delegate so when the confirm location button clicked it can call another function
$(document).on('click','.mapConfirm',function() {
    KDF.setVal('txt_issuestreet',KDF.getVal('le_gis_rgeo_desc'));
    KDF.gotoNextPage();
 });
 
$(document).on('click','#dform_widget_button_but_search',function() {
	
  if (!$('#dform_widget_txt_postcode').hasClass('dform_fielderror')){//KS: prevent search if it has an error
	searchBegin();  
  }
});


$(document).on('click','#dform_widget_button_but_nextcall',function() {
  console.log('next clicked');
    
    if (esrimap !== null){
		clearPreviousLayer();
		esrimap.infoWindow.hide();
        drawBaseLayer();
        //esrimap.setZoom(2);
        var centerpoint = new Point(325375, 673865, new esri.SpatialReference({wkid: 27700}));
		esrimap.centerAndZoom(centerpoint, 2);
		drawAssetLayer();
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
    if (specifics.formName){//LB
        if (specifics.formName === 'road_sign'){
	    if (KDF.getVal('rad_problem_type') === 'unlit' ){
		specifics.assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/7/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
		return specifics.assetURL;
	    } else if (KDF.getVal('rad_problem_type') === 'lit' ){
		specifics.assetURL = 'https://edinburghcouncilmaps.info/arcgis/rest/services/CouncilAssets/ConfirmAssets2/MapServer/3/query?f=pjson&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=27700&outFields=*&outSR=27700&transformForward=false';
		return specifics.assetURL;
	    }   
        }
        
    }
    else{
        //KS no URL specified - since no resonable default can be used - assign false to aid with error handaling
        return false;
    }
}

function postcodeSearch(searchInput) {
    var esriServiceURL = 'https://edinburghcouncilmaps.info/locatorhub/arcgis/rest/services/CAG/POSTCODE/GeocodeServer/findAddressCandidates?&SingleLine=&Fuzzy=true&outFields=*&maxLocations=2000&outSR=27700&f=pjson';
    //LH_POSTCODE=EH1+1BN
    var xcoord;
    var ycoord;
    
    esriServiceURL = esriServiceURL + '&LH_POSTCODE=' + searchInput;
    
	$.ajax({url: esriServiceURL, dataType: 'jsonp', crossDomain: true}).done(function(response) {
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

function getAssetInfo(globalX, globalY) {

   clearPreviousLayer();

   var point = new Point([globalX, globalY]);
   var centerpoint = new Point(globalX, globalY, new esri.SpatialReference({wkid: 27700}));

	var circleGeometry = new Circle(centerpoint,{"radius": 15, "numberOfPoints": 4, "radiusUnit": Units.METERS, "type": "extent"});
	var esriServiceURL = '';
	var content = '';

	showLoading();
	console.log(circleGeometry);

	var xmaxE = circleGeometry.getExtent().xmax;
	var ymaxE = circleGeometry.getExtent().ymax;
	var xminE = circleGeometry.getExtent().xmin;
	var yminE = circleGeometry.getExtent().ymin;

		esriServiceURL = getCommunalAssetURl() + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A27700%7D%7D';
		//console.log(esriServiceURL);

			$.ajax({url: esriServiceURL, dataType: 'jsonp', crossDomain: true}).done(function(response) {
				console.log('Response below: k')
				console.log(response)

				hideLoading();

				$.each(response.features, function( key, value ) {
					//KS implementation of dynamicly displayed properties
					content = ''; //KS otherwise will display all resukts - maybe update when we're using PopUp
					if (KDF.getVal('asset_popup_fields')){
						//KS TODO implement form based way to display fields e.g. on a table that has same information
						//console.log('asset_popup_fields defined');
					}else{
						//console.log('asset_popup_fields not defined');
			//console.log(value.attributes);
						if(specifics.popupFields){//KS object is defined (test with empty object, will return true but we might want that, considering default is null)
							//console.log('specifics.popupFields defined');
							specifics.popupFields.forEach(function(element){
								content += '<b>'+element[0]+'</b>'+ value.attributes[element[1]]+"</br>";
							});
							if (specifics.popupConfirmText){
								//KS defined button text
								content += '</br><button id="" class="mapConfirm btn-continue" data-asset_id="">'+specifics.popupConfirmText+'</button></div>';
							}else{
								//KS default text
								content += '</br><button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm</button></div>';
							}
						} else if(specifics.formName){
							if (specifics.formName === 'road_sign') {
								var bisa=value.attributes;

								content = '<b>Asset ID</b> : ' + bisa.ASSET_ID + '</br><b>Location : </b>' + 
								bisa.LOCATION + '</br><b>Site Name : </b>' + bisa.SITE_NAME + '</br><b>Type Name : </b>' + bisa.TYPE_NAME
								+ '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Report this sign</button></div>' ;
							}

							if (specifics.formName === 'communal_bin') {
									//console.log('specifics.popupFields undefined. Value is:');
							console.log(value)
							//KS what will be default? maybe display all (do we need formatting?)
							//KS untill I update it for him, it will be for LB's form

							content = '<b>Asset ID</b> : ' + value.attributes['ASSET_ID'] + '</br><b>Location : </b>' + 
							value.attributes['feature_location'] + '</br><b>Site Name : </b>' + value.attributes['site_name']
							+ '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Report this bin</button></div>';
							}
						} 

						else {
							console.log('specifics.popupFields undefined. Value is:');
							console.log(value)
							//KS what will be default? maybe display all (do we need formatting?)
							//KS untill I update it for him, it will be for LB's form

							content = '<b>Asset ID</b> : ' + value.attributes['ASSET_ID'] + '</br><b>Location : </b>' + 
							value.attributes['feature_location'] + '</br><b>Site Name : </b>' + value.attributes['site_name']
							+ '</br></br><button id="" class="mapConfirm btn-continue" data-asset_id="">Report this bin</button></div>';
						}
					}

				});

				var newlayer = new GraphicsLayer();
				var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-blue.png', 64, 64);
				markerSymbol.setOffset(0, 32);
				var marker = new Graphic(centerpoint, markerSymbol);
				marker.setAttributes({"value1": '1', "value2": '2', "value3": '3'});
				newlayer.add(marker);
				newlayer.on('click', function(event) {
					console.log('newLayer.on > callInfoWindow');
					//if(popupOrZoomTo(esrimap, centerpoint)){
						callInfoWindow(content, marker, esrimap);
					//}
				});
				esrimap.addLayer(newlayer);
				console.log('Single after newLayer.on > callInfoWindow');
				//if(popupOrZoomTo(esrimap, centerpoint)){
					callInfoWindow(content, marker, esrimap);
				//}
		});
}    

function callInfoWindow(content, marker, map){
    console.log('content');
        console.log(content);

        if(content == null || content==''){
            if(specifics.defaultPopupContent){
			    content = specifics.defaultPopupContent;
			} else{
				content = '<u>Asset not found.</u></br></br><u>Make sure you do maximum zoom in and select the green circle</u>';
			}
        }

		var centerpoint = new Point(marker.geometry.x, marker.geometry.y, new esri.SpatialReference({wkid: 27700}));

		map.infoWindow.setTitle('');
		map.infoWindow.setContent(content);
		map.infoWindow.show(centerpoint);
		//esrimap.centerAndZoom(centerpoint, 18);
		drawAssetLayer();
}

function zoomChanged(evt){
	//drawAssetLayer();
	//console.log(evt)
	console.log('Zoom: '+evt.lod.level)
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
		    //console.log('zoom under default');
	    //KS zoom is at or more magnified than max level - so draw it
	        drawAssetLayer();
	    }else{
		    //console.log('zoom over default');
	        //KS remove assets if above extent - aesthetic only
	        esrimap.graphics.clear();
	    }
	}
	
}

function drawAssetLayer(){
    KDF.hideMessages();
    //console.log('draassetlayer');
    var xmaxE = esrimap.extent.xmax;
    var ymaxE = esrimap.extent.ymax;
    var xminE = esrimap.extent.xmin;
    var yminE = esrimap.extent.ymin;
    
    var eachPoints=[];
    
    var esriAssetUrl = getCommunalAssetURl() + '&geometry=%7B%22xmin%22%3A' + xminE + '%2C%22ymin%22%3A' + yminE + '%2C%22xmax%22%3A' + xmaxE + '%2C%22ymax%22%3A' + ymaxE + '%2C%22spatialReference%22%3A%7B%22wkid%22%3A27700%7D%7D';
    //console.log(esriAssetUrl)
    
    $.ajax({url: esriAssetUrl, dataType: 'jsonp', crossDomain: true
	}).done(function(response) {
	    
	    //console.log(response.features);
	    
	    $.each(response.features, function( key, value ) {
	        //console.log(value.geometry.x);
	        
	        eachPoints.push([value.geometry.x, value.geometry.y]);
	    });
	    
	    require([ "esri/symbols/SimpleMarkerSymbol", "esri/graphic", "esri/Color", "dojo/domReady!" ],
        function(SimpleMarkerSymbol,  Graphic,  Color) {
    	     var points = {   
                "points": eachPoints,   
                "spatialReference": ({ "wkid": 27700 })  
              };  
              
              var redColor = Color.fromArray([0, 204, 153]);
              
              var multiPoints = new esri.geometry.Multipoint(points);  
              //var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-blue.png', 32, 32);
              //var binSymbol = new PictureMarkerSymbol('https://drive.google.com/file/d/1bOGzVEcTYVEIBvMDQ-N5-qnWJmDMCLVO/view?usp=sharing', 32, 32);
              //KS: Custom marker - if defined - use the object
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
		    
                //KS trying to fix the icon offset issue your having - was sms.setOffset(0, 32);
              sms.setOffset(0, 0);
              var graphic = new esri.Graphic(multiPoints, sms);  
              
              graphic.setAttributes({"title": ''});
              
              //console.log(graphic)
              if(graphic.geometry.points.length > 0){
                  //KS prevent error of adding graphic layer with no points
                  esrimap.graphics.add(graphic);
              }
              //esrimap.graphics.add(graphic);
              for (var i = 0; i < esrimap.graphics.graphics.length -1; i++){
                  //KS Remove all but last layer
                  //console.log(esrimap.graphics.graphics[i])
                  esrimap.graphics.remove(esrimap.graphics.graphics[i]);
              }
          
        });
          
	    //console.log(eachPoints);
	}).fail(function() {
	    KDF.showError('It looks like the connection to our mapping system has failed, please try to log the fault again');
	});	
}

$(document).on('change','#dform_widget_fault_reporting_search_results' , function() {
 
  var selectResult = $('select#dform_widget_fault_reporting_search_results option:checked').val();
  console.log(faultReportingSearchResults);
   if (selectResult !== "") {
          $.each(faultReportingSearchResults, function(
            key,
            faultReportingSearchResults
          ) {
            if (selectResult == faultReportingSearchResults.site_name) {
                
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
    
    clearPreviousLayer();
    showLoading();
            
	var newlayer = new GraphicsLayer();
	var xcoord = parseInt(globalX);
	var ycoord = parseInt(globalY);
	console.log('ini geometry x ' + xcoord);

	var url = 'https://edinburghcouncilmaps.info/locatorhub/arcgis/rest/services/CAG/ADDRESS/GeocodeServer/reverseGeocode?location=' + xcoord + '%2C+' + ycoord +'&distance=300&outSR=27700&f=json';
	console.log(url);

	$.ajax({url: url}).done(function(result) {
		streetAddress = result.address;
		console.log(result.address);

		hideLoading();
		console.log(streetAddress.Address);
		 var content = streetAddress.Address + '</br></br>'
		 + '<button id="" class="mapConfirm btn-continue" data-asset_id="">Confirm Location</button></div>' ;

		 var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));

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
          
	        });
	        
	        console.log(resultAssetArray);
	        
	          $.each(jQuery.parseJSON(response), function( key, value ) {
	             resultCount++;
	          });
	          
	          console.log(resultCount);
	          //console.log(resultAssetArray[value.Abbreviation].xmax);
	          
	          if(resultCount == 1){
	              console.log('haha');
	              $.each(resultAssetArray, function(key, resultAssetArray ) {
	                  console.log(resultAssetArray.xmax);
	                    centreOnEsriResult('', '', resultAssetArray.xmax, resultAssetArray.xmin, resultAssetArray.ymax, resultAssetArray.ymin, '', '');
	              });
	          } else {
	               $('label[for=dform_widget_fault_reporting_search_results]').html('<label for="dform_widget_fault_reporting_search_results">We have found more than one location that matches your search terms, select your desired result below:</label>');
	               $('#dform_widget_fault_reporting_search_results').append($('<option>', {value: 'Please select a location',text: 'Please select'}))
	               $.each(resultAssetArray, function(key, resultAssetArray2 ) {
	                   console.log(resultAssetArray2.site_name);
    		    	   $('#dform_widget_fault_reporting_search_results').append($('<option>', {value: resultAssetArray2.site_name,text: resultAssetArray2.site_name}))
    		        
    		           KDF.showWidget('fault_reporting_search_results');
	               });
	          }
	         
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
		var popCenterpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
		esrimap.infoWindow.setTitle('Please confirm street address.');
		esrimap.infoWindow.setContent(content);
		esrimap.infoWindow.show(popCenterpoint);
		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
		esrimap.centerAndZoom(centerpoint, 18);
	}
}
	
function showLoading(){
    console.log('call a')
	KDF.showWidget('ahtm_cool_loading_gif');
	changeAllLayersOpacity('0.2');
	esrimap.disableMapNavigation();
	esrimap.hideZoomSlider();
}

function hideLoading(error){
    console.log('call b')
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
		var centerpoint = new Point(xcoord, ycoord, new esri.SpatialReference({wkid: 27700}));
		esrimap.centerAndZoom(new Point(xcoord, ycoord), 20);
		var markerSymbol = new PictureMarkerSymbol('/dformresources/content/map-red.png', 64, 64);
		markerSymbol.setOffset(0, 32);
		var marker = new Graphic(centerpoint, markerSymbol);
		marker.setAttributes({"value1": '1', "value2": '2', "value3": '3'});
		newlayer.add(marker);
		esrimap.addLayer(newlayer);
    } else if (ymin!='') {
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

		var requestURL = mapGlobal.geometryServer+'/project?f=pjson&inSR='
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
			//convertLonLat([pos.coords.longitude, pos.coords.latitude],4326,mapGlobal.WKID,geolocateLogic)//callback function
			//KS revision to avoid ajax call (thanks jon) - still works should they want to use their own
			convertLonLat(
				[pos.coords.longitude, pos.coords.latitude],
				{WKID:mapGlobal.geolocateWKID, projection:mapGlobal.geolocateWKIDProj4, type:'Proj4'},
				{WKID:mapGlobal.WKID, projection:mapGlobal.WKIDProj4, type:'Proj4'},
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
