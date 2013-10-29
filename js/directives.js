angular.module('directives', [])

.directive('placeimage', function() {

	var URL = window.URL || window.webkitURL;

	return {
		restrict: 'A',
		scope: { 
			image:'=placeimage'
		},
		link: function(scope, element, attrs, ctrl) {
			element.bind('change', function(evt) {			
				var imageResult = {
                    file: evt.target.files[0],
                	url: URL.createObjectURL(evt.target.files[0])
                };
				scope.image = imageResult;
				scope.$apply();
			});
		}
	};
})

.directive('draggable', function($document) {

	return function(scope, element, attr) {
    	var startX = 0, startY = 0, x = 0, y = 0;

    	//get image dimensions and set CSS properties!!
 
    	element.on('mousedown', function(event) {
	        // Prevent default dragging of selected content
	        event.preventDefault();
	        startX = event.pageX - x;
	        startY = event.pageY - y;
	        $document.on('mousemove', mousemove);
	        $document.on('mouseup', mouseup);
    	});
 
    	function mousemove(event) {
	        y = event.pageY - startY;
	        x = event.pageX - startX;
	        element.css({
	          top: y + 'px',
	          left:  x + 'px'
	        });
    	}
 
    	function mouseup() {
        	$document.unbind('mousemove', mousemove);
        	$document.unbind('mouseup', mouseup);
    	}
    }

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