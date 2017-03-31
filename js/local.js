$(function(){

	var key = helpers.getParameterByName('key')
	console.log(key)

	if(key) {
		helpers.render_row('locales/' + key, '.locales--container', '#locales')
	}
})