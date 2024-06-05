define(function( require ){
   //custom JQuery Functions

  require('jquery');
  require('backbone');
  require('prettynames');
  var e = require('./lib/WFCEvents');
  
   function getScore(){        
        if ($("#get_result").length > 0) {
               $('#get_result').html($('#score-value').html());
               clearInterval(myTimer);
            }                    
      }
  
  var ua = navigator.userAgent,
		touchClick = (ua.match(/iPad/i)) ? "touchstart" : "click";
    
  var first_time_score = 0;
  
  if (window.location.href.search('shower-duration') >= 0 && first_time_score === 0) {    
      var myNotice = setInterval(function(){
         if ($("#show-bubble-footprint").length > 0 &&  $('#show-bubble-detail').length > 0) {
            $('#show-bubble-footprint').fadeIn().delay(2000).fadeOut('slow');
            $('#show-bubble-detail').fadeIn().delay(2000).fadeOut('slow');
            clearInterval(myNotice);
         }            
      }, 100);   
     first_time_score = 1;
  }
  
   if (window.location.href.search('complete') === -1) {
      //score info hover
      
      jQuery('body').delegate("#score-display #score-value","mouseenter",function(event){
         if (window.location.href.search('complete') === -1) {          
            if ($('#score-display').position().left === 0) {
              $('#show-bubble-footprint').fadeIn(100);  
            }
         }
      });
      
      jQuery('body').delegate("#score-display #score-value","mouseleave",function(event){
         if (window.location.href.search('complete') === -1) {
            if ($('#score-display').position().left === 0) {
              $('#show-bubble-footprint').fadeOut(100);
            }
         }
      });
       
      
      //data detail hover 
      jQuery('body').delegate("#score-graph,#score-table","mouseenter",function(event){  
            $('#show-bubble-detail').fadeIn(100);
      });
      
      jQuery('body').delegate("#score-graph,#score-table","mouseleave",function(event){  
            $('#show-bubble-detail').fadeOut(100);
      });
      
       jQuery('body').delegate("#score-graph,#score-table",touchClick,function(event){  
            $('#show-bubble-detail').hide(0);
      });
       
   
   }
      
   jQuery('body').delegate("#jump-question","mouseover",function(event){    
           $('#hover_arrow').show();              
      });
   jQuery('body').delegate("#jump-question","mouseout",function(event){    
           $('#hover_arrow').hide();              
      });
   jQuery('body').delegate("#show_detail_hover","mouseover",function(event){    
           $('#hover_result').show();               
      });
    jQuery('body').delegate("#show_detail_hover","mouseout",function(event){    
           $('#hover_result').hide();               
      });
    
   //get_result in virtual water text on click
   
   var myTimer = 0;
   
    jQuery('body').delegate(".choice,.pill-button,.pill-button span",touchClick,function(event){
      
      if (window.location.pathname.search('virtual-water-use') >= 0 ||
          window.location.pathname.search('carwashing') >= 0 ||
          window.location.pathname.search('cars') >= 0 ||
          window.location.href.search('virtual-water-use') >= 0 ||
          window.location.href.search('carwashing') >= 0 ||
          window.location.pathname.search('cars') >= 0 
          ) {
        myTimer = setInterval(getScore, 50); 
      }     
   });
    
    
    if (window.location.pathname.search('virtual-water-use') >= 0 ||
        window.location.pathname.search('carwashing') >= 0 ||
          window.location.pathname.search('cars') >= 0 ||
        window.location.href.search('virtual-water-use') >= 0 ||
        window.location.href.search('carwashing') >= 0||
          window.location.pathname.search('cars') >= 0 
        ) {
          myTimer = setInterval(getScore, 50); 
      }
      
    
   /*
    var do_ = 0; 
         jQuery(window).scroll(function(){
          
          if (window.location.href.search('complete') >= 0 ||window.location.pathname.search('complete') >= 0 ) {
                       
            if ($('#graph-ui').length > 0) {
               var graph_top = $('#graph-ui').offset().top;
               if (300 <= $(window).scrollTop()) {
                  var all_graph_bubble = $('#graph-ui').find('.graph-bar--info');
                  if (do_ === 0) {
                    
                     var counter = 0;
                     var stop = all_graph_bubble.length;                 
                     $(all_graph_bubble[0]).fadeIn('fast').fadeOut('slow');                  
                     $(all_graph_bubble[0]).parent().addClass('white-graph-bar');                  
                     var start = 1;
                     var last = start - 1;
                     var myGraphs = setInterval(function(){
                        $(all_graph_bubble[last]).parent().removeClass('white-graph-bar');
                        $(all_graph_bubble[start]).fadeIn('fast').addClass('show_bubble').fadeOut('slow').removeClass('show_bubble');           
                        $(all_graph_bubble[start]).parent().addClass('white-graph-bar'); 
                        start++;
                        last++;
                       if (start === stop) {
                           clearInterval(myGraphs);
                        }
                        
                     },100);
                     do_ = 1;
                      
                  }               
               }else if($(window).scrollTop() < 50 ){
                      
                 // do_ = 0;
               } 
            }
           }              
         }); 
    
   */
    
    $('body').delegate('.reminder',touchClick,function(e){
      e.preventDefault();
      if ($('#lightbox.email').css('display') === 'none') {
         $('#lightbox.email').fadeIn();      
         $('#report-footer--email').fadeIn(); 
      }else{
         $('#lightbox.email').fadeOut();      
         $('#report-footer--email').fadeOut();    
      }
      
    });
        
     $('body').delegate('#email-input1',"focus",function(){      
        $('#content').addClass('notGone');
        if ($(window).width() < 400) {
          $('#score-display').removeClass('complete');
          $('#report').addClass('hide');
        }
        
     });
     $('body').delegate('#email-input1',"blur",function(){      
        $('#content').removeClass('notGone');     
        $('#score-display').addClass('complete'); 
          $('#report').removeClass('hide');
     });
    
     $('body').delegate('#email-submit',touchClick,function(){
      
     //$('#lightbox.email').delay(1100).fadeOut('slow');      
     // $('#report-footer--email').delay(800).fadeOut('slow');
      
    });
     
     $('body').delegate('#close-email,#lightbox.email',touchClick,function(){
      
      //$('#lightbox.email').fadeOut('fast');      
      //$('#report-footer--email').fadeOut('fast');
      
    });
     
      $('body').delegate('.icon-document-edit','mouseover',function(event){      
         if (event.type === "mouseover") {
           $(this).children('.edit_hover').addClass('force_display');    
         }
      });
      $('body').delegate('.icon-document-edit','mouseout',function(event){      
         if (event.type === "mouseout") {
            $(this).children('.edit_hover').removeClass('force_display');    
         }
      });
      
          
     $('body').delegate('.feedback',touchClick,function(e){
         
        e.preventDefault();
        $('#lightbox.feedback').fadeIn();      
        $('#feedback_div').fadeIn();
         
        var w = $('#feedback_div').width();
        var wW = $(window).width() / 2;        
        $('#feedback_div').css({'left' : (wW - (w/2))}); 
         
    });
    
    
    $('body').delegate('#lightbox.feedback',touchClick,function(){
         $('#lightbox.feedback').fadeOut();      
         $('#feedback_div').fadeOut();
         
         
         
       });
    
    $('body').delegate('#feedback_text','keyup',function(e){
      
      var count = $('#feedback_text').val().length;
      $('#key_count').html( (1000 - count) );
      if (count > 0 ) {
          $('#feedback_text').removeClass('error');
      }
    });
    
    $('body').delegate('.send_feedback',touchClick,function(){
      var feedback_text = $('#feedback_text').val();
      var email = $('#feedback_email').val();
      if (feedback_text.length === 0) {
         $('#feedback_text').addClass('error');
      }else{
         $('#feedback_text').removeClass('error');
	  var url = '//data.watercalculator.org:8443/wfc-api/feedback.php';
	// console.log('attempt');
	 $.ajax({
	    url:url,
	    type:'post',
	    data:'feedback='+feedback_text+'&email='+email+'&url='+document.URL,
	    success:function(data,textStatus,jqXHR){
		  $('.send_feedback').html('Success!!');
		  $('#feedback_email').val('');
		  $('#feedback_text').val('');
		  $('#lightbox.feedback').fadeOut('slow');      
		  $('#feedback_div').fadeOut('slow');
		  console.log('feedback sent');
	    },
	    error:function (jqXHR, textStatus, errorThrown)
	    {
		  console.log(errorThrown);
		  console.log(jqXHR.statusText);
	    }
	  
	 });
	 
	 /*
        
         $.post(url,{feedback:feedback_text,email:email},function(data){
                             
            
         });
         */
      }
      
    });
    
    //edit questions
       
     $('body').delegate('.row1','mouseover',function(){      
      $(this).find('.click-to-edit-left').addClass('must_show');      
    });
    $('body').delegate('.row1','mouseout',function(){      
      $(this).find('.click-to-edit-left').removeClass('must_show');      
    });
    
        var w = $('#feedback_div').width();
        var wW = $(window).width() / 2;        
        $('#feedback_div').css({'left' : (wW - (w/2))});       
      
      $(window).resize(function(){
    
        var w = $('#feedback_div').width();
        var wW = $(window).width() / 2;        
        $('#feedback_div').css({'left' : (wW - (w/2))});
         
      
     });
  
     
 

    
});