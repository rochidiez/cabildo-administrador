$(function(){

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			$('.session-status').html(email + ' <a href="#" class="salir">Cerrar sesión</a>')
			if (!emailVerified) {
				//document.getElementById('quickstart-verify-email').disabled = false;
			}
		// [END_EXCLUDE]
		} else {
			if(location.pathname!='/'){
				location.href = '/';
			} else {			
				$('.session-status').text("Sin inicio de sesión")
			}
		}
	});

	$(document).on('click','.salir',function(){
		firebase.auth().signOut().then(function() {
			if(location.pathname!='/'){
				location.href = '/';
			}
		}).catch(function(error) {
		  	alert(err.message)
		})
	})

	$('.login').click(function(){
		var email = $.trim($('#email').val())
		, pass = $.trim($('#password').val())
		firebase.auth().signInWithEmailAndPassword(email, pass).then(function(){
			location.href = email == 'admin@cabildo.com' ? 'admin.html' : 'estadisticas.html'
		}).catch(function(err) {
			alert(err.message)
		})		
	})

	$('.createuser').click(function(){
		firebase.auth().createUserWithEmailAndPassword("telemagico@gmail.com", "telemagico").catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(error)
		  // ...
		})
	})
})