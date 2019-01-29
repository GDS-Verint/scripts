/*//KS: put in _KDF_ready
defaultNewStyle(["all"]);//KS: see 'Non-recommended defaults' within 'defaultNewStyle(elements)' for optional defaults
applyNewStyle();*/

function highlightRequired() {
    //Finds the legend of required input elements and adds a red star to the end of them
	$(document).find(':required').each(function() {
	    if ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
	        var legend = $(this).parent().parent().find('legend');
	        
	        if ($(legend).find('span').size() <= 0) {
	                $(legend).append('<span style="color: #b03535;">*</span>');
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
        /*TODO
        Add file-limt-#
        */
       elements.forEach(function(element){
        switch(element){
            case "all":
            case"recommended":
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
                
            case "detail-gov":
                
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
        } 
    });
}}
function applyNewStyle(){
    //KS: since there is no overloading in JS - this is an alternitive
    if (typeof arguments[0] !== "undefined" && Array.isArray(arguments[0])){
        //KS: i.e. if there is an array
        defaultNewStyle(arguments[0])
    }
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
	//KS: prevent WCAG error
    $("[type='file']").attr('title', 'File upload');
    $('.file-gov .helptext').each(function(){
        //KS: used to rearrange elements
        $(this).insertAfter($(this).parent().find(".file-gov-icon"));
    });
    //KS: prevent legend from beinbg clickable
    $('.file-gov > div > label').removeAttr("for");
    
    $('.chk-gov .helptext').each(function(){
        //KS: used to rearrange elements
        $(this).insertAfter($(this).parent().find("label"));
    });
    
    
    $('.search-gov .dform_widget_searchfield').addClass('txt-gov');
    $('.search-gov button').addClass('btn-gov');
    
    /*$('.mchk-margin').each()function(){
        //KS: used to move the legend in a easyer to work with place
        $(this).prepend($(this).find('legend').addClass('.mchk-margin-25'))
    };*/
    
    //if rad-no-margin mchk-no-margin .not(":has(.rad-no-margin)" ) .not(":has(.mchk-no-margin)")
    /*$('.mchk-margin-8' ).find('legend').addClass('mchk-margin--8' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-8'  ).find('legend').addClass('rad-margin--8'  ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-16').find('legend').addClass('mchk-margin--16').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-16' ).find('legend').addClass('rad-margin--16' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-25').find('legend').addClass('mchk-margin--25').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-25' ).find('legend').addClass('rad-margin--25' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-33').find('legend').addClass('mchk-margin--33').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-33' ).find('legend').addClass('rad-margin--33' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-41').find('legend').addClass('mchk-margin--41').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-41' ).find('legend').addClass('rad-margin--41' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-50').find('legend').addClass('mchk-margin--50').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-50' ).find('legend').addClass('rad-margin--50' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-58').find('legend').addClass('mchk-margin--58').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-58' ).find('legend').addClass('rad-margin--58' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-66').find('legend').addClass('mchk-margin--66').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-66' ).find('legend').addClass('rad-margin--66' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-75').find('legend').addClass('mchk-margin--75').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-75' ).find('legend').addClass('rad-margin--75' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-83').find('legend').addClass('mchk-margin--83').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-83' ).find('legend').addClass('rad-margin--83' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.mchk-margin-91').find('legend').addClass('mchk-margin--91').each(function(){$(this).insertBefore($(this).parent().parent());});
    $('.rad-margin-91' ).find('legend').addClass('rad-margin--91' ).each(function(){$(this).insertBefore($(this).parent().parent());});
    */
	$('.mchk-margin-8 legend').each(function(){marginArrange($(this),'mchk-margin--8')});
	$('.rad-margin-8 legend').each(function(){marginArrange($(this),'rad-margin--8')});
	$('.mchk-margin-16 legend').each(function(){marginArrange($(this),'mchk-margin--16')});
	$('.rad-margin-16 legend').each(function(){marginArrange($(this),'rad-margin--16')});
	$('.mchk-margin-25 legend').each(function(){marginArrange($(this),'mchk-margin--25')});
	$('.rad-margin-25 legend').each(function(){marginArrange($(this),'rad-margin--25')});
	$('.mchk-margin-33 legend').each(function(){marginArrange($(this),'mchk-margin--33')});
	$('.rad-margin-33 legend').each(function(){marginArrange($(this),'rad-margin--33')});
	$('.mchk-margin-41 legend').each(function(){marginArrange($(this),'mchk-margin--41')});
	$('.rad-margin-41 legend').each(function(){marginArrange($(this),'rad-margin--41')});
	$('.mchk-margin-50 legend').each(function(){marginArrange($(this),'mchk-margin--50')});
	$('.rad-margin-50 legend').each(function(){marginArrange($(this),'rad-margin--50')});
	$('.mchk-margin-58 legend').each(function(){marginArrange($(this),'mchk-margin--58')});
	$('.rad-margin-58 legend').each(function(){marginArrange($(this),'rad-margin--58')});
	$('.mchk-margin-66 legend').each(function(){marginArrange($(this),'mchk-margin--66')});
	$('.rad-margin-66 legend').each(function(){marginArrange($(this),'rad-margin--66')});
	$('.mchk-margin-75 legend').each(function(){marginArrange($(this),'mchk-margin--75')});
	$('.rad-margin-75 legend').each(function(){marginArrange($(this),'rad-margin--75')});
	$('.mchk-margin-83 legend').each(function(){marginArrange($(this),'mchk-margin--83')});
	$('.rad-margin-83 legend').each(function(){marginArrange($(this),'rad-margin--83')});
	$('.mchk-margin-91 legend').each(function(){marginArrange($(this),'mchk-margin--91')});
	$('.rad-margin-91 legend').each(function(){marginArrange($(this),'rad-margin--91')});
	
    
    //KS: makes detail
    $('.detail-gov > p:first-child').each(
        function(){
            $(this).text("►"+$(this).text());
            $(this).wrap('<a class="detail-title" href="#"></a>');
            $(this).contents().unwrap();
        }
    )
    $('.detail-gov').each(
        function(){
            //console.log($(this));
            $(this).children(':not(a)').wrapAll('<div class="detail-block"></div>');
            //$(this).find('> p').wrapAll('<div class="detail-block"></div>');
        }
    )
    $('.search-no-results .dform_widget_search_closeresults').addClass('btn-continue').addClass('search-no-results').text('Search again')
    
    
    $('.file-limit-1, .file-limit-2, .file-limit-3, .file-limit-4, .file-limit-5, .file-limit-6, .file-limit-7, .file-limit-8, .file-limit-9, .file-limit-10').each(
        function(){
            var fileLimit = 1;
            for(var i = 1; i < 10; i++){
                if ($(this).hasClass('file-limit-'+i)){
                    //KS: presumed lowest is one to be useder
                    fileLimit = i;
                    break;
                }
            }
            $(this).find('.file-gov-text').text('Select up to '+fileLimit+' files');
            $(this).find('.dform_filenames').bind('DOMNodeInserted DOMNodeRemoved', 
                function(event) {
                    if (event.type == 'DOMNodeInserted'){
                        //console.log('Second $this - would like to match');console.log($(this));
                        var current = $(this).children('span').length;
                        if(current >= fileLimit){
                            //console.log($(this).parent().find('input'))
                            $(this).parent().find('input').addClass('visibility-hidden');
                            
                            $(this).parent().find('.file-gov-text').text('Storage Full');
                        }else{
                            //KS: TODO update images left
                            console.log($(this))
                            $(this).parent().find('.file-gov-text').text('Select up to '+fileLimit+' files');
                        }
                    } else {
                        //KS: presume this is removing a file
                        $(this).parent().find('input').removeClass('visibility-hidden');
                        $(this).parent().find('.file-gov-text').text('Select up to '+fileLimit+' files');
                        //console.log('KS: TODO remove code to prevent adding mre files')
                    }
                }
            );
        }
    );
    //KS: adds the listeners after content has been finalized
    addStartupListeners()
}


function applyNewerStyle(elements){updateStyle(elements);}//KS: backwards compatability
function updateStyle(elements){
    //KS: used to apply the JS side of the new styles to elements after _KDF_ready
    //    should be called after chk, mchk, rad are updated - the rest is for completion sake
    //    can accecpt lists
    $.each(elements, function(){
        individualApplyStyle($(this))
    });
}
function individualApplyStyle(element){
    /*TODO
    Add file-limt-#
    */
    //KS: used to apply the JS side of the new styles to elements after _KDF_ready
    //    should be called after chk, mchk, rad are updated - the rest is for completion sake
    
    
    if (element.hasClass('mchk-gov')){
        
        //KS: I don't know how it handels multiple updated styles - to be safe call it how many styles are added
        var el = element.find('> div > fieldset > span').not(":has(span)");
        el.append('<span class="mchk-check"></span>');
        
        //TODO add queue based approch to allow multiple classes on one element
        
    }else if (element.hasClass('rad-gov')){
        
        //KS: I don't know how it handels multiple updated styles - to be safe call it how many styles are added
        var el = element.find('> div > fieldset > span').not(":has(span)");
        el.append('<span class="rad-check"></span>');
        
        //TODO add queue based approch to allow multiple classes on one element
    
    }else if (element.hasClass('warning-notice')){
        var el = element.not(":has(.warning-notice-icon-a)");
        el.append('<span class="warning-notice-icon"><span class="warning-notice-icon-a"></span><span class="warning-notice-icon-b"></span><span class="warning-notice-icon-c"></span></span>');
    }else if (element.hasClass('info-notice')){
        var el = element.not(":has(.info-notice-icon-a)");
        el.append('<span class="info-notice-icon"><span class="info-notice-icon-a"></span><span class="info-notice-icon-b"></span><span class="info-notice-icon-c"></span></span>');
    }else if (element.hasClass('search-gov')){
        //KS since it's not adding any elements, there's no need for 
        element.find('.dform_widget_searchfield').addClass('txt-gov');
        element.find('button').addClass('btn-gov');
    }else if (element.hasClass('txta-gov')){  
        var el = element.find('> div:last-child').not(":has(.txta-length-message)");
        el.append('<div class="txta-length-message"></div>');
    }else if (element.hasClass('chk-gov')){
        var el = element.find('> div').not(":has(span)");
        el.append('<span class="chk-check"></span>');
        el.find(".helptext").insertAfter(element.find("label"));
    }else if (element.hasClass('file-gov')){
	    //KS: avoid WCAG error
	    $("[type='file']").attr('title', 'File upload');
        var el = element.find('input').not(":has(.file-gov-icon-a)");
        el.after('<span class="file-gov-icon"><span class="file-gov-icon-a"></span><span class="file-gov-icon-b"></span><label class="file-gov-text">Select Files...</label></span>');
        el.parent().css('position', 'relative');
        el.find("input").insertAfter(el.find(".file-gov-icon"));
    }else if (element.hasClass('detail-gov')){
        //KS: requires testing but should works as is
        element.find('> p:first-child').each(
            function(){
                $(this).text("►"+$(this).text());
                $(this).wrap('<a class="detail-title" href="#"></a>');
                $(this).contents().unwrap();
            }
        )
        element.each(
            function(){
                $(this).find('> p').wrapAll('<div class="detail-block"></div>');
            }
        )
    }
	else{
        console.log("style wasn't applied to an element as it wasn't defined as restylable")
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
}

/*KS: here incase I want to implement diffrent indicators
function detailToggle(){
    //KS: uses default indicator
    console.log("yeah")
    detailToggle(['►','▼']);
}*/
function detailToggle(){
    //KS: this expands/collapses the detail tab and chnages the indicator
    //    the indictor is an array in which the collapsed indicor is first and the expanded indicator is second
    
    if($(this).text().indexOf('►') >= 0){
        $(this).text($(this).text().replace(new RegExp('►','g'), '▼'))
        $(this).siblings('.detail-block').addClass("detail-block-visible");
    } else {
        $(this).text($(this).text().replace(new RegExp('▼','g'), '►'))
        $(this).siblings('.detail-block').removeClass("detail-block-visible");
    }
}

function noResultsFound(){
    //KS: when there is no results, add a non-selectable option to say such
    if ($(this).children().length < 1){
        $(this).html('<option hidden>No results found</option>')
    }
}

function addStartupListeners(){
	//KS: problem with the listeners being applied as soon as defined - hopefully this will fix
	$('#dform_container').on('input', '.txta-gov textarea',txtaLength);
	$('#dform_container').on('click', '.detail-title',detailToggle);
	$('#dform_container').off('_KDF_search').on('_KDF_search', function(event, kdf, response, type, name) {
	    //KS: call noResultsFound with 'this' set to the search element that triggered the event
		noResultsFound.call($('[name="'+name+'_id"]'))
	});
}

$('#dform_container').on('keypress','.search-gov [type="text"], .txt-enter-trigger-btn [type="text"]',function() {
	if (event.keyCode == 13) {
		$(this).parent().parent().parent().find('[type="button"]').trigger('click');
	}
});

function regexSearch(regex){
    //KS E.G.: regexSearch("[0-9A-Za-z ]{3,}")
	$(".search-gov input:text, .apply-regex, #dform_widget_txt_postcode").attr('pattern',regex);
}
function marginRevertArrange(element){
	//KS 'element' should be the rad/mchk element as jquery object (supports multiple at once) e.g. $('.rad-gov,.mack-gov') is everything
	element.find('> legend').remove();
	element.find('fieldset legend').removeClass('display-none')
	element.removeClass(function(index, className){
		//KS: removes mchk-margin-* and rad-margin-* classes. Update if names change or include another '|' if more is added
		return (className.match (/\b(mchk-margin-|rad-margin-)\S+/g) || []).join(' ');
	})
}
function marginArrange(legend, style){
	//KS: should be passed the style and legend (eg $('.rad-margin-50 legend').each(function(){marginArrange($(this),'rad-margin--50')});)
	legend.clone().addClass(style).insertBefore(legend.parent().parent());
	legend.addClass('display-none');
}
function paramElementChange(possibleToChange){
    //KS: possibleToChange is an array of element names which can set to values from the params
    var params = KDF.getParams();
    var defaultParams = ['wss', 'lwssinline', 'token'];
    if (params.wss == 'true'){
        $.each( params, function( key, value ) {
            if (possibleToChange.includes(key) && !defaultParams.includes(defaultParams)){
                KDF.setVal(key, value);
                console.log('wss loaded element '+key+' with '+value);
                //KS: Really should include trigger - NEED TO BIND AT START - DO IN FUNCTION LATER
                $('#dform_container').trigger('_style_paramElementChanged');
            }
        });
    }
}
function luminanace(r, g, b) {
	//KS: source https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function contrast(rgb1, rgb2) {
    return (luminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05)
         / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
}
