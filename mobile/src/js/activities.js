var $ = require('./zepto.js');
$('.more').on('tap',function() {
	if(!$(this).data('opened')){
		$(this).prev('.mui-card-content').show();
		$(this).data('opened',true).find('i').attr('class','mui-icon mui-icon-arrowup')
	}else{
		$(this).prev('.mui-card-content').hide();
		$(this).data('opened',false).find('i').attr('class','mui-icon mui-icon-arrowdown')
	}
	return false;
})