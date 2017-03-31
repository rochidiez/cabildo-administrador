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
		firebase.database().ref(a).once('value').then(function(snap) {

			var values = snap.val()
			, tabs = c

			for(var i in values){
				var row = values[i]
				row.key = i
	    		tabs.todos.push(row)
	    		if(row.plan){
	    			tabs[row.plan].push(row)
	    		}
	    	}

	    	for(var slug in tabs){
	    		$('div[data-w-tab="' + slug + '"] .' + a).html($.templates(b).render(tabs[slug]))	
	    	}
		})
	}
	, render_row : function(a,b,c){
		firebase.database().ref(a).once('value').then(function(snap) {
	   		$(b).html($.templates(c).render(snap.val()))	
		})
	}
}