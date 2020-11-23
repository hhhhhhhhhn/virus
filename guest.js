let con //DEBUG

Room.guest = async (conn) => {
	con = conn //DEBUG
	let otherTurnEl = document.getElementById("other-turn")
	let scoresEl = document.getElementById("scores")
	let messageEl = document.getElementById("message")
	let redScoreEl = document.getElementById("red-score")
	let blueScoreEl = document.getElementById("blue-score")
	let painterEl = document.getElementById("painter")
	let drawEl = document.getElementById("draw")
	let guessEl = document.getElementById("guess")
	let guessBoxEl = document.getElementById("guess-box")
	let autocompleteEl = document.getElementById("autocomplete")
	let loginEl = document.getElementById("login")
	let usernameEl= document.getElementById("username")
	let timerEl = document.getElementById("timer")
	let wordEl = document.getElementById("word")
	let definitionEl = document.getElementById("definition")
	
	let currentWord
	let autocompleteTimeout
	let timerInterval

	loginEl.style.display = "initial"
	let [username, team] = await new Promise((resolve, reject) => {
		document.getElementById("join-red").addEventListener("click", () => {
			resolve([usernameEl.value, "red"])
		})
		document.getElementById("join-blue").addEventListener("click", () => {
			resolve([usernameEl.value, "blue"])
		})
	})
	
	loginEl.style.display = "none"
	scoresEl.style.display = "initial"
	conn.send({type: "login", username: username, team: team})

	function setTimer(due) {
		clearInterval(timerInterval)
		timerInterval = setInterval(() => {
			let secondsLeft = Math.floor((due - Date.now()) / 1000)
			if(secondsLeft <= 0) {
				clearInterval(timerInterval)

			}
			timerEl.innerHTML = `Quedan ${secondsLeft} segundos`
		}, 500)
	}

	function autocomplete() {
		let text = normalize(guessBoxEl.value)
		let matches = []
		for(let [word,] of words) {
			if(normalize(word).includes(text)) matches.push(word)
			if(matches.length == 3) break
		}
		while(matches.length != 3) matches.push("")
		autocompleteEl.innerHTML = matches.join("<br>")
	}

	guessBoxEl.addEventListener("keydown", (e) => {
		clearTimeout(autocompleteTimeout)
		autocompleteTimeout = setTimeout(autocomplete, 100)

		if(e.key == "Enter" 
		&& normalize(guessBoxEl.value) == normalize(currentWord)) {
			conn.send({type:"success"})
		}
	})

	conn.on("data", (data) => {
		currentWord = data.word
		redScoreEl.innerHTML = `Rojo: ${data.redScore} Infectados`
		blueScoreEl.innerHTML = `Azul: ${data.blueScore} Infectados`
		painterEl.innerHTML = `Dibujando: ${data.painter}`
		messageEl.innerHTML = data.message
		setTimer(data.due)

		if(data.turn != team) {
			drawEl.style.display = "none"
			guessEl.style.display = "none"
			otherTurnEl.style.display = "initial"
		}
		else if(data.isPainter) {
			drawEl.style.display = "initial"
			guessEl.style.display = "none"
			otherTurnEl.style.display = "none"
			wordEl.innerHTML = data.word
			definitionEl.innerHTML = data.definition
		}
		else {
			drawEl.style.display = "none"
			guessEl.style.display = "initial"
			otherTurnEl.style.display = "none"
			autocompleteEl.innerHTML = ""
			guessBoxEl.value = ""
		}
	})
}