//同步载入js
function loadJsSync(url, success) {
    var domScript = document.createElement('script');
    domScript.src = url;
    success = success || function () {};
    domScript.onload = domScript.onreadystatechange = function () {
        if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
            success();
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        }
    }
    document.getElementsByTagName('head')[0].appendChild(domScript);
}

function loadjscssfile(filename, filetype) {
    if (filetype == "js") {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    } else if (filetype == "css") {
        var fileref = document.createElement('link');
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}
loadjscssfile("http://play.7724.com/olgames/code_statistics/css/7724box.css", "css");
loadjscssfile("http://static.bshare.cn/b/buttonLite.js#style=-1&uuid=&pophcol=2&lang=zh", "js");
loadjscssfile("http://static.bshare.cn/b/bshareC0.js", "js");

var Wwidth = document.documentElement.clientWidth; //网页可见区域宽度
var Hheight = document.documentElement.clientHeight;//网页可见区域高度



//判断是否为横竖屏
if(Hheight>Wwidth)
{
	var div7724 = document.createElement("div");
	div7724.id = "loading7724";
	div7724.style.position = "fixed";
	div7724.style.width = "100%";
	div7724.style.height = "100%";
	div7724.style.zIndex = "9999";
	div7724.style.background = "#5bccdc";
	div7724.style.left = "0";
	div7724.style.top = "0";
	div7724.style.textAlign = "center";
	div7724.innerHTML = '<img src="http://play.7724.com/olgames/code_statistics/img/7724loading.png" style="width:60%;margin:25% auto 0 auto" />';
	document.getElementsByTagName("body")[0].appendChild(div7724);
	var time7724 = 1;
}else{
	var div7724 = document.createElement("div");
	div7724.id = "loading7724";
	div7724.style.position = "fixed";
	div7724.style.width = "100%";
	div7724.style.height = "100%";
	div7724.style.zIndex = "9999";
	div7724.style.background = "#5bccdc";
	div7724.style.left = "0";
	div7724.style.top = "0";
	div7724.style.textAlign = "center";
	div7724.innerHTML = '<img src="http://play.7724.com/olgames/code_statistics/img/7724loading.png" style="width:50%;margin:1% auto 0 auto" />';
	document.getElementsByTagName("body")[0].appendChild(div7724);
	var time7724 = 1;
}

function wait7724() {
    if (time7724 == 1) {
        setTimeout("wait7724()", 3000);
        time7724--
    } else {
        div7724.style.display = "none"
    }
}

function source_web(){
	var ua = navigator.userAgent;
	if(ua.match(/<7724-iosweb-hezi>/)){
		return '7724isohezi';
	}
	return '';
}


wait7724();
var overlays_hx1 = '';
var overlays_sx1 = '';
var overlays7724 = document.createElement("div");
overlays7724.id = "overlays7724";
document.getElementsByTagName("body")[0].appendChild(overlays7724);


//获取当前URL
var heziURL = (window.location.href);
//判断URL是否有包含指定字符串
if(heziURL.indexOf("source=7724hezi") < 0){
//加载浮窗
var meURL = encodeURIComponent(window.location.href);
var doc = document;
var sign7724, game_id;
var mescript7724 = doc.createElement("script");
mescript7724.setAttribute("src", 'http://www.7724.com/api/gameinfo?url=' + meURL + '&callback=overlaysdata7724');
var heads = doc.getElementsByTagName("head");
if (heads.length) heads[0].appendChild(mescript7724);
else doc.documentElement.appendChild(mescript7724);
overlaysdata7724 = function(data) {
	//注释掉悬浮菜单
    /*var channel_flag = data.channel_flag;
    if (data.result == 1) {
    	var xfk_s,xfk_h;
    	var source=source_web();
    	
    	sign7724 = data.sign;
        game_id = data.game_id;
        
    	xfk_s='<div class="float_S" id="newfloat"><div class="F_7724" id="float7724" ></div><div class="S_con" id="S_con"><a href="http://m.7724.com/" class="home" id="home">首页</a><a href="javascript:void(0)" class="my" id="my">我的</a><a href="http://www.7724.com/huodong.html" class="activity" id="me_activity">活动</a><a href="javascript:void(0)" class="shared" id="me_shared">分享</a><a href="javascript:void(0)" class="collect" id="testenshrine">收藏</a></div></div>';
    	xfk_h='<div class="float_H" style=""  id="newfloat"><div class="F_7724" id="float7724"></div><div class="H_con" id="H_con"><a href="http://m.7724.com/" class="home" id="home">首页</a><a href="javascript:void(0)" class="my" id="my">我的</a><a href="http://www.7724.com/huodong.html" class="activity" id="me_activity">活动</a><a href="javascript:void(0)" class="shared" id="me_shared">分享</a><a href="javascript:void(0)" class="collect" id="testenshrine">收藏</a></div></div>';
    	if(data.ph == 2){
    		xfk_s='<div class="float_S" id="newfloat"><div class="F_7724" id="float7724" ></div><div class="S_con" id="S_con"><a href="http://m.7724.com/" class="home" id="home">首页</a><a href="javascript:void(0)" class="my" id="my">我的</a><a href="http://www.7724.com/huodong.html" class="activity" id="me_activity">活动</a><a href="http://www.7724.com/rank/' + game_id + '.html" class="rank" id="me_rank">排行</a><a href="javascript:void(0)" class="shared" id="me_shared">分享</a><a href="javascript:void(0)" class="collect" id="testenshrine">收藏</a></div></div>';
    		xfk_h='<div class="float_H" style="" id="newfloat"><div class="F_7724" id="float7724" ></div><div class="H_con" id="H_con"><a href="http://m.7724.com/" class="home" id="home">首页</a><a href="javascript:void(0)" class="my"  id="my">我的</a><a href="http://www.7724.com/huodong.html" class="activity" id="me_activity">活动</a><a href="http://www.7724.com/rank/' + game_id + '.html" class="rank" id="me_rank">排行</a><a class="shared"  id="me_shared">分享</a><a href="javascript:void(0)" class="collect" id="testenshrine">收藏</a></div></div>';
    	}
    	if(source=='7724isohezi' || channel_flag == 0){
    		xfk_s='';
    		xfk_h='';
    	}   	
        if (data.ph == 2) {
            if (data.msg == 1) {
                overlays7724.innerHTML = xfk_s;
                document.getElementById("float7724").addEventListener("touchstart", show_overlays_sx, false);
                document.getElementById("my").addEventListener("touchstart", testmy, false);
                document.getElementById("me_activity").addEventListener("touchstart", function() {
                    window.location.href = "http://www.7724.com/huodong.html";
                }, false);
                document.getElementById("me_rank").addEventListener("touchstart", function() {
                    window.location.href = 'http://www.7724.com/rank/' + game_id + '.html';
                }, false);
                document.getElementById("me_shared").addEventListener("touchstart", show_share, false);
                document.getElementById("testenshrine").addEventListener("touchstart", testenshrine, false);
            } else {
                overlays7724.innerHTML = xfk_h;
                document.getElementById("float7724").addEventListener("touchstart", show_overlays_hx, false);
                document.getElementById("my").addEventListener("touchstart", testmy, false);
                document.getElementById("me_activity").addEventListener("touchstart", function() {
                    window.location.href = "http://www.7724.com/huodong.html";
                }, false);
                document.getElementById("me_rank").addEventListener("touchstart", function() {
                    window.location.href = 'http://www.7724.com/rank/' + game_id + '.html';
                }, false);
                document.getElementById("me_shared").addEventListener("touchstart", show_share, false);
                document.getElementById("testenshrine").addEventListener("touchstart", testenshrine, false);
            }
        } else {
            if (data.msg == 1) {
                overlays7724.innerHTML = xfk_s;
                document.getElementById("float7724").addEventListener("touchstart", show_overlays_sx, false);
                document.getElementById("my").addEventListener("touchstart", testmy, false);
                document.getElementById("me_activity").addEventListener("touchstart", function() {
                    window.location.href = "http://www.7724.com/huodong.html";
                }, false);
                document.getElementById("me_shared").addEventListener("touchstart", show_share, false);
                document.getElementById("testenshrine").addEventListener("touchstart", testenshrine, false);
            } else {
                overlays7724.innerHTML = xfk_h;
                document.getElementById("float7724").addEventListener("touchstart", show_overlays_hx, false);
                document.getElementById("my").addEventListener("touchstart", testmy, false);
                document.getElementById("me_activity").addEventListener("touchstart", function() {
                    window.location.href = "http://www.7724.com/huodong.html";
                }, false);
                document.getElementById("me_shared").addEventListener("touchstart", show_share, false);
                document.getElementById("testenshrine").addEventListener("touchstart", testenshrine, false);
            }
        }
    }*/
}
}

//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}
var Uid = getCookie("uid");

if(heziURL.indexOf("source=7724hezi") < 0){
var loginbox = '<div class="tishi_box" id="tishi_box"><div class="metitle">操作提示<em class="close" id="newclose" onclick="newclose()"></em></div><p>亲,您还未登录,登录可参与排行和收藏游戏哦!没有账号，点击注册</p><a id="melogin" class="sure2" href="http://m.7724.com/user/login/?url=' + meURL + '" style="display: block;">登录<span></span></a><a id="meregister" class="sure2" href="http://m.7724.com/user/register/?url=' + meURL + '" style="display: block;">注册</a></div>';
var registerbox = '<div class="game_box7724" id="tishi_box"><div class="game_login"><div class="game_tit">7724用户注册<span class="closed" id="newclose" onclick="newclose()"></span></div><ul><li><span class="phone"></span><p><input type="text" class="input_game" placeholder="请输入11位手机号码" id="register_phone"><em class="wrong" style="display:none;">手机号码错误</em></p></li><li><span class="mess"></span><p> <input type="text" class="input_game" placeholder="请输入手机验证码" id="register_yzm"><a class="yzm"  id="getCode">获取验证码</a></p></li><li><span class="psw"></span><p> <input type="password" class="input_game" placeholder="请输入密码" id="register_psw"><em class="wrong" style="display:none;">密码错误</em></p></li><li><div class="register_man"><a href="javascript:void(0)"  id="boyregister">男生注册</a></div><div class="register_woman"><a href="javascript:void(0)"  id="girlregister">女生注册</a></div></li><li><a href="javascript:void(0)" class="register"  id="openlogin">登录</a></li></ul></div></div>';

}
function loginmeme() {
    document.getElementById("newclose").addEventListener("touchstart", newclose, false);
    document.getElementById("melogin").addEventListener("touchstart", function() {
        window.location.href = "http://m.7724.com/user/login/?url=" + meURL + "";
    }, false);
    document.getElementById("meregister").addEventListener("touchstart", function() {
        window.location.href = "http://m.7724.com/user/register/?url=" + meURL + "";
    }, false);
    /*document.getElementById("testlogin").addEventListener("touchstart",testlogin,false);
	document.getElementById("openregister").addEventListener("touchstart",openregister,false);

	document.getElementById("forget2").addEventListener("touchstart",function(){
		  window.location.href="http://m.7724.com/user/findpwd";
		},false);

	document.getElementById("my_phone").addEventListener("touchstart",function(){
		 this.focus();

		 this.onkeyup=function(){
			window.event.returnValue = false;
			 }
		this.onkeydown=function(){

			window.event.returnValue = false;
			}
		},false);
	document.getElementById("my_password").addEventListener("touchstart",function(){
		 this.focus();
		  this.style.imeMode='auto'
		},false);*/
}

function registermeme() {
    document.getElementById("newclose").addEventListener("touchstart", newclose, false);
    document.getElementById("boyregister").addEventListener("touchstart", boyregister, false);
    document.getElementById("girlregister").addEventListener("touchstart", girlregister, false);
    document.getElementById("openlogin").addEventListener("touchstart", openlogin, false);
    document.getElementById("getCode").addEventListener("touchstart", getCode, false);
    document.getElementById("register_phone").addEventListener("touchstart", function() {
        this.focus();
    }, false);
    document.getElementById("register_yzm").addEventListener("touchstart", function() {
        this.focus();
        this.style.imeMode = 'auto'
    }, false);
    document.getElementById("register_psw").addEventListener("touchstart", function() {
        this.focus();
        this.style.imeMode = 'auto'
    }, false);
}
var share7724 = document.createElement("div");
share7724.id = "share7724";
document.getElementsByTagName("body")[0].appendChild(share7724);
share7724.innerHTML = '<div class="game_login" style="display:none;" id="sharebox7724"><div class="game_tit">分享给您的小伙伴<span class="closed" id="close_share" onclick="close_share()"></span></div><div class="share"><p><a href="javascript:;" class="qq"  onclick="javascript:bShare.share(event,\'qqim\');return false;" id="me_qq">QQ好友</a></p><p><a href="javascript:;" class="zone" onclick="javascript:bShare.share(event,\'qzone\');return false;" id="me_zone">QQ空间</a></p><p><a href="javascript:;" class="sina" onclick="javascript:bShare.share(event,\'sinaminiblog\');return false;" id="me_sina">新浪微博</a></p><p><a href="javascript:;" class="tenxun" onclick="javascript:bShare.share(event,\'qqmb\');return false;" id="me_tenxun">腾讯微博</a></p></div></div>';
if (document.getElementById("sharebox7724").style.display = "none") {
    document.getElementById("close_share").addEventListener("touchstart", close_share, false);
    document.getElementById("me_qq").addEventListener("touchstart", function() {}, false);
    document.getElementById("me_zone").addEventListener("touchstart", function() {}, false);
    document.getElementById("me_sina").addEventListener("touchstart", function() {}, false);
    document.getElementById("me_tenxun").addEventListener("touchstart", function() {}, false);
}
//点击我的
function testmy() {
    if (Uid) {
        window.location.href = "http://m.7724.com/user/index";
    } else {
        //box7724.innerHTML = loginbox;
		overlayshide();
		alert("您未登录，请登录");
		window.location.href="http://m.7724.com/user/login?url=http%3A%2F%2Fplay.7724.com%2Folgames%2Fbdxpg%2F?url=http%3A%2F%2Fplay.7724.com%2Folgames%2Fbdxpg%2F";

        //loginmeme();
    }
}
//点击收藏
function testenshrine() {
    if (Uid) {
        var doc = document;
        var mescript = doc.createElement("script");
        mescript.setAttribute("src", 'http://www.7724.com/api/collect?gameid=' + game_id + '&callback=enshrinedata');
        var heads = doc.getElementsByTagName("head");
        if (heads.length) heads[0].appendChild(mescript);
        else doc.documentElement.appendChild(mescript);
    } else {
        //box7724.innerHTML = loginbox;
        overlayshide();
        //loginmeme();
		alert("您未登录，请登录");
		window.location.href="http://m.7724.com/user/login?url=http%3A%2F%2Fplay.7724.com%2Folgames%2Fbdxpg%2F?url=http%3A%2F%2Fplay.7724.com%2Folgames%2Fbdxpg%2F";
    }
}
enshrinedata = function(data) {
    if (data.result == 1) {
        alert("收藏成功");
        overlayshide();
    } else {
        alert("该游戏已经收藏过");
        overlayshide();
    }
}
//点击分享
function show_share() {
    document.getElementById("sharebox7724").style.display = "block";
    overlayshide();
}
//浮窗缩进
function overlayshide() {
    var hx7724 = document.getElementById("newfloat");
    var float7724 = document.getElementById("float7724");
    if (document.getElementById("S_con")) {
        document.getElementById("S_con").className = "S_con";
    }
    if (document.getElementById("H_con")) {
        document.getElementById("H_con").className = "H_con";
    }
    hx7724.style.left = "-16px";
    float7724.className = "F_7724";
}
//关闭分享
function close_share() {
    document.getElementById("sharebox7724").style.display = "none";
}
//竖向弹窗
function show_overlays_sx() {
    var hx7724 = document.getElementById("newfloat");
    var float7724 = document.getElementById("float7724");
    var S_con = document.getElementById("S_con");
    if (float7724.className == "F_7724") {
        hx7724.style.left = "16px";
        S_con.className += " newS_con";
        float7724.className += " newF_7724";
    } else {
        hx7724.style.left = "-16px";
        S_con.className = "S_con";
        float7724.className = "F_7724";
    }
}
//横向弹窗
function show_overlays_hx() {
    var hx7724 = document.getElementById("newfloat");
    var float7724 = document.getElementById("float7724");
    var H_con = document.getElementById("H_con");
    if (float7724.className == "F_7724") {
        hx7724.style.left = "16px";
        hx7724.style.width = "66%";
        H_con.className += " newH_con";
        float7724.className += " newF_7724";
    } else {
        hx7724.style.left = "-16px";
        hx7724.style.width = "auto";
        H_con.className = "H_con";
        float7724.className = "F_7724";
    }
}



//提交登录
function testlogin() {
    var my_phone = document.getElementById("my_phone").value;
    var my_password = document.getElementById("my_password").value;
    if (my_phone == "" || my_phone == null) {
        alert("手机号码不能为空");
        document.getElementById("my_phone").focus();
        return false;
    }
    if (my_password == "" || my_password == null) {
        alert("密码不能为空");
        document.getElementById("my_password").focus();
        return false;
    }
    var doc = document;
    var mescript = doc.createElement("script");
    mescript.setAttribute("src", 'http://www.7724.com/api/login?mobile=' + my_phone + '&passwd=' + my_password + '&callback=logindata');
    var heads = doc.getElementsByTagName("head");
    if (heads.length) heads[0].appendChild(mescript);
    else doc.documentElement.appendChild(mescript);
}
logindata = function(data) {
    if (data.result == 1) {
        tishi_box.style.display = "none";
        alert(data.msg);
        window.location.reload();
    } else {
        alert(data.msg);
    }
}
//打开注册窗口
function openregister() {
    box7724.innerHTML = registerbox;
    registermeme();
}
//打开登录窗口
function openlogin() {
    box7724.innerHTML = loginbox;
    loginmeme();
}
//男生注册
function boyregister() {
    var register_phone = document.getElementById("register_phone").value;
    var register_yzm = document.getElementById("register_yzm").value;
    var register_psw = document.getElementById("register_psw").value;
    var register_sex = 1;
    var paw_length = document.getElementById("register_psw").value.length;
    if (register_phone == "" || register_phone == null) {
        alert("手机号码不为空");
        document.getElementById("register_phone").focus();
        return false;
    }
    if (register_yzm == "" || register_yzm == null) {
        alert("验证码为空");
        document.getElementById("register_yzm").focus();
        return false;
    }
    if (register_psw == "" || register_psw == null) {
        alert("密码不为空");
        document.getElementById("register_psw").focus();
        return false;
    }
    if (paw_length < 6) {
        alert("密码不能小于六位数");
        document.getElementById("register_psw").focus();
        return false;
    }
    var doc = document;
    var mescript = doc.createElement("script");
    mescript.setAttribute("src", 'http://www.7724.com/api/register?mobile=' + register_phone + '&yzm=' + register_yzm + '&passwd=' + register_psw + '&sex=' + register_sex + '&callback=resgisterdata');
    var heads = doc.getElementsByTagName("head");
    if (heads.length) heads[0].appendChild(mescript);
    else doc.documentElement.appendChild(mescript);
}
//女生注册
function girlregister() {
    var register_phone = document.getElementById("register_phone").value;
    var register_yzm = document.getElementById("register_yzm").value;
    var register_psw = document.getElementById("register_psw").value;
    var register_sex = 0;
    var paw_length = document.getElementById("register_psw").value.length;
    if (register_phone == "" || register_phone == null) {
        alert("手机号码不为空");
        document.getElementById("register_phone").focus();
        return false;
    }
    if (register_yzm == "" || register_yzm == null) {
        alert("验证码为空");
        document.getElementById("register_yzm").focus();
        return false;
    }
    if (register_psw == "" || register_psw == null) {
        alert("密码不为空");
        document.getElementById("register_psw").focus();
        return false;
    }
    if (paw_length < 6) {
        alert("密码不能小于六位数");
        document.getElementById("register_psw").focus();
        return false;
    }
    var doc = document;
    var mescript = doc.createElement("script");
    mescript.setAttribute("src", 'http://www.7724.com/api/register?mobile=' + register_phone + '&yzm=' + register_yzm + '&passwd=' + register_psw + '&sex=' + register_sex + '&callback=resgisterdata');
    var heads = doc.getElementsByTagName("head");
    if (heads.length) heads[0].appendChild(mescript);
    else doc.documentElement.appendChild(mescript);
}
resgisterdata = function(data) {
    if (data.result == 1) {
        tishi_box.style.display = "none";
        alert(data.msg);
        window.location.reload();
    } else {
        alert(data.msg);
    }
}
//获取验证码
function getCode() {
    var mobile = document.getElementById("register_phone").value;
    if (!checkmobile()) {
        alert("请输入正确的手机号码!");
        return;
    }
    var doc = document;
    var mescript = doc.createElement("script");
    mescript.setAttribute("src", 'http://www.7724.com/api/mobilecode?mobile=' + mobile + '&callback=codedata');
    var heads = doc.getElementsByTagName("head");
    if (heads.length) heads[0].appendChild(mescript);
    else doc.documentElement.appendChild(mescript);
}
codedata = function(data) {
    alert(data.msg);
}

function checkmobile() {
    var mobile = document.getElementById("register_phone").value;
    var my = false;
    var partten = /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[0-9]\d{8}|18[0-9]\d{8}|14[0-9]\d{8}$/;
    if (partten.test(mobile)) my = true;
    if (mobile.length != 11) my = false;
    if (!my) {
        return false;
    }
    return true;
}
/*<img src="http://play.7724.com/olgames/code_statistics/img/meoverlogo.png" style="height:60px;" >*/
var meURL = window.location.href;

function loadmeover() {
    return ; //2017-3-9 移除自定义的结束提示
	if(heziURL.indexOf("source=7724hezi") < 0){
    var mehtml = '<p style="text-align: center; margin: 16px;">' + '<br>' + '<a href="javascript:void(0);" id="closeover7724" onclick="closeover7724()"><button class="mebutton meblue">返回游戏</button></a>' + '</p>' + '<p>&nbsp;</p>' + '<p style="text-align: center; margin: 16px;">' + '<a href="http://phover.open.7724.com/lmybl/game?flag=phover" id="mya1"><button class="mebutton meblue">联盟与部落</button></a>' + '</p>' + '<p style="text-align: center; margin: 16px;">' + '<a href="http://phover.open.7724.com/wy.html" id="mya2"><button class="mebutton meblue">更多游戏</button></a></p>' + '<p>&nbsp;</p>' + '<p style="text-align: center; padding: 2px 16px;">' + '<a href="javascript:void(0);" id="mead_pic" onclick="openmeapk()"><img style="max-width: 210px;" id="wx-qr-img" src="http://play.7724.com/olgames/code_statistics/img/meover7724.png"><br><button class="mebutton megreen">立即启动</button></a>' + '</p>';
    var meover7724 = document.createElement("div");
    meover7724.id = "meover7724";
    document.getElementsByTagName("body")[0].appendChild(meover7724);
    meover7724.innerHTML = mehtml;
    document.getElementById("mead_pic").addEventListener("touchstart", openmeapk, false);
    document.getElementById("closeover7724").addEventListener("touchstart", closeover7724, false);
    document.getElementById("mya1").addEventListener("touchstart", function() {
        window.location = "http://i.7724.com/user/Sdklogin3?qqesid=1411"
    }, false);
    document.getElementById("mya2").addEventListener("touchstart", function() {
        window.location = "http://i.7724.com/user/Sdklogin3?qqesid=983"
    }, false);
	}
}
function openmeapk() {
    window.location = "http://www.7724.com/app/api/heziDownload/id/16";
}

function closeover7724() {
    var op = document.getElementById("meover7724");
    op.parentNode.removeChild(op);
}
function GetParms(){
    var args = new Object();
    var query = location.search.substring(1); //获取查询串
    var pairs = query.split("&"); //在逗号处断开
    for (var i = 0; i < pairs.length; i++){
        var pos = pairs[i].indexOf('='); //查找name=value
        if (pos == -1) continue; //如果没有找到就跳过
        var argname = pairs[i].substring(0, pos); //提取name
        var value = pairs[i].substring(pos + 1); //提取value
        args[argname] = unescape(value); //存为属性
    }
    return args;
}
//创建底部广告
function createAd(){
	var params = GetParms();
	var url = 'http://www.7724.com/api/standalonebottomad?callback=?';
    $.getJSON( url,{f:params['flag']},function(respon){
        if(respon.code == 1){
            var div = document.createElement('div');
            var url = respon.url;
            var img = respon.img;
            div.id="button_da_wp";
            div.innerHTML = '<div id="button_da_wp" style="width: 100%;background: rgba(0,0,0,0.3);position: fixed;z-index: 10000;bottom: 0;left: 0;text-align: center;"><span onclick="javascript:hideAdd();" style="position: absolute;background: url(http://static.pipaw.com/assets/img/7788.png) no-repeat;width: 22px;height: 20px;right: 0;top: -20px;cursor: pointer;"></span>'+
            '<a href="'+url+'" rel="nofollow"><img style="max-width: 640px;" width="100%" src="'+img+'"></a></div>';
            document.body.appendChild(div);
        }else{
            console.log('获取数据失败,无法创建底部广告');
        }
    } );

    
}
//隐藏广告
function hideAdd(){
    document.getElementById("button_da_wp").style.display="none";
}

(function(){ 
    //显示广告
    if( ! /7724hezi/.test(navigator.userAgent) ){
        loadJsSync('http://play.7724.com/olgames/code_statistics/zepto.min.js', function(){
            createAd();
        });
    }
})();

