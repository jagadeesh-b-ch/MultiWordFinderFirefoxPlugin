document.addEventListener('DOMContentLoaded', function() {
	
	browser.storage.local.get('autoSearchOpt', function(items){
			if(items.autoSearchOpt){
				browser.runtime.openOptionsPage();
			}else{
				browser.storage.local.set({autoSearchOpt: false}, function(){
					browser.storage.local.set({autoSearchSet: '-1'}, function(){
						browser.runtime.openOptionsPage();
					});
				});
			}
	});

});
