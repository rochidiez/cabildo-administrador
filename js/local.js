$(function(){

	if(key = helpers.getParameterByName('key')) {
		helpers.render_row('locales/' + key, '.locales--container', '#locales')
	} else {
		setTimeout(function(){
			$('#loading').fadeOut(200)	
		},200)	 
	}
})