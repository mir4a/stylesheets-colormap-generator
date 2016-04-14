import ColorScheme from './ColorScheme.js';

class ExtendedColorScheme extends ColorScheme {
  constructor(colorsWrapperId, modalId, mergeWrapperId, shareButtonId) {
    super(colorsWrapperId, modalId);
    this.mergeWrapper = document.getElementById(mergeWrapperId);
    this.shareButton = document.getElementById(shareButtonId);
    this.selectedColors = [];
    this.bindNewEvents();
  }

  bindNewEvents() {
    this.mergeWrapper.addEventListener('click', this.mergeHandler.bind(this));
    this.shareButton.addEventListener('click', this.downloadHTML.bind(this));
    this.colorsWrapper.addEventListener('click', this.selectColors.bind(this));
  }

  mergeHandler(e) {
    console.log(`mergeHandler: ${JSON.stringify(e)}`);
  }

  downloadHTML() {
    console.log(`downloadHTML: ${e}`);
  }

  selectColors(e) {
    let target = e.target;
    let classList = target.classList;
    let color = target.dataset.color;
    if (classList.toggle('selected')) {
      this.selectedColors.push(color);
    } else {
      let index = this.selectedColors.indexOf(color);
      this.selectedColors.splice(index, 1);
    }
    return this._toggleMergePanel();
  }

  _toggleMergePanel() {
    let selected = this.selectedColors.length > 0;
    this.mergeWrapper.style.visibility = selected ? 'visible' : 'hidden';
    return selected;
  }

}

let colorScheme = new ExtendedColorScheme('colors', 'modal', 'merge', 'share-colors');
