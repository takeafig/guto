<?php 

/*print_r($_params_);
$_params_['sDomain'] = 'ekus';
print_r($_params_);
print_r($sDomain); exit;    */
?>function createWidget(config) {
        domain = "<?= $sDomain; ?>";
        orders = <?= $order ?>;
      
        width = 469;
        min_width = 369;
        height = 653;
        min_height = 653;
        
        if (config.width !== undefined) {
            
            if (config.width < min_width){
                width = min_width;
                p_x = config.width / min_width;
                
            } else {
                width = config.width;
                p_x = 1;
            }

        }
        if (config.height !== undefined) {
            
            if (config.height < min_height){
                height = min_height;
                p_y = config.height / min_height;
                
            } else {
                height = config.height;
                p_y = 1;
            }
        }
        
        
        
	//widget_url = [domain, "/?", '&width=',width,'&height=',height,'&wdgt=1'].join("");
	widget_url = [domain, "/?", '&wdgt=1'].join("");


	Widget = {
		created: false,
		widgetElement: null,
		show: function() {
			if (this.created)
				return;
			this.widgetElement = document.createElement('div');
			this.widgetElement.setAttribute('id', 'widget_container');
			this.widgetElement.setAttribute('style', 'width:'+width+'px;height:'+height+'px;');
			this.widgetElement.innerHTML = '<iframe id="widget_iframe" src="' + widget_url + '" scrolling="no" width="'+ width + '" height="'+ height + '" frameborder="0" style="width:'+ width +'px; height:'+height+'px;'+'transform: scale(' + p_x + ', ' + p_y + '); transform-origin: left top;'+' "></iframe>';
                        var target = document.getElementById('bit24_widget');
                        target.setAttribute('style', 'width:'+config.width+'px;height:'+config.height+'px; overflow:hidden;');
			target.appendChild(this.widgetElement);
			this.widgetElement.style.display = 'block';
			this.created = true;
		}
	}

	XD.receiveMessage(function(message) {
		if (message.data > 0 && document.getElementById("widget_iframe"))
		{
			document.getElementById("widget_iframe").height = message.data;
		}
	}, domain);

	Widget.show();
}

/* 
 * a backwards compatable implementation of postMessage
 * by Josh Fraser (joshfraser.com)
 * released under the Apache 2.0 license.  
 *
 * this code was adapted from Ben Alman's jQuery postMessage code found at:
 * http://benalman.com/projects/jquery-postmessage-plugin/
 * 
 * other inspiration was taken from Luke Shepard's code for Facebook Connect:
 * http://github.com/facebook/connect-js/blob/master/src/core/xd.js
 *
 * the goal of this project was to make a backwards compatable version of postMessage
 * without having any dependency on jQuery or the FB Connect libraries
 *
 * my goal was to keep this as terse as possible since my own purpose was to use this 
 * as part of a distributed widget where filesize could be sensative.
 * 
 */

// everything is wrapped in the XD function to reduce namespace collisions
var XD = function(){
  
    var interval_id,
    last_hash,
    cache_bust = 1,
    attached_callback,
    window = this;
    
    return {
        postMessage : function(message, target_url, target) {
            
            if (!target_url) { 
                return; 
            }
    
            target = target || parent;  // default to parent
    
            if (window['postMessage']) {
                // the browser supports window.postMessage, so call it with a targetOrigin
                // set appropriately, based on the target_url parameter.
                target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));

            } else if (target_url) {
                // the browser does not support window.postMessage, so set the location
                // of the target to target_url#message. A bit ugly, but it works! A cache
                // bust parameter is added to ensure that repeat messages trigger the callback.
                target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message;
            }
        },
  
        receiveMessage : function(callback, source_origin) {
            
            // browser supports window.postMessage
            if (window['postMessage']) {
                // bind the callback to the actual event associated with window.postMessage
                if (callback) {
                    attached_callback = function(e) {
                        if ((typeof source_origin === 'string' && e.origin !== source_origin)
                        || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
                            return !1;
                        }
                        callback(e);
                    };
                }
                if (window['addEventListener']) {
                    window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                } else {
                    window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                }
            } else {
                // a polling loop is started & callback is called whenever the location.hash changes
                interval_id && clearInterval(interval_id);
                interval_id = null;

                if (callback) {
                    interval_id = setInterval(function(){
                        var hash = document.location.hash,
                        re = /^#?\d+&/;
                        if (hash !== last_hash && re.test(hash)) {
                            last_hash = hash;
                            callback({data: hash.replace(re, '')});
                        }
                    }, 100);
                }
            }   
        }
    };
}();

createWidget(bit24_widget_config);




//код для вставки
/*
<!-- BIT24PRO-WIDGET BEGIN -->
<div id='bit24_widget' style='transform: scale(0.5);'>
<noscript><p class='warning'>Чтобы воспользоваться виджетом обменника, включите javascript.</p></noscript> 
</div>
<script> 
var bit24_widget_config = {width: 369, height:700};
        (function(){
            var url ="//bitok.dev/widget/widget.js";
            var hcc = document.createElement("script");
            hcc.type ="text/javascript";
            hcc.async =true;
            hcc.src = url;
console.log(hcc.outerHTML);
            var s = document.getElementsByTagName("script")[0];
document.write(hcc.outerHTML);
           // s.parentNode.insertBefore(hcc, s.nextSibling);
        })();
</script>
<!-- BIT24PRO-WIDGET END -->

*/