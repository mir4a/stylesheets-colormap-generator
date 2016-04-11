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
    this.mergeWrapper.addEventListener('click', this.mergeHandler);
    this.shareButton.addEventListener('click', this.downloadHTML);
    this.colorsWrapper.addEventListener('click', this.selectColors);
  }

  mergeHandler(e) {
    console.log(`mergeHandler: ${e}`);
  }

  downloadHTML() {
    console.log(`downloadHTML: ${e}`);
  }

  selectColors(e) {
    console.log(`selectColors: ${e}`);
  }

}

let colorScheme = new ExtendedColorScheme('colors', 'modal', 'merge', 'share-colors');
