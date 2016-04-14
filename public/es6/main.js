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
    let target = e.target;
    let classList = target.classList;
    if (classList.contains('merge-item')) {
      let mergeColor = target.dataset.mergeColor;
      this._mergeRequestHandler(mergeColor, this.selectedColors);
    } else {
      console.log(e);
    }
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

  _mergeRequestHandler(mergeTo, colors) {
    var xhr = new XMLHttpRequest();
    let colorsParam = colors.join(' ');
    let params = `mergeTo=${encodeURIComponent(mergeTo)}&colors=${encodeURIComponent(colorsParam)}`;
    xhr.open('GET', `/merge?${params}`, true);
    xhr.send();
    this._toggleLoader();

    xhr.onreadystatechange = () => {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
      } else {
        alert(xhr.responseText);
        this._hideMergedColors(colors);
        this._toggleLoader();
      }
    }
  }

  _hideMergedColors(colors) {
    if (!colors) return;
    for (let i in colors) {
      let colorEl = this.colorsWrapper.querySelector(`[data-color="${colors[i]}"]`);
      colorEl.style.display = 'none';
    }
    this.selectedColors = [];
  }

  _toggleLoader() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.toggle('loading');
  }

}

let colorScheme = new ExtendedColorScheme('colors', 'modal', 'merge', 'share-colors');