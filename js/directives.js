angular.module('directives', [])

.directive('placeimage', function($q) {

	var URL = window.URL || window.webkitURL;

	return {
		restrict: 'A',
		scope: { 
			image:'=placeimage',
		},
		link: function(scope, element, attr, ctrl) {
			element.bind('change', function(evt) {			
				var imageResult = {
                    file: evt.target.files[0],
                	url: URL.createObjectURL(evt.target.files[0])
                };
                //create canvas and base64 encode here
                var imgBase64;
                var c = document.createElement('canvas');
                var cxt = c.getContext('2d');
                var img = document.getElementById('postimg');

                scope.$apply(function() {
                	scope.image = imageResult;
                });

                img.onload = function(evt) {
                	c.height = evt.target.naturalHeight;
                	c.width = evt.target.naturalWidth;
	                cxt.drawImage(img, 0, 0);
	                imgBase64 = c.toDataURL("image/png");

	                scope.$apply(function() {
						scope.image.imgBase64 = imgBase64;
					});
                }
			});
		}
	};
})

.directive('draggable', function($document) {

	return {
		restrict: 'A',
		link: function(scope, element, attr, ctrl) {
	    	var startX = 0, startY = 0, x = 0, y = 0;
	    	var moveAxis;
	    	var divWidth = window.innerWidth;
	    	var divHeight = .75*divWidth;
	    	var topCutoff = 0, topCutoffPct = 0;
	    	var botCutoff = 0, botCutoffPct = 0;
	    	var leftCutoff = 0, leftCutoffPct = 0;
	    	var rightCutoff = 0, rightCutoffPct = 0;

	   		element.bind('load', function(evt) {
	   			
	   			element.css('top', '0px');
	   			element.css('left','0px');
	   			startX = 0; startY = 0; x = 0; y = 0;

	   			var imgWidth = evt.target.width;
	   			var imgHeight = evt.target.height;
	   			var aspectRatio = imgHeight/imgWidth;

	   			 if( aspectRatio >= 0.75 ) {
	   			  	 element.css('width', '100%');	//move axis is vertical
	   			  	 moveAxis = "vertical";
	   			 }
	   			 else {
	   			 	element.css('height', '100%'); //move axis is horizontal
	   			 	moveAxis = "horizontal";
	   			 }
	   			 
	   		});

	    	element.on('mousedown', function(event) {
		        // Prevent default dragging of selected content
		        event.preventDefault();
		        startX = event.pageX - x;
		        startY = event.pageY - y;
		        $document.on('mousemove', mousemove);
		        $document.on('mouseup', mouseup);
	    	});
	 
	    	function mousemove(event) {
	    		var cssTop = parseInt(element.css('top'));
	    		var cssLeft = parseInt(element.css('left'));
	    		var imgHeight = parseInt(element.css('height'));
	    		var imgWidth = parseInt(element.css('width'));
	    		var heightDiff = divHeight - imgHeight;
	    		var widthDiff = divWidth - imgWidth;

	    		if (moveAxis == "vertical") {
	    			if (cssTop <= 0 && cssTop >= heightDiff) {
			        	y = event.pageY - startY;
			        	if (y > 0) { y = 0; }
			        	if (y < heightDiff) { y = heightDiff; }
			        	element.css({
			        		top: y + 'px'
			        	});
		        	
			        	topCutoff = -y;
			        	topCutoffPct = topCutoff/imgHeight;
			        	botCutoff = imgHeight - divHeight - topCutoff;
			        	botCutoffPct = botCutoff/imgHeight;

		        	}
		       	} else if (moveAxis == "horizontal") {
		       		if (cssLeft <= 0 && cssLeft >= divWidth) {
				        x = event.pageX - startX;
				        if (x > 0) { x = 0; }
				        if (x < widthDiff) { x - widthDiff; }
				       	element.css({
				          left:  x + 'px'
				        });

				        leftCutoff = -x;
				        leftCutoffPct = leftCutoff/imgWidth;
				        rightCutoff = imgWidth - divWidth - leftCutoff;
				        rightCutoffPct = rightCutoff/imgWidth;
				    }
		    	}
	    	}
	 
	    	function mouseup() {
	        	$document.unbind('mousemove', mousemove);
	        	$document.unbind('mouseup', mouseup);
			    scope.$apply(function() {
			    	scope.newimage.moveAxis = moveAxis;
	        		scope.newimage.topCutoffPct = topCutoffPct;
	        		scope.newimage.botCutoffPct = botCutoffPct;
	        		scope.newimage.leftCutoffPct = leftCutoffPct;
	        		scope.newimage.rightCutoffPct = rightCutoffPct;
	        	});
	    	}
	    }
    };

})

  .directive('clickcolor', function() {
    // this is a test directive. Delete later.
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
			$(element).click(function() {
				var currentColor = $(element).prop('color');
				if (currentColor !== attr.clickcolor) {
					$(element).css('color', attr.clickcolor);
				} else {
					$(element).css('color', 'black'); console.log('clicked second!');
				}
			});

      }
    };
  });