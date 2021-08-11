
//  Merci Ozne#4870

// Vive le js, fuck la commu fivem

(() => {

	ESX             = {};
	ESX.HUDElements = [];

	ESX.setHUDDisplay = function(opacity){
		$('#hud').css('opacity', opacity);
	}

	ESX.insertHUDElement = function(name, index, priority, html, data){

		ESX.HUDElements.push({
			name     : name,
			index    : index,
			priority : priority,
			html     : html,
			data     : data
		})

		ESX.HUDElements.sort((a,b) => {
			return a.index - b.index || b.priority - a.priority;
		})

	}

	ESX.updateHUDElement = function(name, data){

		for(let i=0; i<ESX.HUDElements.length; i++)
			if(ESX.HUDElements[i].name == name)
				ESX.HUDElements[i].data = data;

		ESX.refreshHUD();

	}

	ESX.deleteHUDElement = function(name){

		for(let i=0; i<ESX.HUDElements.length; i++)
			if(ESX.HUDElements[i].name == name)
				ESX.HUDElements.splice(i, 1);

		ESX.refreshHUD();
	}

	ESX.refreshHUD = function(){

		$('#hud').html('');

		for(let i=0; i<ESX.HUDElements.length; i++){
			let html = Mustache.render(ESX.HUDElements[i].html, ESX.HUDElements[i].data);
			$('#hud').append(html);
		}

	}

	ESX.inventoryNotification = function(add, item, count){

		let notif = '';

		if(add)
			notif += 'Tu as reçu +';
		else
			notif += 'On t as enlevé -';

		notif += count + ' ' + item.label;

		let elem = $('<div>'+ notif + '</div>');

		$('#inventory_notifications').append(elem);

		$("#inventory_notifications").animate({right: "10%", opacity: "1"});
		$("#inventory_notifications").delay(3000);
		$("#inventory_notifications").animate({right: "-200px"});

		$(elem).delay(3000).fadeOut(1000, function(){
			elem.remove();
			$("#inventory_notifications").animate({right: "0px"});
			$("#inventory_notifications").animate({opacity: "0"});
		})

	}

	window.onData = (data) => {

		switch(data.action){

			case 'setHUDDisplay' : {
				ESX.setHUDDisplay(data.opacity);
				break;
			}

			case 'insertHUDElement' : {
				ESX.insertHUDElement(data.name, data.index, data.priority, data.html, data.data);
				break;
			}

			case 'updateHUDElement' : {
				ESX.updateHUDElement(data.name, data.data);
				break;
			}

			case 'deleteHUDElement' : {
				ESX.deleteHUDElement(data.name);
				break;
			}

			case 'inventoryNotification' : {
				ESX.inventoryNotification(data.add, data.item, data.count)
			}

		}

	}

	window.onload = function(e){
		window.addEventListener('message', (event) => {
			onData(event.data)
		});
	}

})()