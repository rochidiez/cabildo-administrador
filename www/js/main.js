var notification = function(text){
	$('.mensaje.modal .modal--pcenter').text(text)
	$('.mensaje.modal').css({opacity:1}).fadeIn(100)
}
, settings = {
	notification_delay : 5000
	, pagos : {
		dia_vencimiento : 20
	}
	, user : undefined
	, admin : { 
		paths : ['/admin.html']
		//, uid : 'OnKAmfWuFCT4FN2hahBfkbqz34J2' // infinix
		, uid : '4KZEtrqeMgc4Hm6P7NWwbCeTLke2' // cabildo
	}
}
, isAdmin = function(){
	return settings.user.uid==settings.admin.uid
}
, isGuest = function(){
	return !settings.user
}
, routes = {
	index : function(resolve){
		$('.content').html($.templates('#index').render()).promise().done(function(){
	  		$('body').addClass('login-body')
	  		$('input[name="email"]').focus()
			resolve()
		})
	}
	, estadisticas : function(resolve){
		var data = []
		, count = 0
		, promise = new Promise(function(resolve, reject) { // categorias
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
		})

		promise.then(function(count){
			$('.content').html($.templates('#estadisticas').render({personas:count}))
		})
		.then(resolve)		
	}
	, local : function(resolve){
		var position = 0
		, key = helpers.getParameterByName('key')
		, data = []
		, promise = new Promise(function(resolve, reject) { // categorias
			return firebase.database().ref('/categorias').once('value').then(function(categorias) {
				resolve(categorias)
			})
		})

		if(isAdmin()){
			key = key ? key : null
		} else {
			key = settings.user.displayName
		}

		promise.then(function(categorias){
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
			if(local) local.key = key
			return $('.content').html($.templates('#local').render({data:local,key:key,categorias:data.categorias.val(),cliente:data.cliente.val()},helpers.tpl)).promise().done(function(){
	            var horarios_filtro = local ? local['horarios para filtro'] : null
	            $('.horarios--container').html($.templates('#horario').render(helpers.tpl.toArray(horarios_filtro))).promise().done(function(){
	                var entidades = []
	                , descuentos = [""]

	                data.tarjetas.forEach(function(tarjeta){
	                	entidades.push(tarjeta.key)
	                })

	                data.descuentos.forEach(function(descuento){
	                	var row = descuento.val()
	                	if(row['locales adheridos']){
		                	for(var i in row['locales adheridos']){
		                		if(key==row['locales adheridos'][i]){
		                			descuentos.push(descuento.key)	
		                		}
		                	}
		                }
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

		var data = []
		, promise = new Promise(function(resolve, reject) { // clientes
			return firebase.database().ref('/clientes').once('value').then(function(clientes) {
				resolve(clientes)
			})
		})

		promise.then(function(clientes){
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
            var tabs = {"todos":[]}

            locales.forEach(function(snapshot) {
                var key = snapshot.key
                , local = snapshot.val()
                local.key = key
                local.cliente = data.clientes[key]
                tabs.todos.push(local)

                if(local.plan){
                    tabs[local.plan].push(local)
                }               
            })

            $('.content').html($.templates('#locales').render()).promise().done(function(){
            	for(var i in tabs){
	            	$('.w-tab-pane[data-w-tab="' + i + '"] .locales').html($.templates('#listadolocales').render(tabs[i], helpers.tpl))
	            }
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
		Webflow.require('ix').init([
		  {"slug":"close-viewlocal","name":"close-viewlocal","value":{"style":{},"triggers":[{"type":"click","selector":".viewlocal","stepsA":[{"display":"none","opacity":0,"transition":"opacity 200 ease 0"}],"stepsB":[]}]}},
		  {"slug":"close-mensaje","name":"close-mensaje","value":{"style":{},"triggers":[{"type":"click","selector":".mensaje","stepsA":[{"display":"none","opacity":0,"transition":"opacity 200 ease 0"}],"stepsB":[]}]}},
		  {"slug":"open-viewlocal","name":"open-viewlocal","value":{"style":{},"triggers":[{"type":"click","selector":".viewlocal","stepsA":[{"display":"block"},{"opacity":1,"transition":"opacity 200 ease 0"}],"stepsB":[]}]}},
		  {"slug":"open-mensaje","name":"open-mensaje","value":{"style":{},"triggers":[{"type":"click","selector":".mensaje","stepsA":[{"display":"block"},{"opacity":1,"transition":"opacity 200 ease 0"}],"stepsB":[]}]}},
		  {"slug":"close-delete","name":"close-delete","value":{"style":{},"triggers":[{"type":"click","selector":".eliminarlocal","stepsA":[{"opacity":0.02,"transition":"opacity 200 ease 0"},{"display":"none"}],"stepsB":[]}]}},
		  {"slug":"eliminar-show","name":"eliminar-show","value":{"style":{},"triggers":[{"type":"click","selector":".eliminarlocal","stepsA":[{"display":"block"},{"opacity":1,"transition":"opacity 200 ease 0"}],"stepsB":[]}]}}
		])
	}
	, render : function(){
		$('#loading').fadeIn(200, function(){
			$('body').removeClass()

			var route = location.hash.replace('#','')||'index'
			, route = route.indexOf('?') > -1 ? route.substring(0, route.indexOf('?')) : route

			if(route){
		    	if(typeof routes[route] == 'function'){
		    		routes[route].call(this, function(){
		    			$('#loading').fadeOut(200,function(){
				    		helpers.updateHeader()
				    		helpers.resetWebflow()
		    			})
		    		})
		    	} else {
		    		$('.container').html("No existe la página")
		    	}
		    }
		})
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
		, prop : function(a,b,c){
			var d = b
			if(typeof b=='string') d = c
			if(d && d[a]) return d[a]
			return typeof b=='string' ? b : ""
		}
	}    
}

$(function(){
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
			$('.modal.viewlocal .modal-contenido').html($.templates('#modal_viewlocal').render(local.val(), helpers.tpl))
		})
	})

	$(document).on('click','.edit.table-action',function(){
		location.hash = 'local?key=' + encodeURIComponent($(this).data('key'))
	})

	$(document).on('click','.eliminar.table-action',function(){
		$('body').attr('id',encodeURIComponent($(this).data('key')))
	})	

	// ~remove
	$('.modal.eliminarlocal .modalbutton.yes').click(function(){
		var key = decodeURI($('body').attr('id'))
		, promise = new Promise(function(resolve, reject) { // local and cliente
			return firebase.database().ref('/locales').child(key).remove().then(function(){
				return firebase.database().ref('/clientes').child(key).remove().then(function(){
					resolve(null)
				})
			})
		})

		$('#loading').fadeIn(200, function(){
			promise.then(function(){ // descuentos
				var ctr = 0		
				return firebase.database().ref('/descuentos').once('value').then(function(descuentos){
					descuentos.forEach(function(descuento){
						ctr++
						var locales = []
						, key = descuento.key
						, data = descuento.val()

						if(data['locales adheridos'] && data['locales adheridos'].length){
							for(var i in data['locales adheridos']){
								var value = data['locales adheridos'][i]
								if(key != value){
									locales.push(value)
								}
							}
							firebase.database().ref('/descuentos/' + key + '/locales adheridos').set(locales)
						}

						if(ctr === descuentos.val().length){
							return true
						}					
					})
				})
			}).then(function(){ // categorias
				var ctr = 0	
				return firebase.database().ref('/categorias').once('value').then(function(categorias){
					categorias.forEach(function(categoria){
						ctr++
						var locales = []
						, key = categoria.key
						, data = categoria.val()

						for(var i in data.locales){
							if(key != data.locales[i]){ // add 
								locales.push(data.locales[i])
							} 
						}

						firebase.database().ref('/categorias/'+key+'/locales').set(locales)
						if(ctr === categorias.val().length){
							return true
						}					
					})
				})
			}).then(function(){ // promociones
				return firebase.database().ref('/promociones').once('value').then(function(promociones){
					var promos = []
					, ctr = 0
					promociones.forEach(function(promo){
						var promo = promo.val()
						ctr++
						if(key != promo){ // add 
							promos.push(promo)
						} 

						if(ctr === promociones.val().length){
							return firebase.database().ref('/promociones').set(promos).then(function(){
								return true
							})
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

	// ~local
	$(document).on('click','.save',function(){

		var key = $('input[name="key"]').val()?$('input[name=key]').val():$('input[name=nombre_simple]').val()
		, descuentos = []
		, ubicacion = ""
		, planData = {}
		, plan = $.trim($('select[name=plan]').val())||""
		, direccion = $.trim($('input[name=direccion]').val())||""
		, promise = new Promise(function(resolve, reject) {
			firebase.database().ref('/planes/' + plan).once('value').then(function(snap_plan){
				resolve(snap_plan.val())
			})
		})

		if(plan=="") return notification("Por favor elija un plan")
		if(direccion=="") return notification("Por favor ingrese una dirección")

		$('#loading').fadeIn(200, function(){
			return promise.then(function(data){ //geojson
				planData = data
				return $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + direccion + ' CABA, Argentina', function(geocode){
					if(geocode.status=="OK"){
						ubicacion = geocode.results[0].geometry.location.lat + ", " + geocode.results[0].geometry.location.lng
					} else {
						ubicacion = "-34.561491, -58.456147" // por ahora para que no pinche
					}					
				    return planData
				}).fail(function() {
				    return planData
				})
			}).then(function(chain){ // photos
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
				clientData.plan = plan
				clientData.nombre_suscriptor = $('input[name=nombre_suscriptor]').val()||""
				clientData.mail_suscriptor = $('input[name=mail_suscriptor]').val()||""

				var horarios = "Lunes a Viernes " + $('input[name=de-lunes-a-viernes]').val() + " \nSábados " + $('input[name=sabado]').val()  + " \nFeriados " + $('input[name=feriados]').val()
				, horarios_filtro = {}

				$('.horarios_filtro').each(function() {
					var dia = $(this).find('.dia').val()
					, abre = $(this).find('.abre').val()
					, cierra = $(this).find('.cierra').val()

					if(dia!="" && abre!="" && cierra!=""){
						horarios_filtro[dia] = {
							abre: parseInt(abre)
							, cierra : parseInt(cierra)
						}
					}
				})

				$('.descuentos').each(function() {
					var porcentaje = $(this).find('.porcentaje').val()
					, entidad = $(this).find('.entidad').val()

					if(porcentaje!="" && entidad!=""){
						descuentos.push(porcentaje + ' con ' + entidad)
					}
				})

				var postData = {
					categoria : $('select[name=categoria]').val()||""
					, descuentos : descuentos
					, 'detalle texto' : $('textarea[name=detalle_texto]').val()||""
					, direccion : $('input[name=direccion]').val()||""
					, efectivo : $('input[name=descuento_av]').val()||""
					, 'en promocion' : planData.promocion||0
					, facebook : $('input[name=facebook]').val()||""
					, horarios : horarios
					, 'horarios para filtro' : horarios_filtro
					, 'imagen logo' : $('.imagen_logo').attr('src')||""
					, 'imagen fondo' : $('.imagen_fondo').attr('src')||""
					, instagram : $('input[name=instagram]').val()||""
					, mail : $('input[name=mail]').val()||""
					, nombre_simple: $('input[name=nombre_simple]').val()||""
					, telefono : $('input[name=telefono]').val()||""
					, ubicacion : ubicacion
					, web : $('input[name=web]').val()||""
					, visibilidad : plan.visibilidad||3
				}

				return firebase.database().ref('/locales/'+key).update(postData).then(function(){
					return firebase.database().ref('/clientes/'+key).update(clientData).then(function(){
						return postData
					})
				})

			}).then(function(chain4){ // descuentos
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
			}).then(function(chain5){ // categorias
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
	
			}).then(function(chain6){ // promociones
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
				notification("Local actualizado: " +key)
				location.hash = 'locales'
				$('*[data-key="*"]').removeClass('updated')
				$('*[data-key="'+key+'"]').addClass('updated')					
			})
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
			$('.header').html($.templates('#header').render({user:user,uid:settings.admin.uid}))
		}

		helpers.updateHeader()
	})

    $(window).on('hashchange', function(){
    	if(isGuest() && location.hash != '') 
    		return location.hash = ''
   		helpers.render()
    }).trigger('hashchange')
})

moment.createFromInputFallback = function(config) {
  config._d = new Date(config._i);
}
/*
firebase.auth().createUserWithEmailAndPassword('admin@cabildo.com', 'cab1ld0$.').then(function(user) {
    // [END createwithemail]
    // callSomeFunction(); Optional
    // var user = firebase.auth().currentUser;
    user.updateProfile({
        displayName: 'Administrador',
        photoURL: ''
    }).then(function() {
        // Update successful.
    }, function(error) {
        // An error happened.
    });        
}, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
    } else {
        console.error(error);
    }
    // [END_EXCLUDE]
});	*/