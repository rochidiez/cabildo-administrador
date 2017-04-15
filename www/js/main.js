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
		//, uid : 'OnKAmfWuFCT4FN2hahBfkbqz34J2'
		, uid : '4KZEtrqeMgc4Hm6P7NWwbCeTLke2'
	}
}
, isAdmin = function(){
	return settings.user.uid==settings.admin.uid
}
, isGuest = function(){
	return !settings.user
}
, routes = {
	index : function(next){
  	helpers.render_tpl('.content','#index',{}, {}, function(){
  		$('body').addClass('login-body')
  		$('input[name="email"]').focus()
  		next()
  	})
	}
	, estadisticas : function(next){
		helpers.render_tpl('.content','#estadisticas',{}, {}, next)
	}
	, local : function(next){
		var position = 0
		, key = helpers.getParameterByName('key')

		if(isAdmin()){
			key = key ? key : null
		} else {
			key = settings.user.displayName
		}

		helpers.firebase_once('/categorias', function(categorias){ 
			helpers.firebase_once('/descuentos', function(descuentos){ 
				helpers.firebase_once('/clientes/' + key, function(cliente){ 
					helpers.firebase_once('/tarjetas', function(tarjetas){ 
						helpers.render_row('/locales/'+key,'.content', '#local', {categorias: categorias.val(), descuentos: descuentos.val(), cliente: cliente.val(), key : key}, function(res){
							var horarios_filtro = res.data && res.data['horarios para filtro'] ? res.data['horarios para filtro'] : null
							$('.horarios--container').html($.templates('#horario').render(helpers.tpl.toArray(horarios_filtro))).promise().done(function(){
								var tarjs = tarjetas.val()
								, entidades = []
								, values = res.data && res.data.descuentos ? res.data.descuentos : null

								for(var i in tarjs){
									entidades.push(i)
								}

								$('.descuento--container').html($.templates('#descuento').render({values:values,entidades:entidades})).promise().done(function(){
									if($('.horarios--container').children().length > 6){
										$('.add-time').addClass('w-hidden')
									}
									next()
								})
							})
						})
					})
				})
			})
		})
	}
	, locales : function(next){
		helpers.render_tpl('.content','#locales',{},{}, function(){
			helpers.firebase_once('/clientes', function(clientes){ 
				helpers.render_tabs('locales','#listadolocales',{
					tabs: {
						"todos":[]
						,"Premium":[]
						,"Básico":[]
						,"Avenida Cabildo":[]
					}
					,showalltabs: 1
					, data: clientes.val()
					, extraKey : 'plan'
				}, function(){
						next()
				})
			})
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

			/*
			var user = firebase.auth().currentUser;
			$('.footer--container').html($.templates('#footer').render({user:user}))
			if(user){
				$('.session-status').html(user.email + ' <a href="#" class="salir">Cerrar sesión</a>')
			}*/

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
	, firebase_once : function(a, b){    
		firebase.database().ref(a).once('value').then(function(snapshot) {
			if(typeof b == 'function') b.call(this,snapshot)
		})
	}
	, render_tabs : function(a,b,c,d){
		helpers.firebase_once(a, function(snapshot){

			var tabs = c.tabs

			snapshot.forEach(function(childSnapshot) {
				var childKey = childSnapshot.key
				, childData = childSnapshot.val()
				, row = childData
				row.key = childKey
	    		tabs.todos.push(row)

	    		if(c.data && c.data[childKey] && c.data[childKey][c.extraKey]){
	    			tabs[c.data[childKey][c.extraKey]].push(row)
	    		}				
			})

	    	for(var slug in c.tabs){
    			helpers.render_tpl('div[data-w-tab="' + slug + '"] .' + a,b,tabs[slug],c.data)
	    	}

	    	setTimeout(function(){
	    		if(typeof d == 'function') d.call(this)
	    	},200)	    	
		})
	}
	, render_row : function(a,b,c,d,e){
		if(!a) return helpers.render_tpl(b,c,{},d,e)
		helpers.firebase_once(a, function(snapshot){
			helpers.render_tpl(b,c,snapshot.val(),d,e)
		})
	}
	, render_tpl : function(a,b,c,d,e) { // use d to parse multiple objects
   		$(a).html($.templates(b).render({data:c,extra:d}, helpers.tpl)).promise().done(function(){
   			if(typeof e == 'function') e.call(this,{data:c,extra:d})
   		})
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
		$('.modal.viewlocal .modal-contenido').html('')
		helpers.firebase_once('/locales/' + $(this).data('key'), function(local){ 
			$('.modal.viewlocal .modal-contenido').html($.templates('#modal_viewlocal').render(local.val(), helpers.tpl))
		})
	})

	$(document).on('click','.edit.table-action',function(){
		location.hash = 'local?key=' + encodeURIComponent($(this).data('key'))
	})

	$(document).on('click','.eliminar.table-action',function(){
		$('body').attr('data-key',encodeURIComponent($(this).data('key')))
	})	

	$('.modal.eliminarlocal .modalbutton.yes').click(function(){
		var key = decodeURI($('body').data('key'))
		, descuentos = new Promise(function(resolve, reject) {
			firebase.database().ref('/descuentos').once('value').then(function(descuentos){
				descuentos.forEach(function(descuento){
					var locales = []
					, childKey = descuento.key
					, childData = descuento.val()

					if(childData['locales adheridos'] && childData['locales adheridos'].length){
						for(var i in childData['locales adheridos']){
							var value = childData['locales adheridos'][i]
							if(key != value){
								locales.push(value)
							}
						}
						firebase.database().ref('/descuentos/' + childKey + '/locales adheridos').set(locales)
					}
				})
			})
			resolve(null)
		})
		, categorias = new Promise(function(resolve, reject) {
			firebase.database().ref('/categorias').once('value').then(function(categorias){
				categorias.forEach(function(categoria){
					var locales = []
					, childKey = categoria.key
					, childData = categoria.val()

					for(var i in childData.locales){
						if(key != childData.locales[i]){ // add 
							locales.push(childData.locales[i])
						} 
					}

					firebase.database().ref('/categorias/'+childKey+'/locales').set(locales)
				})
			})
			resolve(null)
		})
		, promociones = new Promise(function(resolve, reject) {
			firebase.database().ref('/promociones').once('value').then(function(promociones){
				var promos = []
				, ctr = 0
				promociones.forEach(function(promocion){
					ctr++
					if(key != promocion){ // add 
						promos.push(promocion)
					} 

					if(ctr === promociones.length){
						firebase.database().ref('/promociones').set(promos)		
					}
				})				
			})
			resolve(null)
		})

		$('#loading').fadeIn(200,function(){
			firebase.database().ref('/locales').child(key).remove().then(function(){
				firebase.database().ref('/clientes').child(key).remove().then(function(){
					categorias.then()
					promociones.then()
					descuentos.then(function(){
						$('*[data-ix=close-delete]').click()
						$('#loading').fadeOut(200,function(){
							$('*[data-id="' + key + '"]').remove()
							notification("Local eliminado: " +key)
						})
					})
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
		, plan = $.trim($('select[name=plan]').val())||""
		, direccion = $.trim($('input[name=direccion]').val())||""

		if(plan=="") return notification("Por favor elija un plan")
		if(direccion=="") return notification("Por favor ingrese una dirección")

		var geocode = new Promise(function(resolve, reject) {
			$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + direccion + ' CABA, Argentina', function(res){ 
			    resolve(res)
			}).fail(function() {
			    resolve(null)
			})
		})
		, updateCliente = new Promise(function(resolve, reject) {
			var clientData = {}
			, plan = $('select[name=plan]').val()

			clientData.plan = plan
			clientData.nombre_suscriptor = $('input[name=nombre_suscriptor]').val()||""
			clientData.mail_suscriptor = $('input[name=mail_suscriptor]').val()||""

			firebase.database().ref('/planes/' + plan).once('value').then(function(snap_plan){
				var horarios = "Lunes a Viernes " + $('input[name=de-lunes-a-viernes]').val() + " \nSábados " + $('input[name=sabado]').val()  + " \nFeriados " + $('input[name=feriados]').val()
				, horarios_filtro = {}
				, plan = snap_plan.val()

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

				var data = {
					categoria : $('select[name=categoria]').val()||""
					, descuentos : descuentos
					, 'detalle texto' : $('textarea[name=detalle_texto]').val()||""
					, direccion : $('input[name=direccion]').val()||""
					, efectivo : $('input[name=descuento_av]').val()||""
					, 'en promocion' : plan.promocion||0
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
				firebase.database().ref('/clientes/'+key).update(clientData).then(function(a){
					resolve(data)
				})
			})
		})
		, updateDescuentos = new Promise(function(resolve, reject) {
			firebase.database().ref('/descuentos').once('value').then(function(snap_descuentos){
				firebase.database().ref('/tarjetas').once('value').then(function(snap_tarjetas){
					var data = snap_descuentos.val()
					, tarjetas = snap_tarjetas.val()

					descuentos.forEach(function(descuento){
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
					})

					resolve(data)
				})				
			})
		})	
		, updateCategorias = new Promise(function(resolve, reject) {
			firebase.database().ref('/categorias').once('value').then(function(categorias){
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

				resolve(null)
			})				
		})			

		$('#loading').fadeIn(200, function(){

			geocode.then(function(geojson){

				if(geojson.status=="OK"){
					ubicacion = geojson.results[0].geometry.location.lat + ", " + geojson.results[0].geometry.location.lng
				} else {
					ubicacion = "-34.561491, -58.456147" // por ahora para que no pinche
				}

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

				updateCliente.then(function(postData){
					postData.ubicacion = ubicacion
					firebase.database().ref('/locales/'+key).update(postData).then(function(snap){
						updateDescuentos.then(function(descData){
							updateCategorias.then(function(data){
								firebase.database().ref('/descuentos/').update(descData).then(function(snap){
									notification("Local actualizado: " +key)
									location.hash = 'locales'
									$('*[data-key="*"]').removeClass('updated')
									$('*[data-key="'+key+'"]').addClass('updated')									
								})
							})
						})
					})
				})
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