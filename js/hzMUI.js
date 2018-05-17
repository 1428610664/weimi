
/*
	hzMUI.openCamera(callback(ImgChar,src));	打开相机
	hzMUI.getLocalhost(); 获取地理坐标
	hzMUI.galleryImgs(maxLength,callback);	打开本地相册

	



	录音对象
		hzAudio.r.record(fileName,callback)	开始录音
		hzAudio.r.stop()	停止录音

	播放对象
		hzAudio.p.setPath 设置播放路径（调用播放前必须设置播放路径 否则报错）
		hzAudio.p.play(callback)	播放
		hzAudio.p.stop()	停止
		hzAudio.p.pause()	暂停
		hzAudio.p.resume()	回复播放

		hzAudio.p.getDuration()	获取音频长度(s)
		hzAudio.p.getPosition()	获取当前播放位置(s) 未播放返回0

		hzAudio.p.setRoute(type) 设置输出线
		hzAudio.p.seekTo(num)	设置播放位置

*/



var hzMUI = {
	/*
		打开摄像头
			callback(ImgChar,src)	ImgChar : 图片字符流 src : 图片本地路径
	*/ 
	openCamera : function(callback){
		var cmr = plus.camera.getCamera();
		var res = cmr.supportedImageResolutions[0]; 
		var fmt = cmr.supportedImageFormats[0];
		console.log("Resolution: "+res+", Format: "+fmt);
		var _this = this;
		cmr.captureImage( function( path ){
				plus.io.resolveLocalFileSystemURL(path, function(entry) { 
                		var s = entry.toLocalURL();
                		console.log("--------拍照--------"+entry);
                		console.log("=======拍照 - 图片路劲======"+s);
                   		//var ImgChar = _this.uploadHead(s); /*上传图片 s = 图片路径 ImgChar = 图片字符流*/
                   		
                   		plus.zip.compressImage({src:s,dst:s,overwrite:true,quality:10},function(e){
                   			console.log(e.size+"--------------"+e.target);
                   			var ImgChar = _this.uploadHead(e.target);
                   			if(callback)callback(ImgChar,e.target);
                   		},function(){
                   			plus.nativeUI.toast("拍照上传失败");
                   		});
                }, function(path) { 
                	console.log("读取拍照文件错误：" + e.message); 
                });
			},
			function( error ) {
				//plus.nativeUI.toast(error.message);
			},
			{resolution:res,format:fmt}
		);
	},
	uploadHead : function(imgPath) { 
		console.log("imgPath = " + imgPath);

		var image = new Image(),_this = this;
		image.src = imgPath;
		image.onload = function(){
			var imageData = _this.getBase64Image(image);
			console.log(imageData);
			return imageData;	//图片字符流
		}
		
	},
	//将图片压缩转成base64 
    getBase64Image : function(img) { 
        var canvas = document.createElement("canvas"); 
        var width = img.width; 
        var height = img.height; 
        if (width > height) { 
            if (width > 100) { 
                height = Math.round(height *= 100 / width); 
                width = 100; 
            } 
        } else { 
            if (height > 100) { 
                width = Math.round(width *= 100 / height); 
                height = 100; 
            } 
        } 
        canvas.width = width;   /*设置新的图片的宽度*/ 
        canvas.height = height; /*设置新的图片的长度*/ 
        var ctx = canvas.getContext("2d"); 
        ctx.drawImage(img, 0, 0, width, height); /*绘图*/ 
        var dataURL = canvas.toDataURL("image/png", 0.8); 
        return dataURL/*.replace("data:image/png;base64,", "")*/; 
    },
	/*
		获取地理位置
			return [lng,lat]
	*/ 
	getLocalhost : function(callback){
		//获取地理位置  
		var longitude,latitude;
	    navigator.geolocation.getCurrentPosition(function(position){  
	        var coords = position.coords;  
	        //获取精度  
	        longitude = coords.longitude;  
	        //获取纬度  
	        latitude = coords.latitude;  
	        //获取经纬度的精度（以米为单位）  
	        var accuracy = coords.accuracy; 
	        if(callback)callback(longitude,latitude);
	    },function(error){  
	        //错误的回调函数  
	        var errorTypes = {  
	            1: '位置服务被拒绝',  
	            2: '获取不到位置信息',  
	            3: '获取信息超时'  
	        };  
	        plus.nativeUI.toast(errorTypes[error.code]);
	    });  
	    
	},
	/*
		打开本地相册
			maxLength : 最大选择数量
			callback(e.files) : 回调函数 e.files : 图片路径集合
	*/
	galleryImgs : function(maxLength,callback){
		//从相册中选择图片
		plus.gallery.pick( function(e){
			if(callback)callback(e.files);
		},function(e){
			plus.nativeUI.toast("取消");
			console.log( "打开本地相册 - error" );
		},{filter:"image",maximum:maxLength,system:false,multiple:true});
	},
	/*
	 	获取当前位置
	 */
	getLocation : function(callback){
		$("body").append("<div id='locationmap'></div>");
		var map = new plus.maps.Map("locationmap");
		map.showUserLocation(true);
		map.getUserLocation(function(state, pos) {
			if(0 == state){
				console.log(pos.getLng()+","+pos.getLat());
				plus.maps.Map.reverseGeocode(new plus.maps.Point(pos.getLng(),pos.getLat()),{},function(e){
					if(callback)callback(e.coord,e.address);
					return {point:{lng:pos.getLng(),lat:pos.getLat()},address:e.address};
				},function(e){
					plus.nativeUI.toast(e.message);
				});
			}else{  
				plus.nativeUI.toast("定位失败，请确保GPS已经开启");
			}  
		});
	},
	//复制到剪切板
	copyToClip : function(val){
		if (mui.os.android) {
			 var Context = plus.android.importClass("android.content.Context");
		    var main = plus.android.runtimeMainActivity();
		    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
		    plus.android.invoke(clip,"setText",val);
		}else{
			var UIPasteboard  = plus.ios.importClass("UIPasteboard");
			var generalPasteboard = UIPasteboard.generalPasteboard();
			// 设置/获取文本内容:
			generalPasteboard.setValueforPasteboardType(val, "public.utf8-plain-text");
			//var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");   
		}
	},
	getGPS : function(){
		if(mui.os.android){
		    var context = plus.android.importClass("android.content.Context");
		    var locationManager=plus.android.importClass("android.location.LocationManager");
		    var main=plus.android.runtimeMainActivity();
		    var mainSvr=main.getSystemService(context.LOCATION_SERVICE);
		    var status = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
		    return status;
		}
	},
	/*
	 	文件上传
	 		url : 请求路径
	 		file ：文件路径
	 		CB(t) ：成功回调 t.url
	 		CB1(jd)：进度回调
	*/
	uploadData : function(url,file,method,CB,CB1){
		var task = plus.uploader.createUpload(url,{method:"POST",blocksize:204800},function(t,status){
			// 上传完成
			if(CB)CB(status,t);
		});
		task.addFile(file,method);
		task.addEventListener("statechanged",function(){
			var x = task.uploadedSize;//上传数据大小
			var y = task.totalSize;	//文件大小
			if(CB1)CB1(x/y);
		},false);
		task.start();
	},
	/*
		ajax
		hzMUI.ajax({
			url:,
			data:{},
			success:function(data){
				
			}
		});
	*/
	ajax : function(opts){
		mui.ajax(opts.url,{
			type:opts.type?opts.type:"post",
			data:opts.data,
			dataType:opts.dataType?opts.dataType:"json",
			crossDomain:true,
			error:function(xhr,type){
				if(opts.error)opts.error(xhr,type);
			},
			success:function(data){
				plus.nativeUI.toast("请求错误");
				if(opts.success)opts.success(data);
			}
		});
	},
	/*	
		录音对象
			Hzrecorder.record(fileName,callback)	开始录音
			Hzrecorder.stop()	停止录音
	*/	
	recorder : {
		recordObj : null,
		getInstance : function(obj){
			this.recordObj = obj;
			return this;
		},
		/*
			开始录音
				fileName:文件保存路径
				路径：/sdcard/Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder/doc
				callback(recordFile):回调函数 返回录音文件路径
		*/
		record : function(fileName,callback){
			console.log("------录音-------"+fileName); 
			this.recordObj.record({filename:fileName,format:"amr"},function(recordFile){
				if(callback)callback(recordFile);
			},function(e){
				console.log(JSON.stringify(e)+"-----录音报错------"+e.message);
				plus.nativeUI.toast("请开启录音权限");
				plus.screen.lockOrientation("portrait");
				plus.webview.currentWebview().close("pop-out");
			});
		},
		//停止录音
		stop:function(){
			this.recordObj.stop();
		}
	},
	/*
		播放对象
			HzAudioPlay.play(callback)	播放
			HzAudioPlay.stop()	停止
			HzAudioPlay.pause()	暂停
			HzAudioPlay.resume()	回复播放

			HzAudioPlay.getDuration()	获取音频长度(s)
			HzAudioPlay.getPosition()	获取当前播放位置(s) 未播放返回0

			HzAudioPlay.setRoute(type) 设置输出线
			HzAudioPlay.seekTo(num)	设置播放位置
	*/
	audioPlay : {
		playObj : null,
		getInstance : function(obj){
			this.playObj = obj;
			return this;
		},
		//设置播放位置
		seekTo : function(num){
			this.playObj.seekTo(num);
		},
		/*
			设置音频输出线
				type = 0 扬声器(默认)
				type = 1 听筒
		*/
		setRoute : function(type){
			this.playObj.setRoute(type==0?plus.audio.ROUTE_SPEAKER:plus.audio.ROUTE_EARPIECE);
		},
		//获取音频长度
		getDuration : function(){
			return this.playObj.getDuration();
		},
		//获取当前播放位置
		getPosition : function(){
			return this.playObj.getPosition();
		},

		/*
			播放
				播放结束或调用stop方法回调
		*/
		play : function(callback){
			this.playObj.play(function(){
				if(callback)callback();
			},function(e){
				plus.nativeUI.toast(e.message); 
			});
		},
		//停止播放
		stop : function(){
			this.playObj.stop();
		},
		//暂停播放
		pause : function(){
			this.playObj.pause();
		},
		//回复播放
		resume : function(){
			this.playObj.resume();
		}
	}
}