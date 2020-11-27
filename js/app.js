const $btnShowRules = document.getElementById('btn-rules'),
	$modalRules = document.getElementById('modal-rules'),
	$btnCloseRules = document.getElementById('btn-close-rules'),
	$game = document.getElementById('game'),
	$score = document.getElementById('score');

const options = ['rock', 'paper', 'scissors'];

const messages = ['You lose', 'You draw', 'You win'];

let score = +localStorage.getItem('score') || 0;

const saveToLocalStorage = () => {
	localStorage.setItem('score', score);
};

const pickOption = () => {
	return options[Math.floor(Math.random() * (3 - 0) + 0)];
};

const whoWin = (user, cpu) => {
	// 0: Perdió
	// 1: Empató
	// 2: Ganó
	let result = 1;
	if (
		(user === 'scissors' && cpu === 'paper') ||
		(user === 'paper' && cpu === 'rock') ||
		(user === 'rock' && cpu == 'scissors')
	) {
		result = 2;
	} else if (
		(cpu === 'scissors' && user === 'paper') ||
		(cpu === 'paper' && user === 'rock') ||
		(cpu === 'rock' && user == 'scissors')
	) {
		result = 0;
	}
	return messages[result];
};

const generateOptionTemplate = (option) => {
	const template = `
    <div class="game__option game__option--${option}">
      <div class="game__option-inner">
        <img src="img/icon-${option}.svg" alt="${option}" />
      </div>
    </div>
  `;
	return template;
};

const generateOptionWithLabelTemplate = (option, isUser) => {
	const template = `
    <div class="game__option--with-label">
      ${generateOptionTemplate(option)}
      ${
			isUser
				? '<p class="game__option-label">You picked</p>'
				: '<p class="game__option-label">The house picked</p>'
		}
    </div>
  `;
	return template;
};

const clearContainer = (container) => {
	while (container.lastChild) {
		container.removeChild(container.lastChild);
	}
};

const showRules = () => {
	$modalRules.classList.add('show');
};

const closeRules = () => {
	$modalRules.classList.remove('show');
};

const showOptionsPicked = (user, cpu) => {
	const userTemplate = generateOptionWithLabelTemplate(user, true),
		cpuTemplate = generateOptionWithLabelTemplate(cpu, false);
	clearContainer($game);
	$game.classList.add('no-triangle');
	$game.innerHTML = userTemplate + cpuTemplate;
};

const showResult = (message) => {
	const result = document.createElement('div');
	result.className = 'game__result';
	result.innerHTML = `
    <p class="game__result-message">${message}</p>
    <button class="btn" id="btn-play">Play Again</button>
  `;
	$game.appendChild(result);
	document.getElementById('btn-play').addEventListener('click', restartGame);
};

const updateScore = (message) => {
	let prevScore = score;
	if (message === messages[0]) {
		score = score - 1 < 0 ? 0 : score - 1;
	} else if (message === messages[2]) {
		score += 1;
	}
	$score.innerText = score;
	if (score !== prevScore) {
		saveToLocalStorage();
	}
};

const startGame = (userOption) => {
	const cpuOption = pickOption();
	showOptionsPicked(userOption, cpuOption);
	const message = whoWin(userOption, cpuOption);
	showResult(message);
	updateScore(message);
};

const restartGame = () => {
	const handleRestartAnimation = ({ animationName }) => {
		$game.classList.remove(animationName);
		if (animationName === 'zoom-out') {
			clearContainer($game);
			$game.classList.remove('no-triangle');
			$game.classList.add('ready');
			$game.classList.add('zoom-in');
			$game.innerHTML = paperTemplate + scissorsTemplate + rockTemplate;
			return;
		}
		$game.removeEventListener('animationend', handleRestartAnimation);
	};
	const paperTemplate = generateOptionTemplate('paper'),
		scissorsTemplate = generateOptionTemplate('scissors'),
		rockTemplate = generateOptionTemplate('rock');
	$game.classList.add('zoom-out');
	$game.addEventListener('animationend', handleRestartAnimation);
};

const handleGameClick = ({ target }) => {
	if (!$game.classList.contains('ready')) {
		return;
	}
	const button = target.closest('.game__option');
	if (button) {
		$game.classList.remove('ready');
		const option = button.classList[1].substring(14);
		startGame(option);
	}
};

$btnShowRules.addEventListener('click', showRules);
$btnCloseRules.addEventListener('click', closeRules);
$game.addEventListener('click', handleGameClick);
document.addEventListener('keydown', ({ code }) => {
	if (code === 'Escape') {
		$modalRules.classList.remove('show');
	}
});

$score.innerText = score;
