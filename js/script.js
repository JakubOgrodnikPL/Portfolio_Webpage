const input = document.querySelector(".inputW")
const buttonW = document.querySelector(".buttonWeather")
const cityName = document.querySelector(".city-name")
const warning = document.querySelector(".warning")
const photo = document.querySelector(".photo")
const weather = document.querySelector(".weather")
const temperature = document.querySelector(".temperature")
const humidity = document.querySelector(".humidity")

const API_LINK = "https://api.openweathermap.org/data/2.5/weather?lat="
const API_KEY = "&appid=49451577f90d72876090ea998da7c6a7"
const API_LON = "&lon="
const API_UNITS = "&units=metric"

const setParameters = () => {
	const city = input.value || "Warszawa"
	const GAPI_LINK = "http://api.openweathermap.org/geo/1.0/direct?q="
	const GAPI_KEY = "&appid=49451577f90d72876090ea998da7c6a7"
	const GURL = GAPI_LINK + city + GAPI_KEY

	axios
		.get(GURL)
		.then(res => {
			// console.log(res.data[0].lat)
			const rlat = res.data[0].lat
			console.log(rlat)
			const rlon = res.data[0].lon
			console.log(rlon)
			const URL = API_LINK + rlat + API_LON + rlon + API_KEY + API_UNITS
			axios.get(URL).then(res => {
				console.log(res.data)
				const temp = res.data.main.temp
				const hum = res.data.main.humidity
				const status = Object.assign({}, ...res.data.weather)
				console.log(status.id)

				warning.textContent = ""
				input.value = ""

				if (status.id >= 801 && status.id <= 804)
					photo.setAttribute("src", "./media/Weather/cloud.png")
				else if ((status.id = 800))
					photo.setAttribute("src", "./media/Weather/sun.png")
				else if ((status.id = 741))
					photo.setAttribute("src", "./media/Weather/fog.png")
				else if (status.id >= 701 && status.id <= 781 && status.id != 741)
					photo.setAttribute("src", "./media/Weather/unknown.png")
				else if (status.id >= 600 && status.id <= 622)
					photo.setAttribute("src", "./media/Weather/ice.png")
				else if (status.id >= 500 && status.id <= 531)
					photo.setAttribute("src", "./media/Weather/rain.png")
				else if (status.id >= 300 && status.id <= 321)
					photo.setAttribute("src", "./media/Weather/drizzle.png")
				else if (status.id >= 200 && status.id <= 232)
					photo.setAttribute("src", "./media/Weather/thunderstorm.png")

				cityName.textContent = res.data.name
				temperature.textContent = Math.floor(temp) + "℃"
				humidity.textContent = hum + "%"
				weather.textContent = status.main
			})
		})
		.catch(() => (warning.textContent = "Enter valid city name"))
}

const enterCheck = e => {
	if (e.key === "Enter") {
		setParameters()
	}
}
input.addEventListener("keyup", enterCheck)
buttonW.addEventListener("click", setParameters)
setParameters()

// const getWeather = () => {
//     const city = input.value || 'London'
//     const URL = API_LINK + city + API_KEY + API_UNITS

//     axios.get(URL).then(res=>console.log(res))
// }

// getWeather()

///////////////////// SNAKE GAME/////////////////////////////////

//PREVENTING ARROW SCROLLING ON WINDOW ELEMENT
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

const gameBoard = document.querySelector("#gameBoard")
const ctx = gameBoard.getContext("2d")
const scoreText = document.querySelector("#scoreText")
const resetButton = document.querySelector("#resetButton")
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height
const boardBackground = "black"
const snakeColor = "green"
const snakeBorder = "beige"
const foodColor = "red"
const unitSize = 25
let running = false
let xVelocity = unitSize
let yVelocity = 0
let foodX
let foodY
let score = 0
let snake = [
	{ x: unitSize * 4, y: 200 },
	{ x: unitSize * 3, y: 200 },
	{ x: unitSize * 2, y: 200 },
	{ x: unitSize * 1, y: 200 },
	{ x: 200, y: 200 },
]

window.addEventListener("keydown", changeDirection)
resetButton.addEventListener("click", resetGame)

gameStart()
// createFood()
// drawFood()

function gameStart() {
	running = true
	scoreText.textContent = score
	createFood()
	drawFood()
	nextTick()
}
function nextTick() {
	if (running) {
		setTimeout(() => {
			clearBoard()
			drawFood()
			moveSnake()
			drawSnake()
			checkGameOver()
			nextTick()
		}, 75)
	} else {
		displayGameOver()
	}
}
function clearBoard() {
	ctx.fillStyle = boardBackground
	ctx.fillRect(0, 0, gameWidth, gameHeight)
}
function createFood() {
	function randomFood(min, max) {
		const randNum =
			Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
		return randNum
	}
	foodX = randomFood(0, gameWidth - unitSize)
	foodY = randomFood(0, gameWidth - unitSize)
	console.log(foodX)
	console.log(foodY)
}
function drawFood() {
	ctx.fillStyle = foodColor
	ctx.fillRect(foodX, foodY, unitSize, unitSize)
}
function moveSnake() {
	const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity }

	snake.unshift(head)
	//if food is eaten
	if (snake[0].x == foodX && snake[0].y == foodY) {
		score += 1
		scoreText.textContent = score
		createFood()
	} else {
		snake.pop()
	}
}
function drawSnake() {
	ctx.fillStyle = snakeColor
	ctx.strokeStyle = snakeBorder
	snake.forEach(snakePart => {
		ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize)
		ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize)
	})
}
function changeDirection(event) {
	const keyPressed = event.keyCode
	const LEFT = 37
	const UP = 38
	const RIGHT = 39
	const DOWN = 40

	const goingUp = yVelocity == -unitSize
	const goingDown = yVelocity == unitSize
	const goingRight = xVelocity == unitSize
	const goingLeft = xVelocity == -unitSize

	switch (true) {
		case keyPressed == LEFT && !goingRight:
			xVelocity = -unitSize
			yVelocity = 0
			break
		case keyPressed == UP && !goingDown:
			xVelocity = 0
			yVelocity = -unitSize
			break
		case keyPressed == RIGHT && !goingLeft:
			xVelocity = unitSize
			yVelocity = 0
			break
		case keyPressed == DOWN && !goingUp:
			xVelocity = 0
			yVelocity = unitSize
			break
	}
}
function checkGameOver() {
	switch (true) {
		case snake[0].x < 0:
			running = false
			break
		case snake[0].x > gameWidth:
			running = false
			break
		case snake[0].y < 0:
			running = false
			break
		case snake[0].y > gameHeight - unitSize:
			running = false
			break
	}
	for (let i = 1; i < snake.length; i += 1) {
		if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
			running = false
		}
	}
}
function displayGameOver() {
	ctx.font = "50px Saira"
	ctx.fillStyle = "yellow"
	ctx.textAlign = "center"
	ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2)
	running = false
}
function resetGame() {
	score = 0
	xVelocity = unitSize
	yVelocity = 0
	snake = [
		{ x: unitSize * 4, y: 200 },
		{ x: unitSize * 3, y: 200 },
		{ x: unitSize * 2, y: 200 },
		{ x: unitSize * 1, y: 200 },
		{ x: 200, y: 200 },
	]
	gameStart()
}


