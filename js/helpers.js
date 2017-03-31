var helpers = {
	setParameterByName : function(name,value,url){
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
	, render_tabs : function(a,b,c){
		firebase.database().ref(a).once('value').then(function(snapshot) {
			var tabs = c
			snapshot.forEach(function(childSnapshot) {
				var childKey = childSnapshot.key
				, childData = childSnapshot.val()

				var row = childData
				row.key = childKey
	    		tabs.todos.push(row)
	    		if(row.plan){
	    			tabs[row.plan].push(row)
	    		}				
			})

	    	for(var slug in c){
	    		$('div[data-w-tab="' + slug + '"] .' + a).html($.templates(b).render(tabs[slug]))
	    	}
	    	
	    	setTimeout(function(){
	    		$('#loading').fadeOut(200)	
	    	},200)	    	
		})
	}
	, render_row : function(a,b,c){
		firebase.database().ref(a).once('value').then(function(snap) {
	   		$(b).html($.templates(c).render(snap.val())).promise().done(function(){
	   			$('#loading').fadeOut(200)
	   		})
		})
	}
}