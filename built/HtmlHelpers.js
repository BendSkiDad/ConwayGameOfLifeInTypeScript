export function deriveButton(value, fnClickHandler) {
    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', value);
    if (fnClickHandler) {
        button.addEventListener('click', fnClickHandler);
    }
    button.classList.add('button');
    return button;
}
