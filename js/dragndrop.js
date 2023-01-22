const ROTATION_OFFSET = 60;
const DRAGGABLE_WIDTH = 100;
const DRAGGABLE_HEIGHT = 100;

let field = document.getElementById('field');

let win = false

moveAndRotateDraggableIntoFieldWithRandomPlaces()

function moveAndRotateDraggableIntoFieldWithRandomPlaces() {
    let draggables = document.getElementsByClassName('draggable');

    let rect = field.getBoundingClientRect();
    for (let i = 0; i < draggables.length; i++) {
        let draggable = draggables[i]
        draggable.style.width = DRAGGABLE_WIDTH + "px";
        draggable.style.height = DRAGGABLE_HEIGHT + "px";

        draggable.style.position = "absolute";

        draggable.style.left = randomIntFromInterval(rect.left + DRAGGABLE_WIDTH, rect.right - DRAGGABLE_WIDTH) + 'px';
        draggable.style.top = randomIntFromInterval(rect.top + DRAGGABLE_HEIGHT, rect.bottom - DRAGGABLE_HEIGHT) + 'px';

        draggable.style.transform = 'rotate(' + randomIntFromInterval(1, 360 / ROTATION_OFFSET) * ROTATION_OFFSET + 'deg)';
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

let isDragging = false;

document.onmousedown = function (event) {
    if (win) {
        return;
    }

    let element = event.target.closest('.draggable');
    if (!element) return;

    event.preventDefault();

    element.ondragstart = function () {
        return false;
    };

    if (event.button === 1) {
        rotate(element)

        if (checkWin()) {
            playAnimation()
            win = true
        }
        return;
    }

    let shiftX, shiftY;
    if (event.button === 0) {
        startDrag(element, event.clientX, event.clientY);
    }

    function onMouseUp() {
        finishDrag();
    }

    function onMouseMove(event) {
        moveAt(event.clientX, event.clientY);
    }

    function rotate(animalElement) {
        let transformAttribute = animalElement.style.transform;
        let newDeg = (Number(transformAttribute.substring(
            transformAttribute.indexOf('(') + 1,
            transformAttribute.indexOf('deg)')
        )) + ROTATION_OFFSET) % 360;
        animalElement.style.transform = `rotate(${newDeg}deg)`;
    }

    function showAlias(element, activate = true) {
        activate
            ? element.classList.add('selected')
            : element.classList.remove('selected')

        const draggables = document.getElementsByClassName('draggable');
        for (let i = 0; i < draggables.length; i++) {
            const draggable = draggables[i];
            if (draggable === element) {
                continue;
            }

            activate
                ? draggable.classList.add('droppable')
                : draggable.classList.remove('droppable')
        }
    }

    function startDrag(element, clientX, clientY) {
        if (isDragging) {
            return;
        }

        isDragging = true;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        shiftX = clientX - element.getBoundingClientRect().left;
        shiftY = clientY - element.getBoundingClientRect().top;

        element.style.position = 'fixed';

        showAlias(element)

        moveAt(clientX, clientY);
    }

    function checkWin() {
        const draggables = document.getElementsByClassName('draggable');
        for (let i = 0; i < draggables.length; i++) {
            const draggable = draggables[i];
            let friend = undefined

            if (draggable.classList.contains("first_group")) {
                friend = Array.from(draggables).filter(element => element.classList.contains("first_group") && element !== draggable)[0];
            } else if (draggable.classList.contains("second_group")) {
                friend = Array.from(draggables).filter(element => element.classList.contains("second_group") && element !== draggable)[0];
            }
            if (!friend) {
                return false
            }

            const draggableRect = draggable.getBoundingClientRect();
            const friendRect = friend.getBoundingClientRect();
            const distance = Math.sqrt(Math.pow(draggableRect.x - friendRect.x, 2) + Math.pow(draggableRect.y - friendRect.y, 2));
            if (distance > 125) {
                return false
            }

            if (draggable.style.transform !== 'rotate(0deg)' && draggable.style.transform !== 'rotate(360deg)') {
                return false
            }
        }

        return true
    }

    function playAnimation() {
        const draggables = document.querySelectorAll("#animal_1, #animal_2, #animal_3, #animal_4")
        for (let i = 0; i < draggables.length; i++) {
            const draggable = draggables[i];
            const backgroundImageNameSplit = window.getComputedStyle(draggable).backgroundImage.split(".");
            draggable.style.backgroundImage = backgroundImageNameSplit[backgroundImageNameSplit.length - 2] + "_animated." + backgroundImageNameSplit[backgroundImageNameSplit.length - 1]
        }
    }

    function finishDrag() {
        if (!isDragging) {
            return;
        }

        isDragging = false;

        element.style.position = 'absolute';

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        showAlias(element, false)

        if (checkWin()) {
            playAnimation()
            win = true
        }
    }

    function moveAt(clientX, clientY) {
        let newLeft = clientX - shiftX;
        let newTop = clientY - shiftY;

        if (newLeft < field.offsetLeft) {
            newLeft = field.offsetLeft;
        }

        let right = field.getBoundingClientRect().right - element.offsetWidth;
        if (newLeft > right) {
            newLeft = right;
        }

        if (newTop < field.offsetTop) {
            newTop = field.offsetTop;
        }

        let bottom = field.getBoundingClientRect().bottom - element.offsetHeight;
        if (newTop > bottom) {
            newTop = bottom;
        }

        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
    }
}