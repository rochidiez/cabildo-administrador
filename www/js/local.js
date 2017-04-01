$(function(){
	var key = helpers.getParameterByName('key')
	, edit = key ? 'locales/' + key : null

	helpers.firebase_once('categorias', function(categorias){ 
		helpers.render_row(edit,'.locales--container', '#locales', {categorias: categorias}, function(){
			$('#loading').fadeOut(200)	
		})
	})
})