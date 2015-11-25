var key = {}, keyName = {
	32 : 'shoot',
	37 : 'left',
	38 : 'up',
	39 : 'right',
	40 : 'down'
};

document.onkeydown = function(evt) {
	/*if (gameover) {
		start();
		}	*/
		key[keyName[evt.keyCode]] = true;
};

document.onkeyup = function(evt) {
	key[keyName[evt.keyCode]] = false;
};

Stage(function(stage) {

	// Set view box
	stage.viewbox(300, 200, mode = 'in-pad');

	stage.on('viewport', function(viewport){
		box.scale(1/viewport.ratio);
	});

	// Create an image and append it to stage
	var box = Stage.image('box').appendTo(stage);
	box.pin('alignY', 0.8);
	box.pin({ 'handleY' : 1 });
	box.stretch();

	var update = function() {

		if (key.right) { character.x ++; }
		if (key.left) { character.x --; }

		box.offset(character.x, character.y);
		stage.touch();
	};

	stage.tick(update);
});

// Adding a texture
Stage({
	name : 'box',
	image : 'img/sprite.png',
	textures : {
		box : { x : 0, y : 0, width : 30, height : 60 }
	}
});

var character = {
	x: 20,
	y: 20,
};
