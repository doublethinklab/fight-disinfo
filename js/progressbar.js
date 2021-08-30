;
(function ($) {
	$.fn.loading = function (data) {
		var DEFAULTS = {
			backgroundColor: '#ffffff',
			progressColor: '#eb7062',
			percent: data.percent,
			duration: 2000
		};	
		
		$(this).each(function () {
			var $target  = $(this);

			var opts = {
			backgroundColor: $target.data('color') ? $target.data('color').split(',')[0] : DEFAULTS.backgroundColor,
			progressColor: $target.data('color') ? $target.data('color').split(',')[1] : DEFAULTS.progressColor,
			percent: $target.data('percent') ? $target.data('percent') : DEFAULTS.percent,
			duration: $target.data('duration') ? $target.data('duration') : DEFAULTS.duration
			};
			// console.log(opts);
			
			$target.empty().append('<div class="background"></div><div class="rotate"></div><div class="circle-left"></div><div class="circle-right"></div><div class=""><span></span></div>');
	
			$('.background',$target).css('background-color', opts.backgroundColor);
			$('.circle-left',$target).css('background-color', opts.backgroundColor);
			$('.rotate',$target).css('background-color', opts.progressColor);
			$('.circle-right',$target).css('background-color', opts.progressColor);
	
			var $rotate = $target.find('.rotate');
			setTimeout(function () {	
				$rotate.css({
					'transition': 'transform ' + opts.duration + 'ms linear',
					'transform': 'rotate(' + opts.percent * 3.6 + 'deg)'
				});
			},1);		

			if (opts.percent > 50) {
				var animationRight = 'toggle ' + (opts.duration / opts.percent * 50) + 'ms step-end';
				var animationLeft = 'toggle ' + (opts.duration / opts.percent * 50) + 'ms step-start';  
				$('.circle-right',$target).css({
					animation: animationRight,
					opacity: 1
				});
				$('.circle-left',$target).css({
					animation: animationLeft,
					opacity: 0
				});
			} 
		});
	}
})(jQuery);