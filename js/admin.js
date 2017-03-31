$(function(){

	$(document).on('click','.edit.table-action',function(){
		location.href = 'local.html?key=' + $(this).data('key')
	})

	$(document).on('click','.eliminar.table-action',function(){
		$('body').attr('data-key',$(this).data('key'))
	})	

	// modal action

	// bring all and sort.
	helpers.render_tabs('locales','#locales',
		{
			"todos":[]
			,"premium":[]
			,"basico":[]
			,"avenida":[]
		}, function(){
			$('#loading').fadeOut(200)	
		}
	)
})