Room.guest = async (conn) => {
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
	let wordAccEl = document.getElementById("word-acc")
	let definitionEl = document.getElementById("definition")
	let definitionAccEl = document.getElementById("definition-acc")
	let redBarEl = document.getElementById("red-bar")
	let cardFrontEl = document.getElementById("card-front")
	let cardBackEl = document.getElementById("card-back")
	let accessibilityEl = document.getElementById("accessibility")

	let scoresInterval	
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

	function setScore(redScore, blueScore) {
		redBarEl.style.width = ` ${100 * redScore / (redScore + blueScore)}%`

		let currentRedScore = Number(redScoreEl.innerHTML.split(" ")[1])
		let redInterval = Math.floor((redScore - currentRedScore) / 20) + 1
		let currentBlueScore = Number(blueScoreEl.innerHTML.split(" ")[1])
		let blueInterval = Math.floor((blueScore - currentBlueScore) / 20) + 1

		clearInterval(scoresInterval)

		scoresInterval = setInterval(() => {
			currentRedScore += redInterval
			currentBlueScore += blueInterval

			if(currentRedScore >= redScore || currentBlueScore >= blueScore) {
				clearInterval(scoresInterval)
				currentBlueScore = blueScore
				currentRedScore = redScore
			}

			redScoreEl.innerHTML = `Rojo: ${currentRedScore} infectados`
			blueScoreEl.innerHTML = `Azul: ${currentBlueScore} infectados`
		}, 50)
	}

	function autocomplete() {
		let text = normalize(guessBoxEl.value)
		let matches = []
		for(let [word,] of words) {
			if(normalize(word).includes(text)) matches.push(word)
			if(matches.length == 3) break
		}
		while(matches.length != 3) matches.push(".")
		autocompleteEl.innerHTML = matches.reverse().join("<br>")
	}

	guessBoxEl.addEventListener("keydown", (e) => {
		clearTimeout(autocompleteTimeout)
		autocompleteTimeout = setTimeout(autocomplete, 100)

		if(e.key == "Enter" 
		&& normalize(guessBoxEl.value) == normalize(currentWord)) {
			conn.send({type:"success"})
		}
	})

	accessibilityEl.addEventListener("click", () => {
		drawEl.removeChild(document.getElementById("card-container"))
		accessibilityEl.parentNode.removeChild(accessibilityEl)
		wordAccEl.style.display = "initial"
		definitionAccEl.style.display = "initial"
	})

	conn.on("data", (data) => {
		if(data.blueScore > 8000000000) document.body.innerHTML = 
			`<div id="bl"><h1 id="win">La Enfermedad Azul Dominó al Mundo!</h1>`
		else if(data.redScore > 8000000000) document.body.innerHTML = 
			`<div id="rl"><h1 id="win">La Enfermedad Roja Dominó al Mundo!</h1>`

		currentWord = data.word
		setScore(data.redScore, data.blueScore)
		painterEl.innerHTML = `Dibujando: ${data.painter}`
		messageEl.innerHTML = data.message
		setTimer(data.due)

		if(data.turn != team) {
			cardBackEl.className = ""
			cardFrontEl.className = ""
			drawEl.style.display = "none"
			guessEl.style.display = "none"
			otherTurnEl.style.display = "initial"
		}
		else if(data.isPainter) {
			drawEl.style.display = "initial"
			guessEl.style.display = "none"
			otherTurnEl.style.display = "none"
			wordEl.innerHTML = wordAccEl.innerHTML = data.word
			definitionEl.innerHTML = definitionAccEl.innerHTML = data.definition
			setTimeout(() => {
				cardBackEl.className = "card-back-flipped"
				cardFrontEl.className = "card-front-flipped"
			}, 1000)
		}
		else {
			drawEl.style.display = "none"
			guessEl.style.display = "initial"
			otherTurnEl.style.display = "none"
			guessBoxEl.value = ""
			autocomplete()
		}
	})
}