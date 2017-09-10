var debug = {
	locales : function(){
		return firebase.database().ref('/categorias').once('value').then(function(categorias) {
			return firebase.database().ref('/categorias').once('value').then(function(categorias) {
				return firebase.database().ref('/descuentos').once('value').then(function(descuentos) {
					locales.forEach(function(local){
						var _local = local.val()
						, _key = local.key
						, _categorias = categorias.val()
						, _descuentos = descuentos.val()

						if(_local.categoria){
							var catok = 0
							for(var j in _categorias[_local.categoria]['locales']){
								if(_categorias[_local.categoria]['locales'][j] == _key){
									catok = 1
								}
							}
							if(!catok){
								console.log(_key + " no tiene categoria " + _local.categoria)
							}									
						}

						if(_local.descuentos){
							for(var i in _local.descuentos){
								var descok = 0
								if(_descuentos[_local.descuentos[i]]){
									for(var j in _descuentos[_local.descuentos[i]]['locales adheridos']){
										if(_descuentos[_local.descuentos[i]]['locales adheridos'][j] == _key){
											descok = 1
										}
									}
									if(!descok){
										console.log(_key + " no tiene descuento " + _local.descuentos[i])
									}
								}
							}
						}

						if($.trim(_local.ubicacion) == ""){
							console.log(_key + " no tiene ubicación")
						}
						if($.trim(_local.nombre_simple) == ""){
							console.log(_key + " no tiene nombre_simple")
						}
						if($.trim(_local.direccion) == ""){
							console.log(_key + " no tiene direccion")
						}
						if($.trim(_local.efectivo) == ""){
							console.log(_key + " no tiene efectivo")
						}
						if($.trim(_local['imagen fondo']) == ""){
							console.log(_key + " no tiene imagen fondo")
						}
						if($.trim(_local['imagen logo']) == ""){
							console.log(_key + " no tiene imagen logo")
						}
						if($.trim(_local['en promocion']) == ""){
							console.log(_key + " no tiene en promocion")
						}	
						if(!_local['horarios para filtro']){
							console.log(_key + " no tiene horarios para filtro")
						}													
						if($.trim(_local.telefono) == ""){
							console.log(_key + " no tiene telefono")
						}
						if($.trim(_local.visibilidad) == ""){
							console.log(_key + " no tiene visibilidad")
						}																						
					})

					console.log(categorias)
				})
			})

	        /*
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
	        console.log(descuentos)
	        */
	    }
	})
})