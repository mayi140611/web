/**
 * Unicorn Admin Template
 * Diablo9983 -> diablo9983@gmail.com
**/
$(document).ready(function(){
    // === Popovers === //    
    var placement = 'bottom';
    var trigger = 'hover';
    var html = true;
/*
    $('.popover-panzer').popover({
       placement: placement,
       content: '<span class="content-big">8</span> <span class="content-small">直升机已完成数</span><br /><span class="content-big">4</span> <span class="content-small">直升机未完成数</span>',
       trigger: trigger,
       html: html   
    });
    $('.popover-tank').popover({
       placement: placement,
       content: '<span class="content-big">3</span> <span class="content-small">坦克已完成数</span><br /><span class="content-big">7</span> <span class="content-small">坦克未完成数</span>',
       trigger: trigger,
       html: html   
    });
    $('.popover-copter').popover({
       placement: placement,
       content: '<span class="content-big">6</span> <span class="content-small">装甲车已完成数</span><br /><span class="content-big">6</span> <span class="content-small">装甲车未完成数</span>',
       trigger: trigger,
       html: html   
    });
    $('.popover-dunker').popover({
        placement: placement,
        content: '<span class="content-big">12</span> <span class="content-small">登陆艇已完成数</span><br /><span class="content-big">6</span> <span class="content-small">登陆艇未完成数</span>',
        trigger: trigger,
        html: html   
     });
*/
});


unicorn = {
		// === Peity charts === //
		peity: function(){		
			$.fn.peity.s.line = {
				strokeWidth: 1,
				delimeter: ",",
				height: 24,
				max: null,
				min: 0,
				width: 50
			};
			$.fn.peity.defaults.bar = {
				delimeter: ",",
				height: 24,
				max: null,
				min: 0,
				width: 50
			};
			$(".peity_line_good span").peity("line", {
				colour: "#B1FFA9",
				strokeColour: "#459D1C"
			});
			$(".peity_line_bad span").peity("line", {
				colour: "#FFC4C7",
				strokeColour: "#BA1E20"
			});	
			$(".peity_line_neutral span").peity("line", {
				colour: "#CCCCCC",
				strokeColour: "#757575"
			});
			$(".peity_bar_good span").peity("bar", {
				colour: "#459D1C"
			});
			$(".peity_bar_bad span").peity("bar", {
				colour: "#BA1E20"
			});	
			$(".peity_bar_neutral span").peity("bar", {
				colour: "#757575"
			});
		},
}
