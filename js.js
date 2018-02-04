var view = {
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};


var model = {
	boardSize:7,
	numShips:3,
	shipLength:3,
	shipsSunk:0,

	ships: [
			{locations: ["0","0","0"], hits: ["","",""]},
			{locations: ["0","0","0"], hits: ["","",""]},
			{locations: ["0","0","0"], hits: ["","",""]}
			],

//metoda is sunk sprawdza czy statek został zatopiony
	isSunk: function(ship){
		for (var i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] !== "hit")
				return false;
		}
		return true;
	},

	fire: function(guess){
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess); // metoda indexOf przeglada tablice, poszukijąc w niej wartosc odpowiadajacej podanemu argumentowi, a jesli taka znajdzie jej index, natomiast jesli nie znajdzie zwaraca -1
			if (index >= 0) {
				ship.hits[index] = "hit"; //trafiony
				view.displayHit(guess);
				view.displayMessage("trafiony");

				if (this.isSunk(ship)){
					view.displayMessage("Zatopiłeś okręt");
					this.shipsSunk++;
				}// mamy pweność zę statek został trafiony sprawdzamy czy również został zatopiony
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Pudło");
		return false;
	},

	generateShipLocations: function(){
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log('tablica okrętów');
		console.log(this.ships);
	},

	generateShip: function(){
		var direction = Math.floor(Math.random()*2);
		var row, col;

		if (direction === 1) {
			// generujemy poczatkowe pole w układzie poziomym
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			//generujemy w układzie pionowym
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);

		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1){
				newShipLocations.push(row + "" + (col +i));	//dodajemy do tablicy pola okrętu w układzie poziomym
			} else {
				newShipLocations.push((row + i) + "" + col);	//dodajemy do tablicy pola okretu w układzie pionowym
			}
		}
		console.log("test ");
		console.log(newShipLocations);
		return newShipLocations;

	},

	collision: function(locations){
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
				for (var j = 0; j < locations.length; j++) {
					if (ship.locations.indexOf(locations[j])>=0){
						return true;

					}
				}
		}
		return false;
	}
};

var controler = {
	guesses: 0,

	processGuess: function(guess){
		var location = parseGuess(guess);
		if (location){
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Zatopiłeś wszystkie moje okręty, w " + this.guess + " próbach.");
			}
		}
	}

};

// Funkcja pomocnicza przetwarzająca współrzędne wpisane
// przez użytkownika.


function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	var alphabetSmall = ["a", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Ups, proszę wpisać literę i cyfrę.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar) ;
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Ups, to nie są współrzędne!");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Ups, pole poza planszą!");
		} else {
			return row + column;
		}
	}
	return null;
}

function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controler.processGuess(guess);
	guessInput.value = "";
}
function init(){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}
// obsłóga klawisza enter jako oddanie strzału
function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton")
	if (e.keyCode === 13){
		fireButton.click();
		return false;
	}
}

window.onload = init;
console.log(model.ships);
