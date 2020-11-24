let Room = {}

Room.init = (url,) => {
	document.getElementById("url").href = url
	document.getElementById("host").style.display = "initial"
}

Room.host = (peer) => {
	
	let turn = "red"
	let painter = ""
	let redScore = 100
	let blueScore = 100
	let redQueue = []
	let blueQueue = []
	let timeout
	let due
	let started = false
	let users = {}
	let word = ""
	let definition = ""
	let message = ""
	let guesser = ""

	function update() {
		for(let [username, {conn}] of Object.entries(users)) {
			let isPainter = username == painter
			conn.send({
				turn: turn, redScore: redScore, blueScore: blueScore, due: due,
				painter: painter, word: word, definition: definition,
				isPainter: isPainter, message: message
			})
		} 
	}

	function newTurn(success) {
		let timestamp = Date.now()
		let oldRedScore = redScore
		let oldBlueScore = blueScore
		
		if(success) {
			clearTimeout(timeout)
			let multiplier = 3 + (due - timestamp) / 20000
			let oppositeMultiplier = 1 + 1 / multiplier
			if(turn == "red") {
				redScore = Math.floor(multiplier * redScore)
				blueScore = Math.floor(oppositeMultiplier * blueScore)
			}
			else {
				blueScore = Math.floor(multiplier * blueScore)
				redScore = Math.floor(oppositeMultiplier * redScore)
			}
		}

		let comparison = ""
		for(let [amount, name] of comparisons) {
			if(amount > (turn == "red" ? oldRedScore : oldBlueScore) &&
			amount < (turn == "red" ? redScore : blueScore)) {
				comparison = `La Enfermedad ${turn == "red" ? "Rojo" : "Azul"}`+
					` tiene más infectados que la población de ${name}!`
				break
			}
		}

		if(success)
			message = `${guesser} acertó la palabra "${word}". ${comparison}`
		else if(guesser)
			message = `El Equipo ${turn == "red" ? "Rojo" : "Azul"} no ` + 
				`adivinó la palabra "${word}"`

		if(turn == "red") {
			turn = "blue"
			painter = blueQueue[0]
			blueQueue.push(blueQueue.shift())
		}
		else {
			turn = "red"
			painter = redQueue[0]
			redQueue.push(redQueue.shift())
		}

		;[word, definition] = words.pop()

		due = timestamp + 60000
		
		timeout = setTimeout(() => {
			newTurn(success = false)
		}, 60000)

		update()
	}

	document.getElementById("start").addEventListener("click", (e) => {
		started = true
		for(let [username, {team}] of Object.entries(users)) {
			if(team == "red") redQueue.push(username)
			else blueQueue.push(username)
		}
		newTurn(success = false)
		e.target.parentNode.style.display = "none"
	})

	peer.on("connection", (conn) => {
		let logged = false
		let username
		let team
		conn.on("data", (data) => {
			if(!started && data.type == "login") {
				while(data.username in users) {
					data.username += " 2"
				}
				users[data.username] = {conn: conn, team: data.team}
				username = data.username
				team = data.team
				logged = true
			}

			if(!logged || !started) return
			
			if(data.type == "success" && team == turn) {
				guesser = username
				newTurn(success = true)
			}
		})
	})
}