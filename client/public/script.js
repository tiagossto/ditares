/* Caderno de Provérbios: cada data abre uma única adivinha; o menu funciona como capa e o jogo como a página do dia. */
(function () {
  'use strict';

  const MAX_LIVES = 3;
  const DATA_URL = '/ditados.json';
  const THEME_KEY = 'adivinha-theme';
  const DAILY_PROGRESS_KEY = 'adivinha-daily-progress';

  const elements = {
    homeScreen: document.querySelector('#homeScreen'),
    homeIntro: document.querySelector('.home-intro'),
    gameScreen: document.querySelector('#gameScreen'),
    archiveScreen: document.querySelector('#archiveScreen'),
    settingsScreen: document.querySelector('#settingsScreen'),
    todayButton: document.querySelector('#todayButton'),
    archiveButton: document.querySelector('#archiveButton'),
    settingsButton: document.querySelector('#settingsButton'),
    supportButton: document.querySelector('#supportButton'),
    brandHome: document.querySelector('#brandHome'),
    backHomeButton: document.querySelector('#backHomeButton'),
    backFromArchive: document.querySelector('#backFromArchive'),
    backFromSettings: document.querySelector('#backFromSettings'),
    editionDate: document.querySelector('#editionDate'),
    answerForm: document.querySelector('#answerForm'),
    answerInput: document.querySelector('#answerInput'),
    submitButton: document.querySelector('#submitButton'),
    proverb: document.querySelector('#proverb'),
    livesDisplay: document.querySelector('#livesDisplay'),
    scoreValue: document.querySelector('#scoreValue'),
    feedback: document.querySelector('#feedback'),
    roundContent: document.querySelector('#roundContent'),
    gameOver: document.querySelector('#gameOver'),
    finalScore: document.querySelector('#finalScore'),
    restartButton: document.querySelector('#restartButton'),
    calendarGrid: document.querySelector('#calendarGrid'),
    archiveStatus: document.querySelector('#archiveStatus'),
    settingsStatus: document.querySelector('#settingsStatus'),
    supportDialog: document.querySelector('#supportDialog'),
    closeSupport: document.querySelector('#closeSupport'),
    dialogDone: document.querySelector('#dialogDone')
  };

  const state = {
    proverbs: [],
    current: null,
    currentDate: '',
    isDaily: false,
    lives: MAX_LIVES,
    score: 0,
    isComplete: false,
    isTransitioning: false
  };

  const screens = [elements.homeScreen, elements.gameScreen, elements.archiveScreen, elements.settingsScreen];

  function normalize(value) {
    return value.trim().toLocaleLowerCase('pt-PT').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
  }

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function dateFromKey(key) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatEdition(key) {
    return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }).format(dateFromKey(key)).replace(/^./, (letter) => letter.toUpperCase());
  }

  function getDailyProverb(data, key) {
    const exactMatch = data.find((item) => item.data === key);
    if (exactMatch) return exactMatch;

    const dayNumber = Math.floor(dateFromKey(key).getTime() / 86400000);
    return data[Math.abs(dayNumber) % data.length];
  }

  function setFeedback(message, kind) {
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback${kind ? ` is-${kind}` : ''}`;
  }

  function updateHud() {
    elements.scoreValue.textContent = String(state.score);
    elements.livesDisplay.setAttribute('aria-label', `Tens ${state.lives} ${state.lives === 1 ? 'vida' : 'vidas'} de ${MAX_LIVES}`);
    Array.from(elements.livesDisplay.children).forEach((dot, index) => {
      const active = index < state.lives;
      dot.classList.toggle('is-active', active);
      dot.classList.toggle('is-lost', !active);
    });
  }

  function getPhraseBeginning(phrase) {
    const cleanPhrase = phrase.trim().replace(/[.!?…]+$/, '');
    const finalToken = cleanPhrase.split(/\s+/).pop();
    return cleanPhrase.slice(0, -(finalToken.length)).trim();
  }

  function renderProverb() {
    const blank = document.createElement('span');
    blank.className = 'missing-word';
    blank.textContent = '\u00a0';
    blank.setAttribute('aria-label', 'palavra em falta');
    elements.proverb.replaceChildren(document.createTextNode(`${getPhraseBeginning(state.current.frase)} `), blank);
  }

  function openScreen(screen) {
    screens.forEach((item) => { item.hidden = item !== screen; });
  }

  function persistDailyProgress(result) {
    if (!state.isDaily) return;
    localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify({ date: state.currentDate, result, score: state.score }));
  }

  function getDailyProgress(key) {
    try {
      const stored = JSON.parse(localStorage.getItem(DAILY_PROGRESS_KEY) || 'null');
      return stored && stored.date === key ? stored : null;
    } catch (_) {
      return null;
    }
  }

  function resetGameState(item, key, isDaily) {
    state.current = item;
    state.currentDate = key;
    state.isDaily = isDaily;
    state.lives = MAX_LIVES;
    state.score = 0;
    state.isComplete = false;
    state.isTransitioning = false;

    const progress = isDaily ? getDailyProgress(key) : null;
    if (progress) {
      state.score = progress.score || 0;
      state.isComplete = true;
      state.lives = progress.result === 'won' ? MAX_LIVES : 0;
    }

    elements.gameOver.hidden = true;
    elements.roundContent.hidden = false;
    elements.editionDate.textContent = `Edição · ${formatEdition(key)}`;
    elements.roundContent.classList.remove('is-wrong', 'is-correct');
    renderProverb();
    updateHud();

    if (progress?.result === 'won') {
      elements.answerInput.disabled = true;
      elements.submitButton.disabled = true;
      setFeedback('A página de hoje já foi lida. Volta amanhã para uma nova adivinha.', 'success');
    } else if (progress?.result === 'lost') {
      gameOver();
    } else {
      elements.answerInput.disabled = false;
      elements.submitButton.disabled = false;
      setFeedback(isDaily ? 'Completa a edição de hoje.' : 'Esta página pertence ao arquivo.', '');
      requestAnimationFrame(() => elements.answerInput.focus());
    }
  }

  function openGame(item, key, isDaily) {
    openScreen(elements.gameScreen);
    resetGameState(item, key, isDaily);
  }

  function gameOver() {
    state.isTransitioning = true;
    elements.answerInput.disabled = true;
    elements.submitButton.disabled = true;
    elements.finalScore.textContent = String(state.score);
    elements.roundContent.hidden = true;
    elements.gameOver.hidden = false;
    persistDailyProgress('lost');
    elements.restartButton.focus();
  }

  function finishDailyGame() {
    state.isComplete = true;
    state.isTransitioning = true;
    elements.answerInput.disabled = true;
    elements.submitButton.disabled = true;
    elements.roundContent.classList.remove('is-wrong');
    elements.roundContent.classList.add('is-correct');
    setFeedback('Edição concluída. Volta amanhã para uma nova adivinha.', 'success');
    persistDailyProgress('won');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (state.isTransitioning || state.isComplete || !state.current) return;

    const answer = elements.answerInput.value;
    if (!normalize(answer)) {
      setFeedback('Escreve uma palavra antes de verificar.', 'error');
      elements.answerInput.focus();
      return;
    }

    if (normalize(answer) === normalize(state.current.resposta)) {
      state.score = state.lives;
      updateHud();
      finishDailyGame();
      return;
    }

    state.lives -= 1;
    elements.answerInput.value = '';
    elements.roundContent.classList.remove('is-correct');
    elements.roundContent.classList.add('is-wrong');
    updateHud();

    if (state.lives === 0) {
      setFeedback('Sem vidas restantes.', 'error');
      window.setTimeout(gameOver, 550);
      return;
    }

    setFeedback(`Ainda não. Restam-te ${state.lives} ${state.lives === 1 ? 'vida' : 'vidas'}.`, 'error');
    window.setTimeout(() => elements.roundContent.classList.remove('is-wrong'), 420);
    elements.answerInput.focus();
  }

  function renderCalendar() {
    const currentKey = todayKey();
    const entries = state.proverbs.filter((item) => item.data <= currentKey).sort((a, b) => a.data.localeCompare(b.data));
    elements.calendarGrid.replaceChildren();

    if (entries.length === 0) {
      elements.calendarGrid.textContent = 'Ainda não há páginas no arquivo.';
      return;
    }

    const lastDate = dateFromKey(currentKey);
    const start = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
    const end = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0);
    const monthPrefix = currentKey.slice(0, 7);
    const monthEntries = entries.filter((item) => item.data.startsWith(monthPrefix));
    const monthLabel = new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(lastDate);

    const heading = document.createElement('p');
    heading.className = 'calendar-month';
    heading.textContent = monthLabel.replace(/^./, (letter) => letter.toUpperCase());
    elements.calendarGrid.append(heading);

    const weekdays = document.createElement('div');
    weekdays.className = 'calendar-weekdays';
    ['2ª', '3ª', '4ª', '5ª', '6ª', 'Sá', 'Do'].forEach((day) => {
      const label = document.createElement('span');
      label.textContent = day;
      weekdays.append(label);
    });
    elements.calendarGrid.append(weekdays);

    const days = document.createElement('div');
    days.className = 'calendar-days';
    const offset = (start.getDay() + 6) % 7;
    for (let index = 0; index < offset; index += 1) days.append(document.createElement('span'));

    for (let day = 1; day <= end.getDate(); day += 1) {
      const key = dateKey(new Date(end.getFullYear(), end.getMonth(), day));
      const entry = monthEntries.find((item) => item.data === key);
      const dayButton = document.createElement(entry ? 'button' : 'span');
      dayButton.className = `calendar-day${entry ? ' has-entry' : ''}${key === currentKey ? ' is-today' : ''}`;
      dayButton.textContent = String(day);
      if (entry) {
        dayButton.type = 'button';
        dayButton.title = key === currentKey ? 'Adivinha do dia' : `Adivinha de ${formatEdition(key)}`;
        dayButton.addEventListener('click', () => openGame(entry, key, key === currentKey));
      }
      days.append(dayButton);
    }
    elements.calendarGrid.append(days);
    elements.archiveStatus.textContent = `${entries.length} ${entries.length === 1 ? 'página disponível' : 'páginas disponíveis'} no arquivo.`;
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('.theme-button').forEach((button) => button.classList.toggle('is-selected', button.dataset.theme === theme));
    elements.settingsStatus.textContent = `Tema ${theme === 'dark' ? 'escuro' : 'claro'} aplicado.`;
  }

  function showSupport() {
    if (typeof elements.supportDialog.showModal === 'function') elements.supportDialog.showModal();
    else elements.supportDialog.setAttribute('open', '');
  }

  function closeSupport() {
    if (typeof elements.supportDialog.close === 'function') elements.supportDialog.close();
    else elements.supportDialog.removeAttribute('open');
  }

  function validateData(data) {
    return Array.isArray(data) && data.length > 0 && data.every((item) => typeof item.frase === 'string' && typeof item.resposta === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.data));
  }

  async function initialiseGame() {
    setTheme(localStorage.getItem(THEME_KEY) || 'light');
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Não foi possível carregar os ditados.');
      const data = await response.json();
      if (!validateData(data)) throw new Error('O ficheiro de ditados não tem o formato esperado.');
      state.proverbs = data;
      elements.todayButton.disabled = false;
      renderCalendar();
      openScreen(elements.homeScreen);
    } catch (error) {
      elements.homeIntro.textContent = 'Não foi possível abrir o caderno de ditados.';
      console.error(error);
    }
  }

  elements.todayButton.addEventListener('click', () => openGame(getDailyProverb(state.proverbs, todayKey()), todayKey(), true));
  elements.archiveButton.addEventListener('click', () => { renderCalendar(); openScreen(elements.archiveScreen); });
  elements.settingsButton.addEventListener('click', () => openScreen(elements.settingsScreen));
  elements.supportButton.addEventListener('click', showSupport);
  elements.brandHome.addEventListener('click', (event) => { event.preventDefault(); openScreen(elements.homeScreen); });
  elements.backHomeButton.addEventListener('click', () => openScreen(elements.homeScreen));
  elements.backFromArchive.addEventListener('click', () => openScreen(elements.homeScreen));
  elements.backFromSettings.addEventListener('click', () => openScreen(elements.homeScreen));
  elements.answerForm.addEventListener('submit', handleSubmit);
  elements.restartButton.addEventListener('click', () => openGame(state.current, state.currentDate, state.isDaily));
  elements.closeSupport.addEventListener('click', closeSupport);
  elements.dialogDone.addEventListener('click', closeSupport);
  document.querySelectorAll('.theme-button').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.theme)));

  initialiseGame();
}());
