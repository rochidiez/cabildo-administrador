

            /*
            var user = firebase.auth().currentUser;
            $('.footer--container').html($.templates('#footer').render({user:user}))
            if(user){
                $('.session-status').html(user.email + ' <a href="#" class="salir">Cerrar sesión</a>')
            }*/

firebase.auth().createUserWithEmailAndPassword('ay@gmail.com', '4yn0td34d').then(function(user) {
    // [END createwithemail]
    // callSomeFunction(); Optional
    // var user = firebase.auth().currentUser;
    user.updateProfile({
        displayName: 'AY Not Dead',
        photoURL: 'http://www.cordobashopping.com.ar/img/locales/logos/1452183858_aynot.jpg'
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
});	

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

            helpers.render_tpl('.content','#locales',{},{},function(){
                for(var i in tabs){
                    //console.log(i)
                    console.log(tabs[i])
                    console.log('div[data-w-tab="' + i + '"] .locales')
                    console.log($('div[data-w-tab="' + i + '"] .locales'))
                    helpers.render_tpl('.w-tab-pane [data-w-tab="' + i + '"] .locales','#listadolocales',tabs[i],{},function(){
                        next()
                    })
                }
            })
        