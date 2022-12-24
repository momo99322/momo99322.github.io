const randomSortFunction = function () {
    return 0.5 - Math.random();
};

const firstClassname = 'first';
const secondClassname = 'second';

let phrases = [
    '<i>"Consuetudo est altera natura"</i>  "Привычка - вторая натура"',
    '<i>"Nota bene"</i>  "Заметьте хорошо!"',
    '<i>"Nulla calamitas sola"</i>  "Беда не приходит одна"',
    '<i>"Per aspera ad astra"</i>  "Через тернии к звёздам"'
].sort(randomSortFunction);

let dictionary = [];

let nextIsFirstClass = true;

let counter = 0;

const randElement = document.getElementById('rand');

function createPhrase() {
    let className;
    if (nextIsFirstClass) {
        className = firstClassname;
    } else {
        className = secondClassname;
    }
    nextIsFirstClass = !nextIsFirstClass;

    let phrase = phrases.pop();
    if (phrase === undefined) {
        alert('Фразы закончились');
        return;

    }

    let number = counter++;

    const phraseElement = document.createElement('p');

    phraseElement.innerHTML = `<u>n=${number}</u>   ${phrase}`;
    phraseElement.classList.add(className);

    dictionary.push({
        number: number,
        phrase: phraseElement
    })

    randElement.appendChild(phraseElement);
}

function makeEvenSentencesBold() {
    dictionary.filter(entry => entry.number % 2 === 0).forEach(entry => entry.phrase.style.fontWeight = 'bold');
}