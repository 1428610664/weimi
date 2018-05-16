
var request = {
	ajax :function(opts, success, error, isShowWaiting) {
		if(isShowWaiting) plus.nativeUI.showWaiting();
		mui.ajax(opts.url, {
			data: opts.data,
			dataType: 'json',
			type: opts.type ? opts.type : 'post',
			timeout: 10000,
			success: function(data) { 
				if(isShowWaiting) plus.nativeUI.closeWaiting();
				/* 登录验证
					... 
				*/
				if (success) success(data);
			},
			error: function(xhr, type, errorThrown) {
				if(isShowWaiting) plus.nativeUI.closeWaiting();
				console.log(opts.url+"=====error =====" + type +"============" + JSON.stringify(opts.data));
				if (error) success(xhr);
			}
		});
	},
	post: function(url, data, success){
		this.ajax({url: url, data: data}, success);
	},
	get: function(url, data, success){
		this.ajax({url: url, data: data, type: "get"}, success);
	}
}
