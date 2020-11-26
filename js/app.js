const $btnShowRules = document.getElementById('btn-rules'),
	$modalRules = document.getElementById('modal-rules'),
	$btnCloseRules = document.getElementById('btn-close-rules');

const showRules = () => {
	$modalRules.classList.add('show');
};

const closeRules = () => {
	$modalRules.classList.remove('show');
};

$btnShowRules.addEventListener('click', showRules);
$btnCloseRules.addEventListener('click', closeRules);
