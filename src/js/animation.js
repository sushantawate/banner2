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

