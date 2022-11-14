// ==UserScript==
// @name         淘宝采集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动进行淘宝采集功能-定制化
// @author       You
// @match        https://t.chachazhan.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// ==/UserScript==
 
this.$ = this.jQuery = jQuery.noConflict(true);
let scriptjs = document.createElement('script');
    scriptjs.setAttribute('type', 'text/javascript');
    scriptjs.src = "https://www.layuicdn.com/layer-v3.5.1/layer.js";
    document.documentElement.appendChild(scriptjs);
var url ="http:127.0.0.1:8080/cj/";
(function() {
    'use strict';
 
    // Your code here...
    /**
     * 进入后 弹窗 根据要求写入本地缓存。
     * 然后先遍历所有的类型 根据类型查询
     * 每次查询记录次数
     * 当查询次数为100时
     * 记录当前下标 存储数据 并切换店铺
     * 切换店铺时 判断当前店铺名称 如果是主账号 切换到对应的店铺 如果是子账号 先切换主账号
     * 所有店铺通过数组存储在本地缓存
     *
     *
     *
     *
     *
     */
    //先判断是否存在配置数据
 
    //当前任务是否暂停
    localStorage.setItem('zanting', 'false');
    // console.log(pachong)
    //延时执行能正常的加载
    setTimeout(function () {
 
 
        // var xx= 0
        // //定时执行
 
        var thisUrl = "https://t.chachazhan.com/app/#/titleOptimize/searchKeyword"
        var isUrl = window.location.href
        if(thisUrl != isUrl){
            //进入到官网以后跳转到对应的搜索词库页面
            window.location.href = "https://t.chachazhan.com/app/#/titleOptimize/searchKeyword"
        }
        var token = localStorage.mc_auth_token
        console.log('---------',token)
        addys()
        var ww= 1;
 
        var ws = new WebSocket("ws://127.0.0.1:8080/websocket/message");
 
        ws.onopen = function(evt) {
            console.log("Connection open ...");
            ws.send("Hello WebSockets!");
        };
 
        ws.onmessage = function(evt) {
            console.log("Received Message: " + evt.data);
            var type = evt.data;
            var lanjie =  localStorage.getItem("lanjie");
 
            if (type == "1" && lanjie !="true") {
                location.reload(true)
                localStorage.setItem("lanjie","true");
            }
            if(type == "1" && lanjie =="true"){
                $.get(url+"upDateToken",{token},function(res){
                    localStorage.setItem("lanjie","false");
                })
            }
            if(type == "0" && lanjie !="true"){
                //先切换用户 并写入lanjie为true
                //暂时endCj进行终结
                $.get(url+"endCj",{token},function(res){
 
                })
                window.location.href = url + "export";
            }
            if(type == "0" && lanjie =="true"){
                $.get(url+"endCj",{token},function(res){
 
                })
                window.location.href = url + "export";
            }
            if (type == "2" ) {
                $.get(url+"endCj",{token},function(res){
 
                })
                window.location.href = url + "export";
            }
 
        };
 
     }, 1000*2);
 
})();
 
/**增加元素 */
function addys() {
    //获取本地的缓存值
    // var pachong1 = JSON.parse(localStorage.getItem("pachong"))
    $('.flex-items-center.icons').prepend('<button type="button" id = "tanchu" class="ant-btn mr-2" ><span>配置管理</span></button>')
    $('.flex-items-center.icons').on('click','#tanchu',function(e){
        var config = {};
 
        $.ajaxSettings.async = false;
        $.get(url+"getConfig",'',function(res){
            console.log(res);
            config = res.data
        })
        var bioadan = '<div style="text-align:right"><form  id="form1">'+
        '    <label for="fname">大于1千小于2千：</label>'+
        '    <input type="number" id="da1xiao2" name="da1xiao2" value="'+config.da1xiao2+'"><br><br>'+
        '    <label for="fname">大于2千小于5千：</label>'+
        '    <input type="number" id="da2xiao5" name="da2xiao5" value="'+config.da2xiao5+'"><br><br>'+
        '    <label for="fname">大  于  5  千：</label>'+
        '    <input type="number" id="da5" name="da5" value="'+config.da5+'"><br><br>'+
        '    <label for="fname">忽 略 词：</label>'+
        '    <input type="number" id="hulve" name="hulve" placeholder="英文格式逗号分隔" value="'+config.hulve+'"><br><br>'+
        '</form></div>'
        layer.open({
            title: '配置管理'
            ,content: bioadan
            ,yes: function(index, layero){
                //do something
                config.da1xiao2=$('#da1xiao2').val()
                config.da2xiao5=$('#da2xiao5').val()
                config.da5=$('#da5').val()
                config.hulve=$('#hulve').val()
                $.ajaxSettings.async = false;
                $.get(url+"setConfig",config,function(res){
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    layer.msg('配置完成，请点击开始！');
                })
 
            }
        });
 
    })
    $('.flex-items-center.icons').prepend('<button type="button" id = "kaishi" class="ant-btn mr-2" ><span>开始采集</span></button>')
    $('.flex-items-center.icons').on('click','#kaishi',function(e){
        //进行配置时暂停
        layer.msg('开始采集');
        var token = localStorage.mc_auth_token
        $.get(url+"startCj",{token},function(res){
 
        })
    })
}
 
