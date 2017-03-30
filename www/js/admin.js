$(function(){

	// bring all and sort.
	var ref = firebase.database().ref('locales')
	ref.once('value').then(function(snap) {

		var values = snap.val()
		, tabs = {"todos":[],"premium":[],"basico":[],"avenida":[]}

		for(var i in values){
			var row = values[i]
    		tabs.todos.push(row)
    		if(row.plan){
    			tabs[row.plan].push(row)
    		}
    	}

		$('div[data-w-tab="todos"] .locales').html($.templates('#local').render(tabs.todos))
		$('div[data-w-tab="premium"] .locales').html($.templates('#local').render(tabs.premium))
		$('div[data-w-tab="basico"] .locales').html($.templates('#local').render(tabs.basico))
		$('div[data-w-tab="avenida"] .locales').html($.templates('#local').render(tabs.avenida))

	})
})