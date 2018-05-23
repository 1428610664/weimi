(function(w){
	
	/*
		hzDown 支持单文件、多文件下载
			init(urlarr,cb1,cb2,cb3)
				urlarr ：下载路径
					单文件下载为：String Url 
					多文件下载为：Array Url 
				cb1(download,status) ：下载成功失败回调 status = 200为下载成功
				cb2(jd)：下载过程监听回调 jd返回为进度
				cb3()：多文件下载完返回事件
	*/
	function hzDown(){
		
	}
	hzDown.prototype = {
		//初始化 传入长度及下载路径
		init : function(urlarr,cb1,cb2,cb3){
			//判断是否是多文件下载
			if(Object.prototype.toString.call(urlarr) === '[object Array]'){
				this.length = urlarr.length;
				this.urlarr = urlarr;
				this.recursion(cb1,cb2,cb3);
				this.mark = true;
			}else{
				this.mark = false;
				this.downloadWgt(urlarr,cb1,cb2);
			}
		},
		index : 0,
		length : 0,
		urlarr : null,
		mark:true,
		recursion : function(cb1,cb2,cb3){
			console.log(this.index+"----------------"+this.length);
			if(this.index != this.length){
				this.downloadWgt(this.urlarr[this.index],cb1,cb2,cb3);
				
			}else{
				if(cb3)cb3();
				return;
			}
			this.index++;
		},
		task : null,
		downloadWgt : function(url,cb1,cb2,cb3){
			console.log("-----------"+url);
			var _this = this;
			var task = _this.task = plus.downloader.createDownload(url, {filename:"_doc/update/"}, function (download, status) {
				if (status == 200) {
					//console.log("------下载完成-----"+download.filename);
					if(_this.mark)_this.recursion(cb1,cb2,cb3);
				} else {
					//console.log("下载失败");
				}
				if(cb1)cb1(download, status);
			});
			task.addEventListener("statechanged", function (download, status) {
				switch (download.state) {
					case 2:
						console.log("已连接到服务器");
						break;
					case 3:
						var percent = download.downloadedSize / download.totalSize * 100;
						if(cb2)cb2(parseInt(percent));
						//console.log("已下载 " + parseInt(percent) + "%");
						break;
					case 4:
						console.log("下载完成");
						break;
				}
			});
			task.start();
		},
		//取消下载
		abort : function(){
			this.task.abort();
		}
	}

	w.updateApp = {
		verisonCode: 1,	// 更新app时修改
		getUpdate: function(mark){
			var _this = this;
			request.ajax({url: Urls.update, type: "get"}, function(data){
				console.log("getUpdate==========="+JSON.stringify(data));
				if(_this.verisonCode < data.versionCode) {
					if(data.isForce){
						_this.download(data.url);
					}else{
						plus.nativeUI.confirm( data.note, function(i){
							if( 0 == i.index ){
								//_this.download(data.url);
								_this.download(data.url);
							}
						}, "新版本："+data.version, ["立即更新"] );
					}
				}else{
					if(mark) mui.toast("已是最新版本");
				}
			});
		},
		download: function(url){
			try{
				plus.io.resolveLocalFileSystemURL('_doc/', function(entry){
					entry.getDirectory('update', {create:true}, function(dir){
						dir.removeRecursively(function(){ /*成功*/}, function(e){ /*失败*/});
					}, function(ex1){ });
				}, function(ex2){ });
			}catch(epx){}
			//this.test(url);
			plus.nativeUI.showWaiting("正在下载更新文件...", {back: "none"});
			var _this = this;
			var hzDown1 = new hzDown();
			hzDown1.init(url,function(d,s){
				if (s == 200) {
					console.log("下载成功" + d.filename);
					//plus.runtime.install(d.filename);
					_this.installWgt(d.filename);
				}else{
					console.log("下载失败");
					plus.nativeUI.closeWaiting();
				}
			},function(progress){
				console.log("-------------" + progress);
			});
		},
		test: function(url){
			var _this = this;
			plus.nativeUI.showWaiting("正在下载更新文件...", {back: "none"});
			var downloader = plus.downloader.createDownload( url, {filename:"_doc/update/"}, function(d,status){
		        if ( status == 200 ) { 
		        	console.log(d.filename);
		        	_this.installWgt(d.filename);
		        } else {
		            plus.nativeUI.alert("下载更新文件失败！");
		        }
		        plus.nativeUI.closeWaiting();
		    });
		    downloader.addEventListener("statechanged", function(download, status){
		    	switch (download.state) {
					case 2:
						console.log("已连接到服务器");
						break;
					case 3:
						var percent = download.downloadedSize / download.totalSize * 100;
						console.log(percent);
						break;
					case 4:
						console.log("下载完成");
						break;
				}
		    }, false);
		    downloader.start();
		},
		installWgt: function(file){
			plus.nativeUI.showWaiting("正在安装更新文件...", {back: "none"});
		    plus.runtime.install(file,{},function(){
		        plus.nativeUI.closeWaiting();
		        plus.nativeUI.alert("应用资源更新完成！",function(){
		        	plus.runtime.restart();
		        });
		    },function(e){
		    	mui.toast("安装失败");
		    	mui.toast("安装wgt文件失败["+e.code+"]："+e.message);
		        plus.nativeUI.closeWaiting();
		    });
		}
	}
	
})(window);
