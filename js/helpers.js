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
    , getParameterByName : function(name) {
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( window.location.href );
	  if( results == null )
	    return "";
	  else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
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