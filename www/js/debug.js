var tests = {
	locales : function(){
		return firebase.database().ref('/categorias').once('value').then(function(categorias) {
			return firebase.database().ref('/descuentos').once('value').then(function(descuentos) {
				return firebase.database().ref('/locales').once('value').then(function(locales) {
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
						}else {
							console.log(_key + " no tiene categoría")
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
						} else {
							console.log(_key + " no tiene descuentos")
						}

						if(!_local.ubicacion || $.trim(_local.ubicacion) == ""){
							console.log(_key + " no tiene ubicación")
						}
						if(!_local.nombre_simple || $.trim(_local.nombre_simple) == ""){
							console.log(_key + " no tiene nombre_simple")
						}
						if(!_local.direccion || $.trim(_local.direccion) == ""){
							console.log(_key + " no tiene direccion")
						}
						if(!_local.efectivo || $.trim(_local.efectivo) == ""){
							console.log(_key + " no tiene efectivo")
						}
						if(!_local['imagen fondo'] || $.trim(_local['imagen fondo']) == ""){
							console.log(_key + " no tiene imagen fondo")
						}
						if(!_local['imagen logo'] || $.trim(_local['imagen logo']) == ""){
							console.log(_key + " no tiene imagen logo")
						}
						if(!_local['en promocion'] || $.trim(_local['en promocion']) == ""){
							console.log(_key + " no tiene en promocion")
						}	
						if(!_local['horarios para filtro']){
							console.log(_key + " no tiene horarios para filtro")
						}													
						if(!_local.telefono || $.trim(_local.telefono) == ""){
							console.log(_key + " no tiene telefono")
						}
						if(!_local.visibilidad || $.trim(_local.visibilidad) == ""){
							console.log(_key + " no tiene visibilidad")
						}																						
					})
				})
			})
	    })
	}
}