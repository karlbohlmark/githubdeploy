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


query('.commit').map(function(commit){
	var links = commit.querySelector('.commit-links');
	links.insertBefore( '<a href="#deploy" class="deploy-link" style="float: left;position: relative;top: 3px;right: 5px;">Deploy</a>'.toNode(),
		links.firstChild);
});

document.body.addEventListener('click', function(e){
	if(e.target.webkitMatchesSelector('.deploy-link')){
		console.log('Deploy commit ' + e.target.parentNode.querySelector('.gobutton').href);
	}
});