var serviceUrl = 'http://localhost:8080'; //deploy.jitskills.se:8080

var onlineUrl = function(hash){
	return 'http://' + hash + '.localhost.se'; //.dev.jitskills.se
};

var query = function(selector){
	var elements = document.querySelectorAll(selector);
	var matches = [];
	for(var i=0;i<elements.length; i++){
		matches.push(elements[i]);
	}
	return matches;
};

String.prototype.toNode = function(){
	var div = document.createElement('div');
	div.innerHTML = this;
	return div.firstChild;
};

var xhrGet = function(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", serviceUrl + url);
	xhr.send(null);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var result = JSON.parse(xhr.responseText);
			callback(result);
		}
	};
};
var xhrPost = function(url, data, callback){
	var xhr = new XMLHttpRequest();
	var fd = new FormData();
	Object.keys(data).forEach(function(key){
		fd.append(key, data[key]);
	});
	xhr.open("POST", serviceUrl + url);
	xhr.send(fd);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var result = JSON.parse(xhr.responseText);
			callback(result);
		}
	};
};


xhrGet("/online", function(online){
	var deployLink = '<a href="#deploy" class="deploy-link" style="float: left;position: relative;top: 3px;right: 5px;">Deploy</a>';
	var onlineLink = '<a href="#commit" target="_blank" class="deploy-link online" style="float: left;position: relative;top: 3px;right: 5px; color:#2DD12D">Online</a>';
	query('.commit').map(function(commit){
		var links = commit.querySelector('.commit-links');
		var commitHash = commit.querySelector('.commit-title a').href.match(/\/([0-9a-f]*)$/)[1];
		var link = online.indexOf(commitHash)==-1 ? deployLink : onlineLink.replace('#commit', onlineUrl(commitHash) );
		links.insertBefore( link.toNode(),
			links.firstChild);
	});
});

document.body.addEventListener('click', function(e){
	if(e.target.webkitMatchesSelector('.deploy-link:not(.online)')){
		var deployLink = e.target;
		deployLink.innerHTML = 'Deploying...';
		var commit = e.target.parentNode.querySelector('.gobutton').href;
		console.log('Deploy commit ' + commit);

		xhrPost("/deploy", {commit:commit}, function(result){
			deployLink.innerHTML = 'Online';
			deployLink.style.color = '#2DD12D';
			deployLink.target = '_blank';
			deployLink.href = onlineUrl(commit.match(/\/([^\/]*)$/)[1]);
			deployLink.classList.add('online');
		});
		e.preventDefault();
	}
});