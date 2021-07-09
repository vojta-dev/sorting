// Terrible code, but it works and it's funny so who cares ¯\_(ツ)_/¯

const onclick = (id, listener) => {
  const element = document.getElementById(id);
  element.addEventListener('click', () => listener(element));
};

onclick('changeRefreshRate', () => {
  refreshRate = prompt('Enter new refresh rate (in milliseconds)');
});

onclick('changeArray', () => {
  startingArrayLength = +prompt('Enter new array length');
});

onclick('startstop', (element) => {
  if (!running) {
    start();
  } else {
    running = false;
    element.innerText = 'Start';
    promiseResolve();
    displayStats();
  }
});

let buttonPresses = 0;
let lowestNumOfTries = Infinity;
let highestNumOfTries = 0;

let running = false;
let refreshRate = 0;
let startingArrayLength = 6;
let promise;
let promiseResolve;

const displayArray = async (array, counter) => {
  document.getElementById('array').innerText = array.join(' ');
  document.getElementById('counter').innerText = counter;

  promise = await new Promise((resolve) => {
    promiseResolve = resolve;
    setTimeout(resolve, refreshRate);
  });
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [array[randomIndex], array[i]] = [array[i], array[randomIndex]];
  }

  return array;
};

const bogoSort = async (arr) => {
  let array = [...arr];
  let counter = 0;

  const isArraySorted = () => {
    const arrayCopy = [...array];
    arrayCopy.sort();
    return array.every((element, index) => element === arrayCopy[index]);
  };

  const shuffleArray = () => {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [array[randomIndex], array[i]] = [array[i], array[randomIndex]];
    }
    return array;
  };

  while (!isArraySorted(array) && running) {
    counter++;
    shuffleArray();
    await displayArray(array, counter);
  }

  if (running) {
    document.getElementById('array').style.color = 'limegreen';
    if (counter > highestNumOfTries) highestNumOfTries = counter;
    if (counter < lowestNumOfTries) lowestNumOfTries = counter;
  }

  stop();
};

const displayStats = () => {
  document.getElementById('lowestNum').innerText = lowestNumOfTries;
  document.getElementById('highestNum').innerText = highestNumOfTries;
  document.getElementById('buttonPresses').innerText = buttonPresses;
};

const start = () => {
  buttonPresses++;
  const startingArray = [...new Array(startingArrayLength + 1).keys()].slice(1);
  document.getElementById('expectation').innerText = `Expecting around ${startingArray.reduce((a, b) => a * b)} tries`;
  document.getElementById('array').style.color = '';
  document.getElementById('startstop').innerText = 'Stop';
  running = true;
  bogoSort(shuffleArray(startingArray));
};

const stop = () => {
  document.getElementById('startstop').innerText = 'Start';
  running = false;
  promiseResolve();
  displayStats();
};
