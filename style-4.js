function toggleDebugStyle(){debugStyle = !debugStyle;} var debugStyle = false;
/*//KS: put in _KDF_ready - uses all the reccomended styles - can add optional
applyStyle(['recommended']);
//KS: see 'Non-recommended defaults' within 'defaultNewStyle(elements)' for optional defaults*/

function defineDefaultStyle(){
	//KS: can define listeners here, but can't later on, need to call 
    //KS: adds the recommended default styling - and acts a single location to change them
	//KS: for the love of StackExchange don't put 'all' or 'recommended' in here
    var recommended = [
        'mchk','chk','rad','txt','dt','eml','num','pas','tel','time','txta','sel','file','btn','search','highlightRequired','search-no-results','field-label-right-align','txta-length','txta-length-listener','detailToggle','noResultsFound','txt-enter-trigger-btn',
    ];
    if (debugStyle) console.debug('@defineDefaultStyle() the defined recommended styles that will be used ['+recommended.toString()+']')
    defaultNewStyle(recommended);
	//KS: trigger: '_style_defultsProvided, [arrayOfRecomendedStyles]'
	$(formName()).trigger('_style_defultsProvided',[recommended]);
}

function defaultNewStyle(elements){
    //KS: adds styling to elemnts in an inefficent mannor but without the need to access custom.css
    //KS: adds the classes that are used for styling as well as for indication where functionility should be added in applyNewStyle
    if (elements === null){
        return "Not valid - valid elements are ['mchk', 'chk', 'rad', 'txt', 'dt', 'eml', 'num', 'pas', 'tel', 'time', 'txta', 'sel', 'file', 'btn', 'txta-length','search','highlightRequired', 'file-progress',  'txt-no-min-height',  'sel-fill']";
    }
    if (elements == "all" || elements == "recommended"){
        //KS: adds the recommended default styling
        defineDefaultStyle();
        return;
    }else{
        /*TODO
        Add file-limt-#
        */
       elements.forEach(function(element){
	       var validStyle = true;
		switch(element){
		    case "all":
		    case"recommended":
			validStyle = false;
			defineDefaultStyle();
			break;
		    case "mchk":$("[data-type='multicheckbox']").addClass('mchk-gov');break;
		    case "chk":$("[data-type='checkbox']").addClass('chk-gov');break;
		    case "rad":$("[data-type='radio']").addClass('rad-gov');break;
		    case "txt":$("[data-type='text']").addClass('txt-gov');break;
		     case "dt":$("[data-type='date']").addClass('dt-gov');break;
		    case "eml":$("[data-type='email']").addClass('eml-gov');break;
		    case "num":$("[data-type='number']").addClass('num-gov');break;
		    case "pas":$("[data-type='password']").addClass('pas-gov');break;
		    case "tel":$("[data-type='tel']").addClass('tel-gov');break;
		    case "time":$("[data-type='time']").addClass('time-gov');break;
		    case "txta":$("[data-type='textarea']").addClass('txta-gov');break;
		    case "sel":$("[data-type='select']").addClass('sel-gov');break;
		    case "file":$("[data-type='file']").addClass('file-gov');break;
		    case "btn":$("[data-type='button']").addClass('btn-gov');break;
				case "search":$(".dform_widget_type_search").addClass('search-gov');break;

		    case "txta-length"://KS: allows optout of the maxchar feature as default
			$("[data-type='textarea'] > div:last-child").addClass('txta-length');        
			break;
		    case "highlightRequired"://KS: Ruths code to add required star
			highlightRequired();
			break;
		    case "field-label-right-align"://KS: huge selector used to 
			$(getFieldsLabels('left')).parent().parent().addClass('text-align-right');
			break;

			//KS: Non-recommended defaults below
		    case "sel-fill"://KS: mostly just an example of how to add optional default styles
			$("[data-type='select']").addClass('sel-fill');
			break;
		    case "file-progress"://KS: add back the progress bar
			$("[data-type='file']").addClass('file-progress');             
			break;
		    case "txt-no-min-height"://KS: bobs request to remove margin on hidden left feilds
			$("[data-type='text']").addClass('txt-no-min-height');             
			break;
		    case "field-mob"://KS: 
			$("[type='text'], [type='date'], [type='email'], [type='number'], [type='password'], [type='tel'], [type='time'], [type='textarea']").addClass('field-mob');
			break;
		    case "search-no-results":
			$('.dform_widget_type_search').addClass('search-no-results');
			break;

		    case "rad-margin-8":$("[data-type='radio']").addClass(          'rad-margin-8'  );break;
		    case "mchk-margin-8":$("[data-type='multicheckbox']").addClass( 'mchk-margin-8' );break;
		    case "btn-margin-8":$(".dform_widget_type_button").addClass(    'btn-margin-8'  );break;
		    case "rad-margin-16":$("[data-type='radio']").addClass(         'rad-margin-16' );break;
		    case "mchk-margin-16":$("[data-type='multicheckbox']").addClass('mchk-margin-16');break;
		    case "btn-margin-16":$(".dform_widget_type_button").addClass(   'btn-margin-16' );break;
		    case "rad-margin-25":$("[data-type='radio']").addClass(         'rad-margin-25' );break;
		    case "mchk-margin-25":$("[data-type='multicheckbox']").addClass('mchk-margin-25');break;
		    case "btn-margin-25":$(".dform_widget_type_button").addClass(   'btn-margin-25' );break;
		    case "rad-margin-33":$("[data-type='radio']").addClass(         'rad-margin-33' );break;
		    case "mchk-margin-33":$("[data-type='multicheckbox']").addClass('mchk-margin-33');break;
		    case "btn-margin-33":$(".dform_widget_type_button").addClass(   'btn-margin-33' );break;
		    case "rad-margin-41":$("[data-type='radio']").addClass(         'rad-margin-41' );break;
		    case "mchk-margin-41":$("[data-type='multicheckbox']").addClass('mchk-margin-41');break;
		    case "btn-margin-41":$(".dform_widget_type_button").addClass(   'btn-margin-41' );break;
		    case "rad-margin-50":$("[data-type='radio']").addClass(         'rad-margin-50' );break;
		    case "mchk-margin-50":$("[data-type='multicheckbox']").addClass('mchk-margin-50');break;
		    case "btn-margin-50":$(".dform_widget_type_button").addClass(   'btn-margin-50' );break;
		    case "rad-margin-58":$("[data-type='radio']").addClass(         'rad-margin-58' );break;
		    case "mchk-margin-58":$("[data-type='multicheckbox']").addClass('mchk-margin-58');break;
		    case "btn-margin-58":$(".dform_widget_type_button").addClass(   'btn-margin-58' );break;
		    case "rad-margin-66":$("[data-type='radio']").addClass(         'rad-margin-66' );break;
		    case "mchk-margin-66":$("[data-type='multicheckbox']").addClass('mchk-margin-66');break;
		    case "btn-margin-66":$(".dform_widget_type_button").addClass(   'btn-margin-66' );break;
		    case "rad-margin-75":$("[data-type='radio']").addClass(         'rad-margin-75' );break;
		    case "mchk-margin-75":$("[data-type='multicheckbox']").addClass('mchk-margin-75');break;
		    case "btn-margin-75":$(".dform_widget_type_button").addClass(   'btn-margin-75' );break;
		    case "rad-margin-83":$("[data-type='radio']").addClass(         'rad-margin-83' );break;
		    case "mchk-margin-83":$("[data-type='multicheckbox']").addClass('mchk-margin-83');break;
		    case "btn-margin-83":$(".dform_widget_type_button").addClass(   'btn-margin-83' );break;
		    case "rad-margin-91":$("[data-type='radio']").addClass(         'rad-margin-91' );break;
		    case "mchk-margin-91":$("[data-type='multicheckbox']").addClass('mchk-margin-91');break;
		    case "btn-margin-91":$(".dform_widget_type_button").addClass(   'btn-margin-91' );break;

		    case "field-text-align-left":
			$("[type='text'], [type='date'], [type='email'], [type='number'], [type='password'], [type='tel'], [type='time']").addClass('text-align-left');
			break;
		    case "rad-text-align-left":
			$("[data-type='multicheckbox']").addClass('text-align-left');
			break;
		    case "mchk-text-align-left":
			$("[data-type='radio']").addClass('text-align-left');   
			break;
		    case "field-text-align-center":
			$("[type='text'], [type='date'], [type='email'], [type='number'], [type='password'], [type='tel'], [type='time']").addClass('text-align-center');
			break;    
		    case "rad-text-align-center":
			$("[data-type='multicheckbox']").addClass('text-align-center');
			break;
		    case "mchk-text-align-center":
			$("[data-type='radio']").addClass('text-align-center');   
			break;
		    case "rad-text-align-right":
			$("[data-type='multicheckbox']").addClass('text-align-right');
			break;
		    case "mchk-text-align-right":
			$("[data-type='radio']").addClass('text-align-right');   
			break;
		    case "field-text-align-right":
			$("[data-type='text'], [data-type='date'], [data-type='email'], [data-type='number'], [data-type='password'], [data-type='tel'], [data-type='time']").addClass('text-align-right');
			break;
				//KS: LISTENERS - if after _KDF_ready, apply them with addStyleListeners(['a_listenerFunctions_property','it_supports_lists'])
		    case'txta-length-listener':
			listenerFunctions['txta-length-listener']();
			break;
		    case'detailToggle':
			listenerFunctions['detailToggle']();
			break;
		    case'noResultsFound':
			listenerFunctions['noResultsFound']();
			break;
		    case'txt-enter-trigger-btn':
			listenerFunctions['txt-enter-trigger-btn']();
			break;
		    default:
			validStyle = false;
		}
		if (validStyle){
			//KS: trigger: '_style_classOfOptionAdded, [optionName]'
			$(formName()).trigger('_style_classOfOptionAdded',[element]);  
	       }
	       	
    	});
    }
}
function applyNewStyle(){
    //KS: since there is no overloading in JS - this is an alternitive
	var hasDefaultsInArguments = (typeof arguments[0] !== "undefined" && Array.isArray(arguments[0]));
    if (hasDefaultsInArguments){
	if (debugStyle) console.debug('@applyNewStyle() since this was passed an array, will call defaultNewStyle() to add classes to relevent objects before continuing');
        //KS: i.e. if there is an array
        defaultNewStyle(arguments[0])
    }
    //KS: code for controlling what gets updated
    //KS: it's the JQuery selector then the function name from updateStyleFunctions that should be applied 
    //KS:- if there is no function name the it presumes the function name is the selector excluding the first (.)
    var elementsToUpdate = [
        //KS: single class name
        ['.rad-gov'], ['.chk-gov'], ['.mchk-gov'], ['.warning-notice'], ['.info-notice'], ['.txta-gov'], ['.file-gov'], ['.search-gov'], ['.detail-gov'], ['.search-no-results'], ['.required-notice'],
        //KS: grouped class names
        ['.file-gov[class*="file-limit-"]','file-limit'],
        ['[data-type="text"] div:first-child .dform_hidden','txt-hidden'],
        ['.mchk-gov[class*="mchk-margin-"]','mchk-margin'],
        ['.rad-gov[class*="rad-margin-"]','rad-margin'],
    ];
    if (debugStyle) console.debug('@applyNewStyle() the list classes used as the selector and the name of the function are: '+JSON.stringify(elementsToUpdate))
    elementsToUpdate.forEach(function(item){
        var elements = $(item[0]);
        if (elements.length > 0){//KS: skip if none selected - improve performance
            if (item.length == 1){//KS: presumed the selector is the function name (with first '.' removed)
                updateStyle(elements, item[0].replace('.', ''));
            }else{//KS: the selector 
                updateStyle(elements, item[1]);
            }
        }
    });
	//KS: trigger: '_style_styleApplied, [elementSelectorsUsed, hadDefaultsInArray]'
	$(formName()).trigger('_style_styleApplied',[elementsToUpdate, (hasDefaultsInArguments) ? arguments[0] : false]);
}


function applyNewerStyle(elements){updateStyle(elements);}//KS: backwards compatability
function updateStyle(elements, optionalName){
    //KS: used to apply the JS side of the new styles to elements
    //KS: call directly after _KDF_ready if you need to add the style JS to a new/chnaged element (like after adding a check in a rad)
    $.each(elements, function(){
        individualApplyStyle($(this), optionalName);
    });
	//KS: trigger: '_style_updateStyleDone, [elements, optionalName]'
	$(formName()).trigger('_style_updateStyleDone',[elements, optionalName]);
}
//KS: defined as functions within array to make it reusable and easy to expand
var updateStyleFunctions = {
	'mchk-gov': function(element){
		var el = element.find('> div > fieldset > span').not(":has(span)");
        el.append('<span class="mchk-check"></span>');
	},
	'rad-gov': function(element){
		var el = element.find('> div > fieldset > span').not(":has(span)");
        el.append('<span class="rad-check"></span>');
	},
	'warning-notice': function(element){
		var el = element.not(":has(.warning-notice-icon-a)");
        el.append('<span class="warning-notice-icon"><span class="warning-notice-icon-a"></span><span class="warning-notice-icon-b"></span><span class="warning-notice-icon-c"></span></span>');
	},
	'info-notice': function(element){
		var el = element.not(":has(.info-notice-icon-a)");
        el.append('<span class="info-notice-icon"><span class="info-notice-icon-a"></span><span class="info-notice-icon-b"></span><span class="info-notice-icon-c"></span></span>');
	},
	'txta-gov': function(element){
		var el = element.find('> div:last-child').not(":has(.txta-length-message)");
        el.append('<div class="txta-length-message"></div>');
	},
	'search-gov': function(element){
		element.find('.dform_widget_searchfield').addClass('txt-gov');
        element.find('button').addClass('btn-gov');
	},
	'chk-gov': function(element){
		var el = element.find('> div').not(":has(span)");
        el.append('<span class="chk-check"></span>');
        el.find(".helptext").insertAfter(element.find("label"));
	},
	'file-gov': function(element){
		$("[type='file']").attr('title', 'File upload');//KS: avoid WCAG error
		element.find('> div > label').removeAttr("for");//KS: prevent legend from beinbg clickable
        var el = element.find('input').not(":has(.file-gov-icon-a)");
        el.after('<span class="file-gov-icon"><span class="file-gov-icon-a"></span><span class="file-gov-icon-b"></span><label class="file-gov-text">Select Files...</label></span>');
        el.parent().css('position', 'relative');
        el.find("input").insertAfter(el.find(".file-gov-icon"));
		//KS if element selector is used, then it won't update elements that already have be updated
        element.find('.helptext').each(function(){
            //KS: used to rearrange elements
            $(this).insertAfter($(this).parent().find(".file-gov-icon"));
        });
	},
	'detail-gov': function(element){
		element.find('> p:first-child').each(function(){
                $(this).text("►"+$(this).text());
                $(this).wrap('<button class="detail-title btn-link"></button>');
                $(this).contents().unwrap();
        });
        element.each(function(){
            $(this).children(':not(button)').wrapAll('<div class="detail-block"></div>');
        });
	},
	'required-notice': function(element){
		var requiredMessage = 'Required fields will be marked with an asterisk*';
		var classStyle = 'paragraph-medium';//KS: better of as class - but needs implemented quickly
		element.prepend("<p>"+requiredMessage+"</p>");
		updateStyle(element.addClass('info-notice width-fit-content'), 'info-notice');
		element.find('p, li').addClass(classStyle);
	},
	'file-limit': function(element){//KS: need to test what happens if over limit when it's applied
    	var classes = element.attr('class').split(/\s+/);
    	var hasClass = false;
    	for (var i = 0; i < classes.length; i++){
    		if (classes[i].startsWith('file-limit-')){
    			hasClass=classes[i];
    		}
    	}
    	if (hasClass){//KS: get the number
    		var number = hasClass.substring(11, hasClass.length);
    		number = parseInt(number,10);
    		if (!(Number.isInteger(number) && number > 0 && number < 32)){
    		    //Error - assume default of 3
    			number = 3;
    		}
    		element.find('.file-gov-text').text('Select up to '+number+' files');
    		element.find('.dform_filenames').off('DOMNodeInserted DOMNodeRemoved').on('DOMNodeInserted DOMNodeRemoved', function(event) {
    			if (event.type == 'DOMNodeInserted'){//KS: adding a file
    				var current = $(this).children('span').length;
    				if(current >= number){//KS: Can't add more
    					$(this).parent().find('input').addClass('visibility-hidden');
    					$(this).parent().find('.file-gov-text').text('Storage Full');
    				}else{//KS: Can add more
    					$(this).parent().find('.file-gov-text').text('Select up to '+(number-current)+' more');
    				}
    			} else {//KS: removing a file
    				$(this).parent().find('input').removeClass('visibility-hidden');
    				$(this).parent().find('.file-gov-text').text('Select up to '+number+' files');
    			}
    		});
    	}else{
    		if (debugStyle) console.debug("A file limit couldn't be applied to an element because it didn't have a file-limit-[number] style ")
    	}
    },
	'search-no-results': function(element){//KS: param object op
        element.find('select').css('margin-right','0.25rem')
		var el = element.find('.dform_widget_search_closeresults');/*.not(":has(.btn-continue)");*/
		el.addClass('btn-continue');
		el.text('Search again');
	},
	'txt-hidden': function(element){
	    element.parent().addClass('txt-hidden');
	},
	'rad-margin': function(element){//KS: need to test what happens if over limit when it's applied
	    //KS: change for a reusable function like: function getClassNumberWhenInRange(element, startsWith, [minNmber, maxNumber])
    	var classes = element.attr('class').split(/\s+/);
    	var hasClass = false;
    	var startString = 'rad-margin-';
    	for (var i = 0; i < classes.length; i++){
    		if (classes[i].startsWith(startString)){
    			hasClass=classes[i];
    		}
    	}
    	if (hasClass){//KS: get the number
    		var number = hasClass.substring(startString.length, hasClass.length);
    		number = parseInt(number,10);
    		if (Number.isInteger(number) && number >= 0 && number <= 100){//KS: since it is %, unlikely to go over
				marginArrange(element.find('legend'), 'rad-margin-'+number+'-legend');
			}else{
    		    if (debugStyle) console.debug(hasClass + 'is not a valid rad-margin, try rad-margin-50');
    		}
    	}else{
    	    if (debugStyle) console.debug('Could not add rad-margin to element. Try adding the class rad-margin-# (e.g. rad-margin-50) first')
    	}
	},
	'mchk-margin': function(element){//KS: need to test what happens if over limit when it's applied
	    //KS: change for a reusable function like: function getClassNumberWhenInRange(element, startsWith, [minNmber, maxNumber])
    	var classes = element.attr('class').split(/\s+/);
    	var hasClass = false;
    	var startString = 'mchk-margin-';
    	for (var i = 0; i < classes.length; i++){
    		if (classes[i].startsWith(startString)){
    			hasClass=classes[i];
    		}
    	}
    	if (hasClass){//KS: get the number
    		var number = hasClass.substring(startString.length, hasClass.length);
    		number = parseInt(number,10);
    		if (Number.isInteger(number) && number >= 0 && number <= 100){//KS: since it is %, unlikely to go over
				marginArrange(element.find('legend'), 'mchk-margin-'+number+'-legend');
    		}else{
    		    if (debugStyle) console.debug(hasClass + 'is not a valid mchk-margin, try mchk-margin-50');
    		}
    	}else{
    	    if (debugStyle) console.debug('Could not add mchk-margin to element. Try adding the class mchk-margin-# (e.g. mchk-margin-50) first')
    	}
	},
}

function individualApplyStyle(element, specificVal){
	//KS: used to update elements that have be edited and require their JS functionility updated/refreshed
    //KS: i.e. this is for JS functionility after _KDF_ready
	if (specificVal !== null){//KS: when provided with a style name
		if(updateStyleFunctions[specificVal] != undefined){//KS: update style when valid
			updateStyleFunctions[specificVal](element);
			//KS: trigger: '_style_elementUpdated, [element, source, functionUsed, wasSpecified]'
			$(formName()).trigger('_style_elementUpdated',[element, specificVal, true]);
		}else{//KS: can't find style - tell them so within collapsable group
			if (debugStyle) console.debug('Style not updated - style name was '+specificVal+' and element was:');
			if (debugStyle) console.debug(element);
			if (debugStyle) console.debug('Try a valid name from "updateStyleFunctions" or try it without a name for default functionility');
		}
	}else{//KS: DEFAULTS when no style name is provided, attempt to apply one based on class
		//KS: use the first style that it tests true for (so order matters)
		var testableClasses = [
			//KS: if tests true for a class name matching the testableClasses[i][0], use the update function found in testableClasses[i][1]
			//KS, seems redundant right now, but being able to use diffrent class or use something like ['margin',function(element.marginSize){switch(this)...return value}]
			//KS, will be useful in future for polymorphism
			['mchk-gov','mchk-gov'], ['rad-gov','rad-gov'], ['warning-notice','warning-notice'], ['info-notice','info-notice'],
			['search-gov','search-gov'], ['txta-gov','txta-gov'], ['chk-gov','chk-gov'], ['file-gov','file-gov'], ['detail-gov','detail-gov'],
		];
		var hasAddedStyle = false;
		for (var i = 0; i < testableClasses.length; i++){
			if (element.hasClass(testableClasses[i][0])){
				updateStyleFunctions[testableClasses[i][1]](element);
				hasAddedStyle = true;
				//KS: trigger: '_style_elementUpdated, [element, source, functionUsed, wasSpecified]'
				$(formName()).trigger('_style_elementUpdated',[element, testableClasses[i][1], false]);
				break;
			}
		}
		if (!hasAddedStyle) {//KS: just a log to update them that something went wrong
			if (debugStyle) console.debug('No name provided, and failed class checks. Element was:');
			if (debugStyle) console.debug(element);
			if (debugStyle) console.debug('Try a valid name from "updateStyleFunctions" as the second param to specify type of update');
		}
	}
}

function addStyleListeners(listenerNameArray){
    listenerNameArray.forEach(function(listenerName){
        listenerFunctions[listenerName]();
    });
	//KS: trigger: '_style_allListenersAdded, [listenerNameArray]'
	$(formName()).trigger('_style_allListenersAdded',[listenerNameArray]);	
}
var listenerFunctions = {
	'txta-length-listener':function(){
		$(formName()).on('input', '.txta-gov textarea',txtaLength);
		
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['txta-length-listener']);	
	},
	'detailToggle':function(){
		$(formName()).on('click', '.detail-title',detailToggle);
		
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['detailToggle']);	
	},
	'noResultsFound':function(){
		$(formName()).off('_KDF_search').on('_KDF_search', function(event, kdf, response, type, name) {
			//KS: call noResultsFound with 'this' set to the search element that triggered the event
			noResultsFound.call($('[name="'+name+'_id"]'))
		});
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['noResultsFound']);	
	},
	'txt-enter-trigger-btn':function(){
		console.log('txt-enter-trigger-btn called - disabled for testing')
		$(formName()).on('keypress','.search-gov [type="text"], .txt-enter-trigger-btn [type="text"]',function() {
			if (event.keyCode == 13) {
				$(this).parent().parent().parent().find('[type="button"]').trigger('click');
			}
		});
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['txt-enter-trigger-btn']);	
	},
}


function formName(){
	//KS: I want triggers to work same way as api.js, so need this to get name
	if (KDF.kdf().name){
		return '#dform_'+KDF.kdf().name;
	}else{
		//KS: just incase, this will work in most cases (it's what was used before)
		if (debugStyle) console.debug('kdf name undefined - using #dform_container')
		return '#dform_container';
	}
}
function txtaLength(){
    //KS: updates the chars left box for txta-length styled elements
    //    used as the function in the textarea input 
    var maxLength = $(this).attr('maxlength');
    if (maxLength !== undefined && maxLength !== 0){
        var currentLength = $(this).val().length;
        //KS: won't show up if there isnt a limit
        var message = $(this).parent().find("> .txta-length-message");
        if (currentLength >= maxLength){
            message.html("You have ran out of characters")
        }else{
            message.html((maxLength-currentLength)+" characters left")
        }
    }
	//KS: trigger: '_style_lengthChanged, [element, messageElement, canAddMore, maxLength, currentLength]'
	$(formName()).trigger('_style_lengthChanged',[$(this), message, (currentLength >= maxLength) ? true : false ,maxLength, currentLength]);
}
	
function detailToggle(){
	var prefix = {'closed':'►', 'opened':'▼'};
	var open;
    //KS: this expands/collapses the detail tab and chnages the indicator
    //    the indictor is an array in which the collapsed indicor is first and the expanded indicator is second
    //KS: update to use value of attributes like closedChar='►' openedChar='▼' - ensures uses defined chars
    if($(this).text().indexOf(prefix.closed) >= 0){
        $(this).text($(this).text().replace(new RegExp(prefix.closed,'g'), prefix.opened))
        $(this).siblings('.detail-block').addClass("detail-block-visible");
		open = true;
    } else {
        $(this).text($(this).text().replace(new RegExp(prefix.opened,'g'), prefix.closed))
        $(this).siblings('.detail-block').removeClass("detail-block-visible");
		open = false;
    }
	//KS: trigger: '_style_detailToggled, [element, isExpanded, stringPrefixWhenOpen, stringPrefixWhenClosed]'
	$(formName()).trigger('_style_detailToggled',[$(this), open, prefix.opened, prefix.closed]);
}

function noResultsFound(){
    //KS: when there is no results, add a non-selectable option to say such
	var text = 'No results found';
    if ($(this).children().length < 1){
        $(this).html('<option hidden>'+text+'</option>')
    }
	//KS: trigger: '_style_noSearchResults, [element, noResultText]'
	$(formName()).trigger('_style_detailToggled',[$(this), text]);
}


function regexSearch(regex){
    //KS E.G.: regexSearch("[0-9A-Za-z ]{3,}")
	var elements = $(".search-gov input:text, .apply-regex, #dform_widget_txt_postcode");
	elements.attr('pattern',regex);
	
	//KS: trigger: '_style_regexApplied, [elements, regex]'
	$(formName()).trigger('_style_regexApplied',[elements, regex]);
}
function marginRevertArrange(element){
	//KS: coded so the hidden, origianl label doesn't have the class, so just need to remove element
	//KS 'element' should be the rad/mchk element as jquery object (supports multiple at once) e.g. $('.rad-gov,.mack-gov') is everything
	element.find('> legend').remove();
	element.find('fieldset legend').removeClass('display-none');
	element.removeClass(function(index, className){
		//KS: removes mchk-margin-* and rad-margin-* classes. Update if names change or include another '|' if more is added
		return (className.match (/\b(mchk-margin-|rad-margin-)\S+/g) || []).join(' ');
	});
	
	//KS: trigger: '_style_marginReverted, [element]'
	$(formName()).trigger('_style_marginReverted',[element]);
}

function marginArrange(legend, style){
	//KS: should be passed the style and legend (eg $('.rad-margin-50 legend').each(function(){marginArrange($(this),'rad-margin--50')});)
	legend.clone().addClass(style).insertBefore(legend.parent().parent());
	legend.addClass('display-none');
	
	//KS: trigger: '_style_marginAdded, [legend, style]'
	$(formName()).trigger('_style_marginAdded',[legend, style]);	
}
function paramElementChange(possibleToChange){
    //KS: possibleToChange is an array of element names which can set to values from the params
    var params = KDF.getParams();
    var defaultParams = ['wss', 'lwssinline', 'token'];
    if (params.wss == 'true'){
        $.each( params, function( key, value ) {
            if (possibleToChange.includes(key) && !defaultParams.includes(defaultParams)){
                KDF.setVal(key, value);
                if (debugStyle) console.debug('wss loaded element '+key+' with '+value);
                //KS: Really should include trigger - NEED TO BIND AT START - DO IN FUNCTION LATER
                $(formName()).trigger('_style_paramElementChanged',[key, value]);
            }
        });
    }
}

//source: https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
//KS used to get an idea of the colour contrast, but would need an entire libary to do it to the extent I'd need
function luminanace(r, g, b) {var a = [r, g, b].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055) / 1.055, 2.4 ); }); return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722; }
function contrast(rgb1, rgb2) { return (luminanace(rgb1['r'], rgb1['g'], rgb1['b']) + 0.05) / (luminanace(rgb2['r'], rgb2['g'], rgb2['b']) + 0.05); }
function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
function hexToRgb(hex) { var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16),b: parseInt(result[3], 16)} : null; }


function simpleColorCheck(bgColor, fgIfWhite, fgIfNot){
    //KS: if white, use a non-white colour, if non-white use white
	if (bgColor == undefined) bgColor = 'white';//KS Fixes when text hidden
    var whiteDef = ['rgba(0, 0, 0, 0)', 'rgb(0, 0, 0)', 'white', '#fff', '#ffffff'];
    if ($.inArray(bgColor.toLowerCase(), whiteDef) != -1){
        return fgIfWhite;
    } else {
        return fgIfNot;
    }
	
}
function requiredColorCheck(jQueryObject){
    var color = simpleColorCheck(jQueryObject.css("background-color"),'#b03535', 'white');
	
	//KS: trigger: '_style_colorChecked, [element]'
	$(formName()).trigger('_style_colorChecked',[jQueryObject]);
	
    return color;
}

function highlightRequired() {
    //Finds the legend of required input elements and adds a red star to the end of them
	$(document).find(':required').each(function() {
	    if ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
	        var legend = $(this).parent().parent().find('legend');
	        
	        if ($(legend).find('span').size() <= 0) {
	                var obj1 = $(legend);
	                obj1.append('<span style="color: '+requiredColorCheck(obj1)+';">*</span>');
	        }
	    } else {
			
    		var label = $('label[for="'+$(this).attr('id')+'"]');
    		if ($(label).find('span').length === 0) {
    			var obj2 = $('label[for="'+$(this).attr('id')+'"]');
    			obj2.append('<span style="color: '+requiredColorCheck(obj2)+'; font-weight: bold;">*</span>');
    		}
	    }
	    //KS: added to cover single check box without messing with code too much
	    if($(this).attr('type') == 'checkbox' && $(this).parent().is("div")){
	        //KS: ensures that only single checkboxes have required *
	        var obj3 = $(this).parent().find('> label');
	        obj3.append('<span style="color: '+requiredColorCheck(obj3)+';">*</span>');
	    }
	});	
	$("[data-type='search'][data-required='true'] > legend").each(function(){
	    //Code for all searches
	    if ($(this).find('span').size() <= 0) {
	        var obj4 = $(this);
	        obj4.append('<span style="color: '+requiredColorCheck(obj4)+';">*</span>');
	    }
	});
	//KS: trigger: '_style_highlightRequired, []'
	$(formName()).trigger('_style_highlightRequired',[]);
}

function getFieldsLabels(isPosLeft){
	//KS: to get the labels when called like $(getFieldsLabels(value))
	var selector = '';
	//KS: all feilds that can have a left/above label
	var elements = ['.txt-gov','.dt-gov','.eml-gov','.num-gov','.pas-gov','.tel-gov','.time-gov','.field-gov','.txta-gov'];
	
	if (isPosLeft && isPosLeft != 'above'){
		if (debugStyle) console.debug('@getFieldsLabels() a selector for elements with a label to the left is being generated. The elements being considered are: '+JSON.stringify(elements));
		//KS: returns all fields that are to the left of teh input
		//KS: columns are used to display them on same line, and is the only way to identify them from above-labels
		var columns = ['.one','.two','.three','.four','.five','.six','.seven','.eight','.nine','.ten','.eleven','.twelve']
		
		for (var i = 0; i < elements.length; i++){
			for (var j = 0; j < columns.length; j++){
				selector += ', '+elements[i]+':not(.dform_widget_searchfield) > div:first-child'+columns[j]+' label';
				//KS the :not is only there due to the bug in displaying text fields in search widgets
			}
		}
		//KS: CSS note, if you use this, make sure you have a media query set up for the changing sizes
		//KS; - else if it changes to label-above at a certain width, then it will look messed up
	}else{
		if (debugStyle) console.debug('@getFieldsLabels() a selector for elements with a label above is being generated. The elements being considered are: '+JSON.stringify(elements))
		//KS: returns all field labels that are above text field
		for (var i = 0; i < elements.length; i++){
			selector += ', '+elements[i]+' > div:first-child:not(.one,.two,.three,.four,.five,.six,.seven,.eight,.nine,.ten,.eleven,.twelve) label'
		}
	}
	selector = selector.substring(2,selector.length);//KS: remove first ', '
	return selector;
}


