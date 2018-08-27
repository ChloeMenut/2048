var grid;
var score = 0;
var bestScore = 0;
var audio = new Audio('Tintin.mp3');
var bruit = new Audio('12229.wav');
audio.loop = true;

// gestion des cookies
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

// initialisation de la grille et ajout aléatoirement de 2 chiffres (2 ou 4)
function init() {
	audio.play();
	if (bestScore > readCookie('cookieScore'))
		bestScore = bestScore;
	else if (readCookie('cookieScore') > 0)
		bestScore = readCookie('cookieScore');
	

	createCookie('cookieScore',bestScore,30);

	score = 0;
	$("#best_score").empty().append(bestScore);
	grid = clear();
	addNumber();
	addNumber();
	draw();
}

// tableau de 0
function clear() {
	return [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	];
}

// Ajout aléatoire de 1 2 ou 4 si encore des zéros dans la grille
function addNumber() {
	var options = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if ((grid[i][j]) == 0) {
				options.push({
					x: i,
					y: j
				});
			}
		}
	}
	if (options.length > 0) {
		var spot = options[Math.floor(Math.random() * options.length)];
		var r = Math.random(1);
		grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
	}
}

// comparaison de deux tableaux
function compare(a, b) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (a[i][j] != b[i][j])
				return true;
		}
	}
	return false;
}

// copie d'un tableau
function duplicate(grid) {
	var mirror = clear();

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			mirror[i][j] = grid[i][j];
		}
	}
	return mirror;
}

// Déplacer puis additionner puis redéplacer
function moveAndMerge(row) {
	row = move(row);
	row = merge(row);
	row = move(row);
	return row;
}

// Renvoi d'un nouveau tableau où les zéros se placent à gauche
function move(row) {
	var arr = row.filter(val => val);
	var missing = 4 - arr.length;
	var zeros = Array(missing).fill(0);
	arr = zeros.concat(arr);
	return arr;
}

// Renvoi du tableau ou 2 chiffres de même valeur sont additionnés
function merge(row) {
	for (var i = 3; i >= 1; i--) {
		var a = row[i];
		var b = row[i - 1];
		if (a == b) {
			row[i] = a + b;
			score += row[i];
			if (score > bestScore) {
				bestScore = score;
			}
			row[i-1] = 0;
		}
	}
	return row;
}

// Inversion du tableau [1, 2, 3, 4] devient [4, 3, 2, 1]
function flip(grid) {
	for (var i = 0; i < 4; i++)
		grid[i].reverse();

	return grid;
}

// Rotation du tableau clockwise
function rotate(grid) {
	var newGrid = clear();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			newGrid[i][j] = grid[j][i];
		}
	}
	return newGrid;
}

// Affichage du tableau dans le HTML
function draw() {
	$('#board').empty();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] != 0) {
				var divToAppend = "<div class='cell'>"+grid[i][j]+"</div>";
				$("#board").append(divToAppend).show('slow');
				applyBackground($('#board div:last-child'));
			}
			else
				$("#board").append("<div class='cell'></div>");
		}
	}
	$("#score").empty().append(score);
}

// Application des couleurs de fonds
function applyBackground(cell) {
	var value = $(cell).html();
	switch (value) {
		case "2":
			$(cell).addClass("val2");
			break;
		case "4":
			$(cell).addClass('val4');
			break;
		case "8":
			$(cell).addClass('val8');
			break;
		case "16":
			$(cell).addClass('val16');
			break;
		case "32":
			$(cell).addClass('val32');
			break;
		case "64":
			$(cell).addClass('val64');
			break;
		case "128":
			$(cell).addClass('val128');
			break;
		case "256":
			$(cell).addClass('val256');
			break;
		case "512":
			$(cell).addClass('val512');
			break;
		case "1024":
			$(cell).addClass('val1024');
			break;
		case "2048":
			$(cell).addClass('val2048');
			break;
		default:
			$(cell).addClass("occupied");
	}
}

// Check s'il n'y a plus de 0 ou qu'il n'y a plus de possibilité d'additionner
function isGameOver() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] == 0)
				return false;
			if (i !== 3 && grid[i][j] === grid[i + 1][j])
				return false;
			if (j !== 3 && grid[i][j] === grid[i][j + 1])
				return false;	
		}
	}
	return true;
}

function hasWon() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] == 2048) {
				return true;
			}
		}
	}
	return false;
}

// Déclenchement des actions sur appui des touches arrow
function keypress(e) {
	var flipped = false;
	var rotated = false;
	var played = true;
	if (e.keyCode == 39) {
	}
	else if (e.keyCode == 37) {
		grid = flip(grid);
		flipped = true;
	}
	else if (e.keyCode == 40) {
		grid = rotate(grid);
		rotated = true;
	}
	else if (e.keyCode == 38) {
		grid = rotate(grid);
		grid = flip(grid);
		flipped = true;
		rotated = true;
	}
	else {
		played = false;
	}
		
	if (played) {
		// bruit.play();
		var past = duplicate(grid);
		for (var i = 0; i < 4; i++) {
			grid [i] = moveAndMerge(grid[i]);
		}

		var changed = compare(past, grid);
		if (flipped) {
			grid = flip(grid);
		}

		if (rotated) {
			grid = rotate(grid);
			grid = rotate(grid);
			grid = rotate(grid);
		}

		if (changed) {
			addNumber();
			bruit.play();
		}
		
		draw();
		var gameover = isGameOver();
		var won = hasWon();
		if (gameover) {
			swal({
 				title: "Game Over!",
  				text: "You looser!",
  				icon: "warning",
  				button: "Continue de jouer!",
			});
		}
		if (won) {
			swal({
 				title: "Well Done!",
  				text: "Tu as gagné!",
  				icon: "success",
  				button: "Continue de jouer!",
			});
		}
	}
}

$(document).ready(function() {
	init();
	$(document).keydown(function(e) {
		keypress(e);
	});
});