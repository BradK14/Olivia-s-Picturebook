class Button{
    constructor(funct, textContent){
        this.funct = funct;

        this.button = document.createElement('button');

        this.button.addEventListener('pointerdown', this.readyToClick);
        this.button.addEventListener('pointerup', this.clickButton);
        this.button.addEventListener('pointerenter', this.hoverButton);
        this.button.addEventListener('pointerleave', this.stopHoveringButton);
        this.button.addEventListener('pointercancel', this.stopHoveringButton);

        if (textContent) this.button.textContent = textContent;

        this.clicked = false;
    }

    disable() {
        this.button.classList.remove('hovering');
        this.clicked = false;
        this.button.remove();
    }

    readyToClick = () => {
        this.clicked = true;
    }

    clickButton = () => {
        if (this.clicked) this.funct();
    }

    hoverButton = () => {
        this.button.classList.add('hovering');
        this.button.style.setProperty('--color', 'rgb(127, 127, 255)');
    }

    stopHoveringButton = () => {
        this.button.classList.remove('hovering');
        this.button.style.setProperty('--color', 'rgb(191, 191, 255)');
        this.clicked = false;
    }
}
