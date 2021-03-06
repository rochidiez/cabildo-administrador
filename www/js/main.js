
jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size()
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index)
  }
  this.append(element);
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last())
  }
  return this
}

var AC = {
	descuentos : {
		defaults : null
		/*
		defaults : [{
			porcentaje : "10%", 
			entidad : "Avenida Cabildo"
		}]*/
	}
}
, latlng = undefined
, settings = {
	notification_delay : 5000
	, user : undefined
	, default_latlng : "-34.561491, -58.456147"
	, pagos : {
		dia_vencimiento : 20
	}
	, routes : {
		loaded : {},
		once : {"locales":true},
	}
	, env : {
		// Cabildo
		prod : {
			firebase : {
				apiKey: "AIzaSyDxNOXJR9IQkPRO5fHmapWKcqozvl5ETkU",
				authDomain: "avenida-cabildo.firebaseapp.com",
				databaseURL: "https://avenida-cabildo.firebaseio.com",
				projectId: "avenida-cabildo",
				storageBucket: "avenida-cabildo.appspot.com",
				messagingSenderId: "854269150359"
			}
			, uid : '4KZEtrqeMgc4Hm6P7NWwbCeTLke2'
			, endpoint : 'https://avenida-cabildo.herokuapp.com'
		}
	    // Infinix
	    , dev : {
	    	firebase : {
				apiKey: "AIzaSyACm6k1hFLVQc9zJgP6omf1HjzSfkUqtYI",
				authDomain: "infinix-console.firebaseapp.com",
				databaseURL: "https://infinix-console.firebaseio.com",
				storageBucket: "infinix-console.appspot.com",
				messagingSenderId: "378423189863"	    	
	    	}
	    	, uid : 'OnKAmfWuFCT4FN2hahBfkbqz34J2'
	    	, endpoint : 'http://cabildo.local'
	    	//, endpoint : 'https://avenida-cabildo.devmeta.net'
	    }
	}
}
, notification = function(text){
	$('.mensaje.modal .modal--pcenter').text(text)
	$('.mensaje.modal').css({opacity:1}).fadeIn(100)
}
, isAdmin = function(){
	return settings.user.uid==settings.env[env].uid
}
, isGuest = function(){
	return !settings.user
}
, initAutocomplete = function (){
  var input = document.getElementById('direccion');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    if (place.geometry.viewport) {
      var coords = place.geometry.location.toJSON()
      latlng = coords.lat + ', ' + coords.lng 
    }
  })
}
, routes = {
	index : function(resolve){
		$('.index-container').html($.templates('#index').render()).promise().done(function(){
	  		$('body').addClass('login-body')
	  		$('input[name="email"]').focus()
			resolve()
		})
	}
	, estadisticas : function(resolve){
		var data = []
		, count = 0
		return new Promise(function(resolve, reject) { // categorias
			return firebase.database().ref('/usuarios').once('value').then(function(usuarios) {
				usuarios.forEach(function(locales){
					var arr = locales.val()
					for(var i in arr){
						if(arr[i]==settings.user.displayName){
							count++
						}
					}
				})				
				resolve(count)
			})
		}).then(function(count){
			$('.estadisticas-container').html($.templates('#estadisticas').render({personas:count}))
		}).then(resolve)		
	}
	, local : function(resolve){
		var position = 0
		, key = helpers.getParameterByName('key')
		, data = []

		if(isAdmin()){
			key = key ? key : null
		} else {
			key = settings.user.displayName
		}

		return new Promise(function(resolve, reject) { // categorias
			return firebase.database().ref('/categorias').once('value').then(function(categorias) {
				resolve(categorias)
			})
		}).then(function(categorias){
			data.categorias = categorias
			return firebase.database().ref('/descuentos').once('value').then(function(descuentos) {
				return descuentos
			})			
		}).then(function(descuentos){
			data.descuentos = descuentos
			return firebase.database().ref('/tarjetas').once('value').then(function(tarjetas) {
				return tarjetas
			})
		}).then(function(tarjetas){
			data.tarjetas = tarjetas
			return firebase.database().ref('/clientes/' + key).once('value').then(function(cliente) {
				return cliente
			})
		}).then(function(cliente){
			data.cliente = cliente
			return firebase.database().ref('/locales/'+key).once('value').then(function(local) {
				return local.val()
			})
		}).then(function(local){
			if(local) {
				local.key = key
				latlng = local.ubicacion
			}
			return $('.local-container').html($.templates('#local').render({data:local,key:key,categorias:data.categorias.val(),cliente:data.cliente.val()},helpers.tpl)).promise().done(function(){
	            var horarios_filtro = local ? local['horarios para filtro'] : null
	            $('.horarios--container').html($.templates('#horario').render(helpers.tpl.toArray(horarios_filtro))).promise().done(function(){
	                var entidades = []
	                , descuentos = local&&local.descuentos?local.descuentos:[""]

	                initAutocomplete()

	                data.tarjetas.forEach(function(tarjeta){
	                	entidades.push(tarjeta.key)
	                })

	                $('.descuento--container').html($.templates('#descuento').render({values:descuentos,entidades:entidades})).promise().done(function(){
	                    if($('.horarios--container').children().length > 6){
	                        $('.add-time').addClass('w-hidden')
	                    }
	                })
                })

				resolve()
			})
		})
	}
	, locales : function(resolve){

		// only once (see settings.routes)
		// firebase socket handlers

		var data = []

		return new Promise(function(resolve, reject) { // clientes
			return firebase.database().ref('/clientes').once('value').then(function(clientes) {
				resolve(clientes)
			})
		}).then(function(clientes){
			data.clientes = clientes.val()
			return firebase.database().ref('/planes').once('value').then(function(planes) {
				return planes
			})
		}).then(function(planes){
			data.planes = planes
			return firebase.database().ref('/locales').once('value').then(function(locales) {
				return locales
			})
		}).then(function(locales){

            $('.locales-container').html($.templates('#locales').render())

            var live = firebase.database().ref('/clientes')
			// live fb handlers
			live.on('child_added', (data) => {
				firebase.database().ref('/locales/'+data.key).once('value').then(function(snapshot) {
					var local = snapshot.val()
					local.key = $.trim(snapshot.key)
					local.cliente = data.val()
					$('.locales-container .w-tab-pane[data-w-tab="todos"] .locales').prepend($.templates('#listadolocales').render(local, helpers.tpl))
			  		$('.locales-container .w-tab-pane[data-w-tab="' + local.cliente.plan + '"] .locales').prepend($.templates('#listadolocales').render(local, helpers.tpl))
			  	})
			})

			live.on('child_changed', (data) => {
				firebase.database().ref('/locales/'+data.key).once('value').then(function(snapshot) {
					var local = snapshot.val()
					local.key = data.key
					local.cliente = data.val()
					$('.locales-container .td').each(function(){
						if($(this).data('id') == data.key){
							var tab = $(this).parents('.w-tab-pane').data('w-tab')
							var node = $('.locales-container .w-tab-pane[data-w-tab="' + tab + '"] .locales')
							if(tab == 'todos'){
								var index = $(this).index()
								$(this).remove()
								$('.locales-container .w-tab-pane[data-w-tab="todos"] .locales').insertAt(index, $.templates('#listadolocales').render(local, helpers.tpl))
							} else {
								var index = $(this).index()
								$(this).remove()
								$('.locales-container .w-tab-pane[data-w-tab="' + local.cliente.plan + '"] .locales').insertAt(index, $.templates('#listadolocales').render(local, helpers.tpl))
							}
						}
					})
				})
			})

			live.on('child_removed', (data) => {
				$('.td[data-id="'+data.key+'"]').each(function(){
					$(this).remove()
				})
			})

	        resolve()
		})
	}
}
, helpers = {
	updateHeader : function(){
		var route = location.hash.replace('#','')||''
		, route = route.indexOf('?') > -1 ? route.substring(0, route.indexOf('?')) : route

		$('.nav-item').removeClass('w--current')
		$('a[data-section="#' + route + '"]').addClass('w--current')
	}
	, resetWebflow : function(){
		if(typeof Webflow == undefined) return false
		Webflow.require("tabs").ready()
	}
	, render : function(){
		$('#loading').fadeIn(200, function(){
			$('body').removeClass()
			var route = location.hash.replace('#','')||'index'
			, route = route.indexOf('?') > -1 ? route.substring(0, route.indexOf('?')) : route
			if(route && typeof routes[route] == 'function'){
	    		return new Promise(function(resolve, reject){
	    			if(!$('.content .' + route + '-container').length) $('body > .content').append('<div class="' + route + '-container"></div>')
	    			$('body > .content > div').hide()
		    		if(settings.routes.once[route] && settings.routes.loaded[route]){
		    			resolve(route)
		    		} else {
	    				settings.routes.loaded[route] = true
						return routes[route].call(this, function(){
							resolve(route)	
						})
					}
		    	}).then(function(route){
		    		$('.'+route+'-container').show()
	    			$('#loading').fadeOut(500,function(){
			    		helpers.updateHeader()
			    		helpers.resetWebflow()
	    			})
		    	})
	    	} else {
		    	if(!$('.content .alert-container').length) $('body > .content').append('<div class="alert-container">No existe la página</div>')
		    }
	    	return false
		})
	}
	, randomstr : function(len){
		var str = ""
		, possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		for( var i=0; i < len; i++ )
			str += possible.charAt(Math.floor(Math.random() * possible.length))
		return str;
	}	
	, setParameterByName : function(name,value,url){
        if(!url) url = window.location.hash.split('#').join('')
        if(value == null) value = ''
        var pattern = new RegExp('\\b('+name+'=).*?(&|$)')
        if(url.search(pattern)>=0){
            return url.replace(pattern,'$1' + value + '$2')
        }
        return url + '&' + name + '=' + value 
    }
    , getParameterByName : function(name, url) {
	    if (!url) {
	      url = window.location.href;
	    }
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
	, tpl : {
	    isAdmin : function(){
			return isAdmin()
		}
		, getProxVencimiento : function(format){
			var now = moment()
			, then = moment([now.format('YY'), now.format('MM')-1, settings.pagos.dia_vencimiento])
			, date = then

			if(now < then){
				date = moment([now.format('YY'), now.format('MM'), settings.pagos.dia_vencimiento])
			}

			return moment(date).format(format||'DD/MM')
		}
		, toDate : function(date,format){
			return moment(date).format(format||'DD/MM/YY')
		}
		, getHorario : function(index,entry){
			if(!entry || !entry.horarios) return ""

			var parts = []
			, str = ""

			if(entry.horarios.indexOf("\\n")>-1)
				parts = entry.horarios.split("\\n")
			else if(entry.horarios.indexOf("\n")>-1)
				parts = entry.horarios.split("\n")
			
			parts.forEach(function(ln){
				ln = ln.toLowerCase()
				if(ln.indexOf(index.toLowerCase())>-1){
					str = ln.replace(index.toLowerCase(),"")
				}
			})

			return $.trim(str)
		}
		, toHorarios : function(horarios){
			var parts = []

			if(entry.horarios.indexOf("\\n")>-1)
				parts = entry.horarios.split("\\n")
			else if(entry.horarios.indexOf("\n")>-1)
				parts = entry.horarios.split("\n")

			return parts
		}
		, toArray : function(object){
			if(!object) return false
			var items = []
			if(!$(object).length) return items;
			for(var i in object){
				var row = object[i]
				row.key = i
				items.push(row)
			}
			return items
		}
		, keysArray : function(object){
			if(!object) return false
			var items = []
			if(!$(object).length) return items;
			for(var i in object){
				items.push(i)
			}
			return items
		}
		, prop : function(a,b,c,d,e){
			var f = b
			if(typeof b=='string') f = c
			if(f && f[a]) return f[a].replace(d,e)
			return typeof b=='string' ? b : ""
		}
	}    
}

$(document).on('click','.nav-item',function(e){
	e.preventDefault()
	var section = $(this).data('section')
	if(!section) return false
	$('.nav-item').removeClass('w--current')
	$(this).addClass('w--current')
	location.hash = section.replace('#','')
	return false
})

$(document).on('click','.salir',function(){
	firebase.auth().signOut().then(function() {
		localStorage.clear()
		location.hash = '';
	}).catch(function(error) {
	  	alert(err.message)
	})
})

$(document).on('click','.login',function(){
	var email = $.trim($('#email').val())
	, pass = $.trim($('#password').val())
	, that = this
	$(this).animate({opacity:0.7}).text("Por favor espere ... ")
	firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(err) {
		alert(err.message)
		$(that).animate({opacity:1}).text("Continuar")
	})		
})

$(document).on('click','.createuser',function(){
	firebase.auth().createUserWithEmailAndPassword("telemagico@gmail.com", "telemagico").catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(error)
	  // ...
	})
})

// ~locales
$(document).on('click','.ver.table-action',function(){
	var key = $(this).data('key')
	$('.modal.viewlocal .modal-contenido').html('')
	firebase.database().ref('/locales/' + key).once('value').then(function(local) {
		$('.modal.viewlocal .modal-contenido').html($.templates('#modal_viewlocal').render(local.val(), helpers.tpl)).promise().done(function(){
			$('.modal.viewlocal').fadeIn()
		})
	})
})

$(document).on('click','.close-modal',function(){
	$('.modal').fadeOut()
})

$(document).on('click','.edit.table-action',function(){
	location.hash = 'local?key=' + encodeURIComponent($(this).data('key'))
})

$(document).on('click','.eliminar.table-action',function(){
	$('body').attr('id',$(this).data('key'))
	$('.eliminarlocal.modal').fadeIn()
})	

$(document).on('click','.modal.eliminarlocal .modalbutton.yes',function(){
	var key = $('body').attr('id')

	$('#loading').fadeIn(200, function(){
		return new Promise(function(resolve, reject) { // local and cliente
			return firebase.database().ref('/locales').child(key).remove().then(function(){
				return firebase.database().ref('/clientes').child(key).remove().then(function(){
					resolve(null)
				})
			})
		}).then(function(){ // descuentos
			return firebase.database().ref('/descuentos').once('value').then(function(descuentos){
				descuentos.forEach(function(descuento){
					var locales = []
					, key = descuento.key
					, data = descuento.val()
					, ctr =0 
					if(data['locales adheridos'] && data['locales adheridos'].length){
						for(var i in data['locales adheridos']){
							ctr++
							var value = data['locales adheridos'][i]
							if(value && key != value){
								locales.push(value)
							}

							if(ctr === descuentos.length){
								return firebase.database().ref('/descuentos/' + key + '/locales adheridos').set(locales)
							}
						}
					}
				})
			})
		}).then(function(){ // categorias
			return firebase.database().ref('/categorias').once('value').then(function(categorias){
				categorias.forEach(function(categoria){
					var locales = []
					, key = categoria.key
					, data = categoria.val()
					, ctr = 0

					for(var i in data.locales){
						ctr++
						if(key != data.locales[i]){ // add 
							locales.push(data.locales[i])
						} 

						if(ctr === categorias.length){
							return firebase.database().ref('/categorias/'+key+'/locales').set(locales)
						}
					}
				})
			})
		}).then(function(){ // promociones
			return firebase.database().ref('/promociones').once('value').then(function(promociones){
				var promos = []
				, ctr = 0
				promociones.forEach(function(promo){
					ctr++
					var promo = promo.val()
					if(promo && key != promo){ // add 
						promos.push(promo)
					} 

					if(ctr === promociones.length){
						return firebase.database().ref('/promociones').set(promos)
					}
				})				
			})			
		}).then(function(){ // exit
			$('*[data-ix=close-delete]').click()
			$('#loading').fadeOut(200,function(){
				$('*[data-id="' + key + '"]').remove()
				notification("Local eliminado: " +key)
			})
		})
	})
})

$('.edit.table-action').click(function(){
	location.hash = 'local?key=' + encodeURIComponent($(this).data('key'))
})

$(document).on('click','.forgot-password-btn',function(e) {

	var auth = firebase.auth()
	, emailAddress = $('#email').val()||""
	, that = this

	$(this).animate({opacity:0.7}).text("Por favor espere ... ")
	auth.sendPasswordResetEmail(emailAddress).then(function() {
		$('.stat-container').removeClass('w-hidden').text("Un email ha sido enviado a " + emailAddress).fadeIn('fast')
		$(that).animate({opacity:1}).text("Recuperar contraseña")
	  // Email sent.
	}, function(error) {
		$('.stat-container').removeClass('w-hidden').text("Hubo el siguiente error al enviar email: " + error.message).fadeIn('fast')
		$(that).animate({opacity:1}).text("Recuperar contraseña")
	  // An error happened.
	});

	e.preventDefault()
	return false
})

// ~local
$(document).on('click','.save',function(){

	var keyRaw = $('input[name="key"]').val()?$.trim($('input[name=key]').val()):$.trim($('input[name=nombre_simple]').val())
	// restrain not allowed chars for firebase keys.
	, key = keyRaw.split('.').join("").split('#').join("").split('$').join("").split('[').join("").split(']').join("")
	, descuentos = []
	, planData = {}
	, plan = $.trim($('select[name=plan]').val())||""
	, direccion = $.trim($('input[name=direccion]').val())||""
	, efectivo = $.trim($('input[name=efectivo]').val())||""
	, horas = $.trim($('input[name=de-lunes-a-viernes]').val())||""
	, nombre_simple = key||""
	, web = $.trim($('input[name=web]').val())||""
	, telefono = $.trim($('input[name=telefono]').val())||""
	, mail = $.trim($('input[name=mail]').val())||""
	, buildme = $('input[name="key"]').val()||false

	if(nombre_simple=="") return notification("Por favor ingresá el nombre de tu local")
	if(plan=="" && isAdmin()) return notification("Por favor elegí un plan para este cliente")
	if(direccion=="") return notification("Por favor ingresá la dirección de tu local")
	if(horas=="") return notification("Por favor ingresá el horario de antención de tu local")
	if(efectivo=="") return notification("Por favor ingresá un descuento exclusivo para tu local")
	if(web=="") return notification("Por favor ingresá la web de tu local")
	if(telefono=="") return notification("Por favor ingresá un teléfono para tu local")
	if(mail=="") return notification("Por favor ingresá un email para tu local")

	$('#loading').fadeIn(200, function(){
		return new Promise(function(resolve, reject) {
			firebase.database().ref('/planes/' + plan).once('value').then(function(snap_plan){
				resolve(snap_plan.val())
			})
		}).then(function(data){ // photos
			planData = data
			$('.photo').each(function(){
				if($(this).get(0).files.length){
					var name = $(this).attr('name')
					, file = $(this).get(0).files[0]
					, metadata = {
						customMetadata : {
							'name' : name
							, 'key' : key
						}
					}
					firebase.storage().ref().child('images/' + file.name).put(file,metadata).then(function(snapshot){
						var i = snapshot.metadata.customMetadata.name.replace('_',' ')
						, value = snapshot.downloadURL

						firebase.database().ref('/locales/' + key + '/' + i).set(value)
					})
				}
			})

			return planData				
		}).then(function(planData){ // clientes
			var clientData = {}
			, mailData = {}
			, horarios = "Lunes a Viernes " + $('input[name=de-lunes-a-viernes]').val() + " \nSábados " + $('input[name=sabado]').val()  + " \nFeriados " + $('input[name=feriados]').val()
			, horarios_filtro = {}
			, horarios_ref = {}	

			clientData.plan = plan
			clientData.nombre_suscriptor = $('input[name=nombre_suscriptor]').val()||""
			clientData.mail_suscriptor = $('input[name=mail_suscriptor]').val()||""

			mailData = clientData
			mailData.pass = helpers.randomstr(12)
			mailData.local = key

			// suscriptor
			if(clientData.mail_suscriptor != $('input[name=mail_suscriptor_ref]').val()){
				secondaryApp.auth().createUserWithEmailAndPassword(mailData.mail_suscriptor, mailData.pass)
				.then(function(user) {
					//var currentuser = firebase.auth().currentUser
					user.sendEmailVerification()
					secondaryApp.auth().signOut()
					return user
				})
				.then(function(user){
				    user.updateProfile({
				        displayName: key,
				        photoURL: ''
				    }).then(function() {
				    	$.post(settings.env[env].endpoint + '/suscriptor.php',mailData,function(resp){
				    		notification("La cuenta de cliente ha sido creada y se envió notificación a " + mailData.mail_suscriptor)
				    	})
				    }, function(error) {
				    	notification("Error: " +error)
				    })
				})
				.catch(function(error) {
					console.log(error.message)
				})
			}

			// filtro horarios 
			$('.horarios_filtro').each(function() {
				var dia = $(this).find('.dia').val()
				, abre = $(this).find('.abre').val()
				, cierra = $(this).find('.cierra').val()

				if(dia!="" && abre!="" && cierra!=""){
					horarios_filtro[dia] = {
						'abre': parseInt(abre)
						, 'cierra' : parseInt(cierra)
					}
				}
			})

			// desglose horarios del modo simple (opcional)
			if($.isEmptyObject(horarios_filtro)){
				horarios_ref = {
					"de-lunes-a-viernes" : ["lunes","martes","miercoles","jueves","viernes"]
					, "sabado" : ["sabado"]
					, "feriados" : ["domingo"]
				}
			} else {
				if(!horarios_filtro['lunes']) {
					horarios_ref["de-lunes-a-viernes"] = ["lunes","martes","miercoles","jueves","viernes"]
				}
				if(!horarios_filtro['sabado']) {
					horarios_ref["sabado"] = ["sabado"]
				}
				if(!horarios_filtro['domingo']) {
					horarios_ref["feriados"]  = ["domingo"]
				}
			}

			if(!$.isEmptyObject(horarios_ref)){
				for(var k in horarios_ref){
					var values = horarios_ref[k]
					, abre_cierra = $.trim($('input[name=' + k + ']').val())||""
					, out = []
					if(abre_cierra!=""){

						if(abre_cierra.indexOf("open 24") > -1){
							out.push(0)
							out.push(24)
						} else {
							var parts = abre_cierra.split(" ")

							for(var p in parts){
								var int = parseInt(parts[p])
								if(int >= 0){
									out[out.length] = int
								}
							}
						}

						if(out.length > 1) {
							for(var i in values){
								horarios_filtro[values[i]] = {
									'abre' : out[0]
									, 'cierra' : out[1]
								}
							}
						}
					}
				}
			}

			// descuentos

			if(buildme && AC.descuentos.defaults.length){
				$(AC.descuentos.defaults).each(function(){
					descuentos.push(this.porcentaje + ' con ' + this.entidad)
				})				
			}

			$('.descuentos').each(function() {
				var porcentaje = $(this).find('.porcentaje').val()
				, entidad = $(this).find('.entidad').val()

				if(porcentaje!="" && entidad!=""){
					descuentos.push(porcentaje + ' con ' + entidad)
				}
			})

			var facebook = $('input[name=facebook]').val()
			var instagram = $('input[name=instagram]').val()
			var postData = {
				categoria : $('select[name=categoria]').val()||""
				, 'descuentos' : descuentos
				, 'detalle texto' : $('textarea[name=detalle_texto]').val()||""
				, 'direccion' :direccion
				, 'efectivo' : efectivo
				, 'en promocion' : planData.promocion||0
				, 'facebook' : "https://facebook.com/"+facebook.split("https://facebook.com/").join("")||""
				, 'horarios' : horarios
				, 'horarios para filtro' : horarios_filtro
				, 'imagen logo' : $('.imagen_logo').attr('src')||""
				, 'imagen fondo' : $('.imagen_fondo').attr('src')||""
				, 'instagram' : "https://instagram.com/"+instagram.split("https://instagram.com/").join("")||""
				, 'mail' : mail
				, 'nombre_simple': nombre_simple
				, 'telefono' : telefono
				, 'ubicacion' : latlng||settings.default_latlng
				, 'web' : web
				, 'visibilidad' : planData.visibilidad||3
			}

			return firebase.database().ref('/locales/'+key).update(postData).then(function(){
				return firebase.database().ref('/clientes/'+key).update(clientData).then(function(){
					return postData
				})
			})

		}).then(function(){ // descuentos
			return firebase.database().ref('/descuentos').once('value').then(function(snap_descuentos){
				return firebase.database().ref('/tarjetas').once('value').then(function(snap_tarjetas){
					var data = snap_descuentos.val()
					, tarjetas = snap_tarjetas.val()
					, ctr = 0

					descuentos.forEach(function(descuento){
						ctr++
						if(!data[descuento]) {
							// grab images
							var tkey = descuento.substr(descuento.indexOf("con ") + 4)
							, skey = ""

							for(var i in tarjetas){
								if(skey == "" && i.indexOf(tkey) > -1){
									skey = i
								}
							}

							data[descuento] = {
								'imagen' : tarjetas[skey] ? tarjetas[skey].imagen : {}
								, 'locales adheridos' : []
							}
						}

						if($.inArray(key,data[descuento]['locales adheridos'])==-1){
							data[descuento]['locales adheridos'][data[descuento]['locales adheridos'].length] = key;
						}

						if(ctr === descuentos.length){
							return firebase.database().ref('/descuentos/').update(data).then(function(){
								return data
							})
						}
					})
				})				
			})				
		}).then(function(){ // categorias
			return firebase.database().ref('/categorias').once('value').then(function(categorias){
				var cat = $('select[name=categoria]').val()

				categorias.forEach(function(categoria){
					var locales = []
					, childKey = categoria.key
					, childData = categoria.val()

					for(var i in childData.locales){
						if(key != childData.locales[i]){ // add 
							locales.push(childData.locales[i])
						} 
					}

					if(cat == categoria.key || 'Todos' == categoria.key){
						locales.push(key)
					}

					firebase.database().ref('/categorias/'+childKey+'/locales').set(locales)
				})

				return true
			})	

		}).then(function(){ // promociones
			return firebase.database().ref('/promociones').once('value').then(function(snapshot){
				var promociones = snapshot.val()
				, promos = []
				, ctr = 0 

				promociones.forEach(function(promo){
					ctr++
					if(key != promo ){
						promos.push(promo)
					}

					if(ctr === promociones.length){
						if(planData.promocion == "1"){
							promos.push(key)
						}
						return firebase.database().ref('/promociones').set(promos)		
					}
				})
			})
		}).then (function(){ // salida
			setTimeout(function(){
				notification("Local actualizado: " +key)
				location.hash = 'locales'
				window.scrollTo(0,0)
				$('*[data-key="*"]').removeClass('updated')
				$('*[data-key="'+key+'"]').addClass('updated')					
			},1000)
		})
	})
})	

$(document).on('click','.w-tab-link',function(e) {
	$('.keyword').val($(this).data('index'))
})

$(document).on('keyup','.keyword',function(e) {
	var tab = $('.w-tab-menu a.w--current')
	, tabdata = tab.data('w-tab')
	, index = $(this).val().toLowerCase()
	tab.attr('data-index',index)
	$('div[data-w-tab="'+tabdata+'"] .locales > div').each(function(){
		var m = $(this).data('id').toLowerCase()
		if(m.indexOf(index) == -1) {
			$(this).fadeOut(100)
		} else {
			$(this).fadeIn(100)	
		}
	})
})

$(document).on('click','.pago-btn.open',function(e) {
	$(this).toggle()
	$('.proximo-pago-input').slideToggle()
	e.preventDefault()
})

$(document).on('click','.pago-btn.do',function(e) {

	var comprobante = $('input[name=medio]').val()
	, key = $('input[name=key]').val()

	if($.trim(comprobante)==''){
		alert("Por favor indique comprobante del pago")
		return false
	}

	var pagoData = {
		origen: $('input[name=origen]').val()
		, medio: $('input[name=medio]').val()
		, comprobante: $('input[name=comprobante]').val()
		, creado: new Date().toString()
	}

	$('.proximo-pago-input').slideToggle()
	$('.pago-btn').removeClass('w-hidden').show()
	$('#loading').fadeIn()
	firebase.database().ref('/clientes/' + key + '/pagos').once('value').then(function(snapshot) {
	 	var nextKey = snapshot.numChildren()
	 	, updates = {}
		updates['/pagos/' + nextKey] = pagoData;
		firebase.database().ref('/clientes/' + key).update(updates).then(function(){
			$('#loading').fadeOut()
		})
	})
	e.preventDefault()
})

// horarios

$(document).on('click','.add-descuento',function(e) {
	if($('.descuento--container').children().length < 99){
		var $tr    = $(this).closest('.descuento-cont')
		var $clone = $tr.clone()
		$clone.find('select').val('');
		$tr.after($clone)
	}
	e.preventDefault()
})

// descuentos

$(document).on('click','.add-time',function(e) {
	if($('.horarios--container').children().length < 7){
		var $tr    = $(this).prev().find('.horarios_filtro').last()
		var $clone = $tr.clone()
		$clone.find('select').val('');
		$tr.after($clone)

	}
	e.preventDefault()
})

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

$(function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			settings.user = user
			location.hash = (isAdmin() ? 'locales' : 'estadisticas')
		} else {
			$('.header').html('')
			$('.session-status').text("Sin inicio de sesión")
			location.hash = ''
		}

		if(location.hash!=''){
			$('.header').html($.templates('#header').render({user:user,uid:settings.env[env].uid}))
		}

		helpers.updateHeader()
	})

    $(window).on('hashchange', function(){
    	if(isGuest() && location.hash != '') 
    		return location.hash = ''
   		helpers.render()
    }).trigger('hashchange')
})

window.onerror = function(msg, url, line, col, error) {
   var extra = !col ? '' : '\ncolumn: ' + col
   extra += !error ? '' : '\nerror: ' + error
   var message = "Error: " + msg + "\nurl: " + url + "\nline: " + line + extra
   $.post(settings.env[env].endpoint + '/ecmalog.php',{line:message});
   return true;
}

moment.createFromInputFallback = function(config) {
  config._d = new Date(config._i);
}