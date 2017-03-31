$(function(){
	var key = helpers.getParameterByName('key')
	, a = key ? 'locales/' + key : null

	
	helpers.render_row(a, '.locales--container', '#locales', function(){
		$('#loading').fadeOut(200)	
	})
})