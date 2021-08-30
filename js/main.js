var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'),
	hashD=["whatis","towhom","malign","defense","showcase","about"],menuD=[],m_menu=false,menuClick=false,
	postTemp='<div class="video"><a class="thumbnail" href="#"></a><div class="brief"><p class="title"></p><p class="name"></p></div><a class="btn small middle" href="#">more</a></div>',getNum=6,userData={};
userData["score"]=0;
userData["nowq"]=0;
$(document).ready(function(e){
	$('a[href="#"]').bind("click", function(e) {e.preventDefault();});
	$(window).on("resize",resizeFun);
	resizeFun();
	setMenuFun();
	if(page_type=="index"){
		$(".kv_video video").on("loadedmetadata",function(e){
			setTimeout(function(){
				$(".loading").animate({opacity:0},800,function(){
					$(".loading").hide();
				})	
			}, 2000);
		})
		$("#kv .btn").fancybox({
			afterLoad:function(instance, current){
				$(".fancybox-slide").css({"padding":0});
				$(".fancybox-bg").css({"background":"#000000","opacity":1});
			}
		})
		getPostsFun();
		getQuizFun();
		$(".qa_List_Box .close").on("click",function(e){
			resetQuizFun();
			$("body").attr("style","");
			$(".qa_List_Box").hide();
		})
	}else if(page_type=="page"){
		var u=window.location.href;
		if(u.match("section5")!=null){
			getNum=3;
			getPostsFun();
		}
	}
	$(".backtop").on("click",backtopFun);
	$(".hamburger").on("click",openMenuFun);
	$(".section3_1 .method").on("click",openmethodFun);
	$(".section5 .content >.btn.more").on("click",function(e){
		if(userData.loadList.length>0){
			setPostFun(userData.loadList);
		}
	})
})
function resetQuizFun(){
	userData["score"]=0;
	userData["nowq"]=0;
	$(".qa_List_inner").hide();
	$(".qa_List_inner.start").show();
	$(".qa_List_inner.game").removeClass("q2");
	$(".qa_answer input[name=ans]").prop('checked', false);
	$(".devil svg").removeClass("red");
	$(".qa_List_inner.game .btn").text("Next");
}

function getQuizFun(){
	$.ajax({
        url:"json/quiz.json",
        type: 'GET',
        dataType:"json" 		
	}).done(function(msg){
		// console.log(msg);
		userData["quiz"]=$.extend(true,[],msg["quiz"]);
		$(".amount span.all").text(userData["quiz"].length);
		$(".quizBtn").on("click",openGameFun);
		$(".qa_List_inner.start .btn").on("click",startGameFun);
		$(".qa_answer input[name=ans]").change(function(e){
			if($(".qa_answer input[name=ans]:checked").val()!=undefined){
				$(".qa_List_inner.game .btn").show();
			}
		})
		$(".qa_List_inner.game .btn").on("click",function(e){
			if($(".qa_answer input[name=ans]:checked").val()=="y"){
				userData["score"]=userData["score"]+5;
			}
			if(userData["nowq"]==userData["quiz"].length-1){
				if(userData["score"]==100){
					userData["score"]=99;
				}				
				var svgNum=Math.round(userData["score"]/20);
				$(".qa_List_inner.result .devil svg").removeClass("red");
				for(var i=0;i<svgNum;i++){
					$(".devil svg:eq("+i+")").addClass("red");
				}
				$(".qa_List_inner.result .circle_score span").text(userData["score"]);
				$(".progress-bar").loading({"percent":userData["score"]});
				$(".qa_List_inner.game").hide();
				$(".qa_List_inner.result").show();
			}else{
				userData["nowq"]++
				setQuizFun(userData["nowq"]);				
			}
		})
	}).fail(function(msg){
		console.log(msg);
	})	
}
function openGameFun(){
	$("body").css({"overflow":"hidden"});
	$(".qa_List_Box").show();
}
function startGameFun(){
	$(".qa_List_inner").hide();
	setQuizFun(userData["nowq"]);
	$(".qa_List_inner.game").show();
}
function setQuizFun(qnum){
	$(".qa_List_inner.game h3").text(userData["quiz"][qnum]["label"]);
	$(".qa_List_inner.game .qa_question p").text(userData["quiz"][qnum]["q"]);
	$(".qa_answer input[name=ans]").prop('checked', false);
	$(".qa_List_inner.game .btn").hide();
	$(".amount span.now").text(qnum+1);
	if(qnum==userData["quiz"].length-1){
		$(".qa_List_inner.game .btn").text("result");
		$(".qa_List_inner.game").addClass("q2")
	}
}


function getPostsFun(){
	$.ajax({
        url:"json/aricle.json",
        type: 'GET',
        dataType:"json" 		
	}).done(function(msg){
		userData.loadList=$.extend(true,[],msg["posts"]);
		if(page_type=="page"){
			shuffleArrayFun(removePostFun(userData.loadList));
		}
		setPostFun(userData.loadList);
	}).fail(function(msg){
		console.log(msg);
	})
}

function setPostFun(posts){
	var thisload=getNum,addMC=".section5 .video_box";
	if(posts.length<thisload){
		thisload=posts.length;
	}
	if(page_type=="page"){
		addMC=".relate .video_box"
	}
	for(var i=0;i<thisload;i++){
		var _mc=$(postTemp);
		$(".thumbnail",_mc).css("background-image","url(images/"+posts[i]["img"]+")");
		$(".title",_mc).text(posts[i]["title"]);
		$(".name",_mc).text(posts[i]["author"]);
		$("a",_mc).attr("href",posts[i]["href"]);
		$(addMC).append(_mc);
	}
	posts.splice(0, thisload);
	if(page_type=="index"){
		if(posts.length<=0){
			$(".section5 .content >.btn.more").hide();
		}else{
			$(".section5 .content >.btn.more").show();
		}
	}
}

function removePostFun(posts){
	var u=window.location.href;
	$.each(posts,function(i,val){
		if(u.match(val["href"])!=null){
			posts.splice(i,1);
			return false;
		}
	})
	return posts;
}


function openmethodFun(e){
	if($(window).width()<768){
		$(".section3_1 .method").removeClass("active");
		$(this).addClass("active");
	}else{
		$(".section3_1 .method").removeClass("active");
	}
}


function openMenuFun(e){
	if(!m_menu){
		$(this).addClass("is-active");
		$(".menu_Box").show().animate({height:$(window).height()-$("#header").height()},800);
		m_menu=true;
	}else{
		$(".menu_Box").animate({height:0},800,function(){
			$(".hamburger").removeClass("is-active");
			$(".menu_Box").hide();
			m_menu=false;
		});
	}
}

function backtopFun(){
	if($(window).width()<768){
		if(m_menu){
			$(".menu_Box").animate({height:0},800,function(){
				$(".hamburger").removeClass("is-active");
				$(".menu_Box").hide();
				m_menu=false;
				$body.animate({scrollTop: 0}, 600,function(){
					window.location.hash = hashD[0];
				});	
			});
		}else{
			$body.animate({scrollTop: 0}, 600,function(){
				window.location.hash = hashD[0];
			});			
		}
	}else{
		$body.animate({scrollTop: 0}, 600,function(){
			window.location.hash = hashD[0];
		});
	}
}

function setMenuFun(){
	$(".menu_Box .menu").load("menu.html",function(e){
		$(".menu_Box .menu li").each(function(i){
			menuD.push($(this).attr("data"));
		}).on("click",menuclickFun);
		$(window).on("scroll",scrollFun);
		scrollFun();
		if(page_type=="index"){
			var hash=String(window.location.hash).replace("#",""),_index=hashD.indexOf(hash);
            if(_index!=-1){
        		$(".menu li:eq("+String(_index)+")").addClass("active");
        		$body.animate({scrollTop: $("."+menuD[_index]).offset().top-$("#header").height()}, 600);
            }
		}
	});
	$("#footer").load("footer.html");
}
function menuclickFun(e){
	var isindex=false,d=$(this).attr("data"),_index=$(this).index();
	if(page_type=="index"){
		isindex=true;
		menuClick=true;
	}
	if(isindex){
		if($(window).width()<768){
			$(this).addClass("is-active");
			$(".menu_Box").animate({height:0},800,function(){
				$(".hamburger").removeClass("is-active");
				$(".menu_Box").hide();
				m_menu=false;
				$body.animate({scrollTop: $("."+d).offset().top-$("#header").height()}, 600,function(){
					window.location.hash = hashD[_index];
					menuClick=false;
				});		
			});
		}else{
			$(".menu li").removeClass("active");
			$(this).addClass("active");
			$body.animate({scrollTop: $("."+d).offset().top-$("#header").height()}, 600,function(){
				window.location.hash = hashD[_index];
				menuClick=false;
			});				
		}
	}else{
		document.location.href="index.html#"+hashD[_index];
	}
}
function scrollFun(e) {
	var st=$(window).scrollTop(),blockT=200,sh=$(window).height();
	if(page_type=="index"){
		blockT=$("#kv").height();
	}
	if(st>blockT){
		$(".backtop").show();
		$("#header").addClass("shadow");
	}else{
		$(".backtop").hide();
		$("#header").removeClass("shadow");
	}
	if(page_type=="index" && menuClick==false){
		for(var i=(menuD.length-1);i>=0;i--){
			var thisD=menuD[i];
			if($("."+thisD).offset().top < (st+sh/2)){
				$(".menu li").removeClass("active");
				$(".menu li:eq("+String(i)+")").addClass("active");
				return false;
			}
		}
	}
}

function resizeFun(e){
	var sw=$(window).width(),sh=$(window).height(),minW=1024,minH=0;
	if(page_type=="index"){
		if(sw>768){
			if(sw>=minW){
				$("#kv").css({height:sh,"max-height":sw*0.5625});
			}
			$(".kv_inner .btn").attr({"data-width":sw,"data-height":sh});		
		}else{
			$(".kv_inner .btn").attr({"data-width":sw,"data-height":Math.round(sw*0.5625)});	
			$("#kv").attr("style","");
		}
		
	}
}

function shuffleArrayFun(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}