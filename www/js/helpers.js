	var helpers = {
		views : {
			render : function(){
				showLoader()

				var p = location.pathname;
			}
		}
		, tpl : {
			toArray : function(object){
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
			, prop : function(a,entry){
				if(entry && entry[a]) return entry[a]
				return ""
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

				var tabs = c
				snapshot.forEach(function(childSnapshot) {
					var childKey = childSnapshot.key
					, childData = childSnapshot.val()
					, row = childData

					row.key = childKey
		    		tabs.todos.push(row)

		    		if(row.plan){
		    			tabs[row.plan].push(row)
		    		}				
				})

		    	for(var slug in c){
		    		helpers.render_tpl('div[data-w-tab="' + slug + '"] .' + a,b,tabs[slug])
		    	}

		    	setTimeout(function(){
		    		if(typeof d == 'function') d.call(this)
		    	},200)	    	
			})
		}
		, render_row : function(a,b,c,d,e){
			if(!a) return helpers.render_extra_tpl(b,c,{},d,e)//helpers.render_tpl(b,c,{},e)
			helpers.firebase_once(a, function(snapshot){
				if($(d).length){
					helpers.render_extra_tpl(b,c,snapshot.val(),d,e)
				}else{
					helpers.render_tpl(b,c,snapshot.val(),e)				
				}
			})
		}
		, render_tpl : function(a,b,c,d) { // use to pass single object
	   		$(a).html($.templates(b).render(c, helpers.tpl)).promise().done(function(result){
	   			if(typeof d == 'function') d.call(this,result)
	   		})
		}
		, render_extra_tpl : function(a,b,c,d,e) { // use to parse multiple objects
	   		$(a).html($.templates(b).render({entry:c,extra:d}, helpers.tpl)).promise().done(function(){
	   			if(typeof e == 'function') e.call(this)
	   		})
		}
	}

    $(window).on('hashchange', function(){
    	if(location.pathname!='/'){
			helpers.views.render()
		}
    })

// end public code