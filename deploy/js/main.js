! function iife($) {
    'use strict';
    var ready = [],
        easing = {
            easeInSine: '0.47, 0, 0.745, 0.715',
            easeOutSine: '0.39, 0.575, 0.565, 1',
            easeInOutSine: '0.445, 0.05, 0.55, 0.95',
            easeInQuad: '0.55, 0.085, 0.68, 0.53',
            easeOutQuad: '0.25, 0.46, 0.45, 0.94',
            easeInOutQuad: '0.455, 0.03, 0.515, 0.955',
            easeInCubic: '0.55, 0.055, 0.675, 0.19',
            easeOutCubic: '0.215, 0.61, 0.355, 1',
            easeInOutCubic: '0.645, 0.045, 0.355, 1',
            easeInQuart: '0.895, 0.03, 0.685, 0.22',
            easeOutQuart: '0.165, 0.84, 0.44, 1',
            easeInOutQuart: '0.77, 0, 0.175, 1',
            easeInQuint: '0.755, 0.05, 0.855, 0.06',
            easeOutQuint: '0.23, 1, 0.32, 1',
            easeInOutQuint: '0.86, 0, 0.07, 1',
            easeInExpo: '0.95, 0.05, 0.795, 0.035',
            easeOutExpo: '0.19, 1, 0.22, 1',
            easeInOutExpo: '1, 0, 0, 1',
            easeInCirc: '0.6, 0.04, 0.98, 0.335',
            easeOutCirc: '0.075, 0.82, 0.165, 1',
            easeInOutCirc: '0.785, 0.135, 0.15, 0.86',
            easeOutBack: '0.175, 0.885, 0.32, 1.275',
            easeInBack: '0.6, -0.28, 0.735, 0.045',
            linear: '0, 0, 1, 1'
        },
        $ = $,
        args,
        transform = ['transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTransform'],
        transition = ['transition', 'msTransition', 'webkitTransition', 'mozTransition', 'oTransition'],
        transformProperty = getSupportedPropertyName(transform),
        transitionProperty = getSupportedPropertyName(transition),
        animateable = ["top", "left", "right", "bottom"],
        global = window;

    function getPropertyByName(obj, propName) {
        var _index = propName.indexOf('.')

        if (typeof obj === 'undefined') return false;
        if (_index > -1) return getPropertyByName(obj[propName.substring(0, _index)], propName.substr(_index + 1));

        return obj[propName];
    }

    function getSupportedPropertyName(properties) {
        var i = 0
        for (i = 0; i < properties.length; i++) {
            if (typeof document.body.style[properties[i]] != 'undefined') {
                return properties[i];
            }
        }
        return null;
    }

    function assign(obj, prop, value) {
        if (typeof prop === "string")
            prop = prop.split(".");

        if (prop.length > 1) {
            var e = prop.shift();
            assign(obj[e] =
                Object.prototype.toString.call(obj[e]) === "[object Object]" ? obj[e] : {},
                prop,
                value);
        } else
            obj[prop[0]] = value;
    }
    global.getById = function(el) {
        return global.document.getElementById(el);
    }
    global.getByClass = function(el, no) {
        if (no !== undefined) {
            return global.document.getElementsByClassName(el)[no - 1];
        } else {
            return global.document.getElementsByClassName(el);
        }
    }
    global.$ = function(name, duration, args) {
        var elem, propVal, existingVal, i;

        typeof name === 'string' ? elem = document.querySelector('#' + name) : elem = name;

        for (i = 0; i < animateable.length; i++) {
            propVal = getPropertyByName(args, animateable[i])
            existingVal = getPropertyByName(elem.style, animateable[i]);
            if (propVal != undefined && existingVal === undefined) {
                if (existingVal === undefined || existingVal === 0) {
                    assign(elem.style, animateable[i], 0);

                }

            }
        }
        ready.unshift(false);
        setTimeout(function() {
            var s = elem.style,
                a = args,
                easeType = a.ease,
                scaleAll = a.scale,
                xScale = a.scaleX || scaleAll || null,
                yScale = a.scaleY || scaleAll || null,
                rotation = a.rotate || null,
                top = a.top || null,
                left = a.left || null,
                transformation = "",
                bgX,
                bgY,
                defEase = 'linear';

            s.webkitBackfaceVisibility = s.backface || "hidden";
            s.animationFillMode = "both";

            if (a.ease != -1) {
                if (easing.hasOwnProperty(a.ease)) {
                    defEase = 'cubic-bezier(' + easing[easeType] + ')';
                } else {
                    defEase = 'cubic-bezier(' + a.ease + ')';
                }
            }
            s.position = a.position || 'absolute';

            if (typeof a.x !== 'undefined') {
                transformation = transformation + ' translateX(' + a.x + 'px)';
            }
            if (typeof a.y !== 'undefined') {
                transformation = transformation + ' translateY(' + a.y + 'px)';
            }
            if (typeof a.z !== 'undefined') {
                transformation = transformation + ' translateZ(' + a.z + 'px)';
            }
            if (typeof a.scale !== 'undefined') {
                transformation = transformation + ' scale(' + a.scale + ', ' + a.scale + ')';
            }
            if (typeof a.scaleY !== 'undefined') {
                transformation = transformation + ' scaleY(' + a.scaleY + ')';
            }
            if (typeof a.scaleX !== 'undefined') {
                transformation = transformation + ' scaleX(' + a.scaleX + ')';
            }
            if (typeof a.skewY !== 'undefined') {
                transformation = transformation + ' skewY(' + a.skewY + 'deg)';
            }
            if (typeof a.skewX !== 'undefined') {
                transformation = transformation + ' skewX(' + a.skewX + 'deg)';
            }
            if (typeof a.rotate !== 'undefined') {
                transformation = transformation + ' rotate(' + a.rotate + 'deg)';
            }
            if (typeof a.rotateX !== 'undefined') {
                transformation = transformation + ' rotateX(' + a.rotateX + 'deg)';
            }
            if (typeof a.rotateY !== 'undefined') {
                transformation = transformation + ' rotateY(' + a.rotateY + 'deg)';
            }
            if (typeof a.rotateZ !== 'undefined') {
                transformation = transformation + ' rotateZ(' + a.rotateZ + 'deg)';
            }
            s[transformProperty] = transformation;
            s[transitionProperty] = 'all ' + duration + 's';
            s.transitionTimingFunction = defEase;
            s.opacity = a.alpha || a.opacity;

            s.top = a.top + 'px';
            s.left = a.left + 'px';
            s.bottom = a.bottom + 'px';
            s.right = a.right + 'px';

            s.width = a.width + "px";
            s.height = a.height + "px";

            s.marginTop = a.marginTop + 'px';
            s.marginRight = a.marginRight + 'px';
            s.marginBottom = a.marginBottom + 'px';
            s.marginLeft = a.marginLeft + 'px';

            s.paddingTop = a.paddingTop + 'px';
            s.paddingRight = a.paddingRight + 'px';
            s.paddingBottom = a.paddingBottom + 'px';
            s.paddingLeft = a.paddingLeft + 'px';

            s.backgroundColor = a.backgroundColor;

            if (typeof a.backgroundX !== 'undefined') {
                bgX = a.backgroundX
            } else {
                bgX = 0;
            }

            if (typeof a.backgroundY !== 'undefined') {
                bgY = a.backgroundY
            } else {
                bgY = 0;
            }
            if (bgY != 0 && bgX != 0) {
                s.backgroundPosition = bgX + "px " + bgY + "px";
            }
            ready.pop();
            doNext();
        }, args.delay * 1000);
        if (args.onStart) {
            (args.onStart)()
        }
        function doNext() {
            setTimeout(function() {
                if (args.onComplete != undefined) {
                    (args.onComplete)();
                }
            }, (args.delay || 0) + duration * 1000 || 75)
        }
    }

    // ADD A CLASS NAME TO THE EXISTING SET
    global.addClass = function(name, className, delay) {
        var d = delay || 0;
        typeof name === 'string' ? name = document.querySelector('#' + name) : name = name;
        setTimeout(function() {
            name.className = name.className + " " + className;
        }, d * 1000);
    }

    // SWAP ALL CLASS NAMES FOR A NEW SET
    global.replaceClass = function(name, className, delay) {
            var d = delay || 0;
            typeof name === 'string' ? name = document.querySelector('#' + name) : name = name;
            setTimeout(function() {
                name.className = className;
            }, d * 1000);
        }
        // REMOVE THE FIRST INSTANCE OF A CLASS NAME AND ITS TRAILING SPACE
    global.removeClass = function(name, removeClassName, delay) {
        var d = delay || 0;
        var r = removeClassName;
        typeof name === 'string' ? name = document.querySelector('#' + name) : name = name;
        setTimeout(function() {
            name.className = name.className.replace(r, "");
        }, d * 1000);
    }
}()

function init(){

	// var waterShimmer = getElementById("waterShimmer");
	
$('mainImg',1,{delay:1,y:-600,rotate:0.01,ease:'easeOutSine'});
$('clouds',1,{delay:1,y:-600,rotate:0.01,ease:'easeOutSine'});
$('trukOne',1,{delay:1,y:-600,rotate:0.01,ease:'easeOutSine'});
$('trukTwo',1,{delay:1,y:-600,rotate:0.01,ease:'easeOutSine'});

setTimeout(frame02,1000);
}

function frame02(){

	$('clouds',80,{delay:1,x:-300,y:-600,rotate:0.01,ease:'easeOutSine'});
	$('trukOne',18,{delay:1,x:1,y:-630,rotate:0.01});
	$('trukOne',30,{delay:18,x:40,y:-655,rotate:0.01,ease:'easeOutSine'});
	$('trukTwo',40,{delay:1,x:-100,y:-540,rotate:0.01,ease:'easeOutSine'});
	
	setTimeout(doWaterShimmer,1000);

}
	function doWaterShimmer(){
	
	for(var i=0; i<12; i++ ){
		var waterShimmer = document.getElementById('waterShimmer');
		 	shimmer = document.createElement('div');
		 	waterShimmerWidth = waterShimmer.offsetWidth;
		 	waterShimmerHeight = waterShimmer.offsetHeight;
		 	animTime = Math.random()*1.5;
			shimmerOpacity = Math.round(Math.random()*.8);

		shimmer.className = 'shimmer';
		shimmer.style.left = Math.round(Math.random()*waterShimmerWidth) + "px";
		shimmer.style.top = Math.round(Math.random()*waterShimmerHeight) + "px";

		waterShimmer.appendChild(shimmer);

		tm.to(shimmer,1,{delay:animTime,opacity:1});
		tm.to(shimmer,animTime,{delay:animTime+1,opacity:0, onComplete:removeYourself, onCompleteParams:[shimmer]});		
	}
}

function removeYourself(obj){
	obj.parentNode.removeChild(obj);

}	


window.onload = init();