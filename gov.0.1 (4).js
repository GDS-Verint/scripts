/*//KS: put in _KDF_ready
defaultNewStyle(["all"]);//KS: see 'Non-recommended defaults' within 'defaultNewStyle(elements)' for optional defaults
applyNewStyle();*/

function highlightRequired() {
    //Finds the legend of required input elements and adds a red star to the end of them
	$(document).find(':required').each(function() {
	    if ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
	        var legend = $(this).parent().parent().find('legend');
	        
	        if ($(legend).find('span').size() <= 0) {
	                $(legend).append('<span style="color: #b03535;"> *</span>');
	        }
	    } else {
			
    		var label = $('label[for="'+$(this).attr('id')+'"]');
    		if ($(label).find('span').length === 0) {
    			$('label[for="'+$(this).attr('id')+'"]').append('<span style="color: #b03535; font-weight: bold;">*</span>');
    		}
	    }
	    //KS: added to cover single check box without messing with code too much
	    if($(this).attr('type') == 'checkbox' && $(this).parent().is("div")){
	        //KS: ensures that only single checkboxes have required *
	        $(this).parent().find('> label').append('<span style="color: #b03535;">*</span>');
	    }
	});	
	$("[data-type='search'][data-required='true'] > legend").each(function(){
	    //Code for all searches
	    if ($(this).find('span').size() <= 0) {
	        $(this).append('<span style="color: #b03535;">*</span>');
	    }
	});
}

function defineDefaultNewStyles(){
    //KS: adds the recommended default styling
    //KS: central place for changing default
    $("[data-type='multicheckbox']").addClass('mchk-gov');
    $("[data-type='checkbox']").addClass('chk-gov');
    $("[data-type='radio']").addClass('rad-gov');
    
    $("[data-type='text']").addClass('txt-gov');
    $("[data-type='date']").addClass('dt-gov');
    $("[data-type='email']").addClass('eml-gov');
    $("[data-type='number']").addClass('num-gov');
    $("[data-type='password']").addClass('pas-gov');
    $("[data-type='tel']").addClass('tel-gov');
    $("[data-type='time']").addClass('time-gov');
    
    $("[data-type='textarea']").addClass('txta-gov');
    $("[data-type='select']").addClass('sel-gov');
    $("[data-type='file']").addClass('file-gov');
    $("[data-type='button']").addClass('btn-gov');
    
    $(".dform_widget_type_search").addClass('search-gov');
    highlightRequired();
}
function defaultNewStyle(elements){
    //KS: adds styling to elemnts in an inefficent mannor but without the need to access custom.css
    //KS: feature call is defaultNewStyle(["mchk","chk","rad","txt","txta","sel","file","btn","txta-length"]) - emiminate where required
    //KS: shorthand for all is defaultNewStyle("all")
    if (elements === null){
        return "Not valid - valid elements are ['mchk', 'chk', 'rad', 'txt', 'dt', 'eml', 'num', 'pas', 'tel', 'time', 'txta', 'sel', 'file', 'btn', 'txta-length','search','highlightRequired', 'file-progress',  'txt-no-min-height',  'sel-fill']";
    }
    if (elements == "all"){
        //KS: adds the recommended default styling
        defineDefaultNewStyles();
        return;
    }else{
       elements.forEach(function(element){
        switch(element){
            case "all":
                defineDefaultNewStyles();
                break;
            case "mchk":
                $("[data-type='multicheckbox']").addClass('mchk-gov');    
                break;
            case "chk":
                $("[data-type='checkbox']").addClass('chk-gov');          
                break;
            case "rad":
                $("[data-type='radio']").addClass('rad-gov');             
                break;
            case "txt":
                $("[data-type='text']").addClass('txt-gov');              
                break;
             case "dt":
                $("[data-type='date']").addClass('dt-gov');              
                break;
            case "eml":
                $("[data-type='email']").addClass('eml-gov');              
                break;
            case "num":
                $("[data-type='number']").addClass('num-gov');              
                break;
            case "pas":
                $("[data-type='password']").addClass('pas-gov');              
                break;
            case "tel":
                $("[data-type='tel']").addClass('tel-gov');              
                break;
            case "time":
                $("[data-type='time']").addClass('time-gov');              
                break;
            case "txta":
                $("[data-type='textarea']").addClass('txta-gov');         
                break;
            case "sel":
                $("[data-type='select']").addClass('sel-gov');            
                break;
            case "file":
                $("[data-type='file']").addClass('file-gov');             
                break;
            case "btn":
                $("[data-type='button']").addClass('btn-gov');            
                break;
            case "txta-length"://KS: allows optout of the maxchar feature as default
                $("[data-type='textarea'] > div:last-child").addClass('txta-length');        
                break;
            case "highlightRequired"://KS: Ruths code to add required star
                highlightRequired();
                break;
            case "search":
                $(".dform_widget_type_search").addClass('search-gov');
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
                $("[type='text'], [type='date'], [type='email'], [type='number'], [type='password'], [type='tel'], [type='time']").addClass('field-mob');
                break;
            
            }
        }); 
    }
}

function applyNewStyle(){
    var rad = $('.rad-gov > div > fieldset > span').append('<span class="rad-check"></span>');
    var chk = $('.chk-gov > div').append('<span class="chk-check"></span>');
    var mchk = $('.mchk-gov > div > fieldset > span').append('<span class="mchk-check"></span>');
    var warning = $('.warning-notice').append('<span class="warning-notice-icon"><span class="warning-notice-icon-a"></span><span class="warning-notice-icon-b"></span><span class="warning-notice-icon-c"></span></span>');
    var info = $('.info-notice').append('<span class="info-notice-icon"><span class="info-notice-icon-a"></span><span class="info-notice-icon-b"></span><span class="info-notice-icon-c"></span></span>');
    var txta = $('.txta-gov > div:last-child').append('<div class="txta-length-message"></div>');//KS: remove to prevent char left 
    var file = $('.file-gov input');
    $("[data-type='text'] div:first-child .dform_hidden").parent().addClass("txt-hidden");
    
    //file.after(file.parent().find(".helptext"))
    file.after('<span class="file-gov-icon"><span class="file-gov-icon-a"></span><span class="file-gov-icon-b"></span><label class="file-gov-text">Select Files...</label></span>');
    file.parent().css('position', 'relative');
    
    $('.file-gov .helptext').each(function(){
        //KS: used to rearrange elements
        $(this).insertAfter($(this).parent().find(".file-gov-icon"));
    });
    
    $('.chk-gov .helptext').each(function(){
        //KS: used to rearrange elements
        $(this).insertAfter($(this).parent().find("label"));
    });
    
    
    $('.search-gov .dform_widget_searchfield').addClass('txt-gov');
    $('.search-gov button').addClass('btn-gov');
}

function applyNewerStyle(elements){
    //KS: used to apply the JS side of the new styles to elements after _KDF_ready
    //    should be called after chk, mchk, rad are updated - the rest is for completion sake
    //    can accecpt lists
    $.each(elements, function(){
        individualApplyNewStyle($(this))
    });
}
function individualApplyNewStyle(element){
    //KS: used to apply the JS side of the new styles to elements after _KDF_ready
    //    should be called after chk, mchk, rad are updated - the rest is for completion sake
    if (element.hasClass('chk-gov')){
        element.find('> div').append('<span class="chk-check"></span>');
        element.insertAfter(element.parent().find("label"));
    }else if (element.hasClass('mchk-gov')){
        element.find('> div > fieldset > span').append('<span class="mchk-check"></span>');
    }else if (element.hasClass('rad-gov')){
        element.find('> div > fieldset > span').append('<span class="rad-check"></span>');
    }else if (element.hasClass('warning-notice')){
        element.append('<span class="warning-notice-icon"><span class="warning-notice-icon-a"></span><span class="warning-notice-icon-b"></span><span class="warning-notice-icon-c"></span></span>');
    }else if (element.hasClass('info-notice')){
        element.append('<span class="info-notice-icon"><span class="info-notice-icon-a"></span><span class="info-notice-icon-b"></span><span class="info-notice-icon-c"></span></span>');
    }else if (element.hasClass('search-gov')){
        element.find('.dform_widget_searchfield').addClass('txt-gov');
        element.find('button').addClass('btn-gov');
    }else if (element.hasClass('file-gov')){
        element.find('input').after('<span class="file-gov-icon"><span class="file-gov-icon-a"></span><span class="file-gov-icon-b"></span><label class="file-gov-text">Select Files...</label></span>');
        element.parent().css('position', 'relative');
        element.insertAfter(element.parent().find(".file-gov-icon"));
    }else if (element.hasClass('txta-gov')){  
        element.find('> div:last-child').append('<div class="txta-length-message"></div>');
    }else{
        console.log("style wasn't applied to an element as it wasn't defined as restylable")
    }
}


function txtaLength(){
    //KS: updates the chars left box for txta-length styled elements
    //    used as the function in the textarea input 
    console.log("txta-length fire")
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
}
/*KS: due to the ''.txta-gov input' selector not working, this had to be used. Quite inefficent but also client side so impact is neglable*/
$(document).on('input', '.txta-gov textarea',txtaLength);