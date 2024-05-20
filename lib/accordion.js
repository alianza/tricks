class Accordion {
  constructor(el) {
    this.el = el; // Store the <details> element
    this.summary = el.querySelector('summary'); // Store the <summary> element
    this.content = el.querySelector('div [data-contents]'); // Store the <div data-contents> element
    this.animation = null; // Store the animation object (so we can cancel it if needed)
    this.isClosing = false; // Store if the element is closing
    this.isExpanding = false; // Store if the element is expanding
    this.summary.addEventListener('click', (e) => this.onClick(e)); // Detect user clicks on the summary element
  }

  onClick(e) {
    e.preventDefault();
    this.el.style.overflow = 'hidden';
    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;

    const startHeight = `${this.el.offsetHeight}px`;

    const padding = parseInt(window.getComputedStyle(this.el).paddingInline) * 2;
    const endHeight = `${this.summary.offsetHeight + padding}px`;

    if (this.animation) {
      this.animation.cancel(); // Cancel the current animation
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      { height: [startHeight, endHeight] /* Set the keyframes from the startHeight to endHeight */ },
      { duration: 500, easing: 'ease-in-out' },
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;

    const padding = parseInt(window.getComputedStyle(this.el).paddingInline) * 3;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight + padding}px`;

    if (this.animation) {
      this.animation.cancel(); // Cancel the current animation
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      { height: [startHeight, endHeight] /* Set the keyframes from the startHeight to endHeight */ },
      { duration: 500, easing: 'ease-in-out' },
    );
    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = '';
  }
}

export default Accordion;
