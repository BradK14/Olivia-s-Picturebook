class Button{
    constructor(funct, textContent, button){
        // The function this button was made to activate
        this.funct = funct;

        // If a button was given, then assign it.  Otherwise make a new one.
        if (button){
            this.button = button;
        }
        else{
            this.button = document.createElement('button');
        }

        // If the button doesn't already have text give it the text that was given
        if (textContent) this.button.textContent = textContent;

        this.button.addEventListener('pointerdown', this.readyToClick);
        this.button.addEventListener('pointerup', this.clickButton);
        this.button.addEventListener('pointerenter', this.hoverButton);
        this.button.addEventListener('pointerleave', this.stopHoveringButton);
        this.button.addEventListener('pointercancel', this.stopHoveringButton);

        this.clicked = false;
    }

    // Functions
    // Removes and resets the button to default values
    disable() {
        this.reset();
        this.button.remove();
    }

    reset() {
        this.button.classList.remove('hovering');
        this.clicked = false;
    }

    // These functions are the default functions for any button actions
    readyToClick = () => {
        this.clicked = true;
    }

    clickButton = (e) => {
        if (this.clicked) this.funct(e);
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
