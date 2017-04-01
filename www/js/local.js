$(function(){
	var key = helpers.getParameterByName('key')
	, position = 0
	, edit = key ? 'locales/' + key : null

	helpers.firebase_once('categorias', function(categorias){ 
		helpers.render_row(edit,'.locales--container', '#locales', {categorias: categorias}, function(res){
			$('.horarios--container').html($.templates('#horario').render(helpers.tpl.toArray(res.entry['horarios para filtro']))).promise().done(function(){
				$('.descuento--container').html($.templates('#descuento').render(res.entry.descuentos)).promise().done(function(){
					if($('.horarios--container').children().length > 6){
						$('.add-time').addClass('w-hidden')
					}
					$('#loading').fadeOut(200)
				})
			})			
		})
	})

	// pagos

	$(document).on('click','.pago-btn.open',function(e) {
		$(this).toggle()
		$('.proximo-pago-input').slideToggle()
		e.preventDefault()
	})

	$(document).on('click','.pago-btn.do',function(e) {
		alert("pago")
		e.preventDefault()
	})

	// horarios

	$(document).on('click','.add-time',function(e) {
		if($('.horarios--container').children().length < 7){
			$('.horarios--container').append($.templates('#horario').render({}))
		}
		e.preventDefault()
	})


	// descuentos


	// fotos
	$(document).on('click','.link-block',function(e) {
		var position =  $(this).parent().index()
		$('.photo:eq(' + position + ')').click()
		e.preventDefault()
	})

	$(document).on('click','.picture-button',function(e) {
		var position =  $(this).parent().parent().index()
		$('.photo:eq(' + position + ')').click()
		e.preventDefault()
	})

	$(document).on('change','.photo',function (e) {
		var that = this 
	    if (this.files && this.files[0]) {
	        var reader = new FileReader()
	        reader.onload = function (e) {
	        	$('.publish__uploadimages--preview > div:eq(' + $(that).index() + ')').find('.link-block img').attr('src',e.target.result)
	        }
	        reader.readAsDataURL(this.files[0])
	    }			
	})

	$(document).on('submit','.publish__uploadimages--form',function(e) {
	    var file = new FormData(this)
	    , upload_in_progress = 1 

	    $('.publish__uploadimages--info').text("Iniciando carga de fotos...");

	    // Upload file and metadata to the object 'images/mountains.jpg'
		var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			function(snapshot) {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log('Upload is paused');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log('Upload is running');
					break;
				}
			}, function(error) {
				switch (error.code) {
					case 'storage/unauthorized':
						// User doesn't have permission to access the object
						break;

					case 'storage/canceled':
						// User canceled the upload
						break;

					case 'storage/unknown':
						// Unknown error occurred, inspect error.serverResponse
						break;
				}
			}, function() {
				// Upload completed successfully, now we can get the download URL
				console.log("proceed to save " + uploadTask.snapshot.downloadURL)
				var downloadURL = uploadTask.snapshot.downloadURL;
			});

	    e.preventDefault()
	})	
})