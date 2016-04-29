import ColorScheme from './ColorScheme';
import DirSelector from './DirSelector';
import SettingsForm from './SettingsForm';

class ExtendedColorScheme extends ColorScheme {
  constructor(colorsWrapperId, modalId, mergeWrapperId, shareButtonId) {
    super(colorsWrapperId, modalId);
    this.mergeWrapper = document.getElementById(mergeWrapperId);
    this.mergeItems = this.mergeWrapper.querySelectorAll('.merge-item');
    this.shareButton = document.getElementById(shareButtonId);
    this.colorsOverlay = this.colorsWrapper.querySelector('.colors-overlay');
    this.selectedColors = [];
    this.bindNewEvents();
  }

  bindNewEvents() {
    [...this.mergeItems].forEach( item => {
      item.addEventListener('click', this.mergeHandler.bind(this));
      item.addEventListener('mouseenter', this.setOverlayColor.bind(this));
      item.addEventListener('mouseleave', this.resetOverlayColor.bind(this));
    });
    this.shareButton.addEventListener('click', this.downloadHTML.bind(this));
    this.colorsWrapper.addEventListener('click', this.selectColors.bind(this));
  }

  resetOverlayColor(e) {
    this.colorsOverlay.style.background = 'none';
    this.colorsOverlay.style.display = 'none';
  }

  setOverlayColor(e) {
    let target = e.target;
    let mergeColor = target.dataset.mergeColor;
    this.colorsOverlay.style.background = mergeColor;
    this.colorsOverlay.style.setProperty('display', 'block', 'important');
  }

  mergeHandler(e) {
    let target = e.currentTarget;
    let mergeVariable = target.dataset.mergeVariable;
    this._mergeRequestHandler(mergeVariable, this.selectedColors);
    return target;
  }

  downloadHTML(e) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = 'colors.html';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open('GET', '/download', true);
    xhr.send();
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
    let colorsParam = colors.join(';');
    let params = `mergeTo=${encodeURIComponent(mergeTo)}&colors=${encodeURIComponent(colorsParam)}`;
    xhr.open('GET', `/merge?${params}`, true);
    xhr.send();
    this._toggleLoader();

    xhr.onreadystatechange = () => {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
      } else {
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

if (document.getElementById('colors')) {
  var colorScheme = new ExtendedColorScheme('colors', 'modal', 'merge', 'share-colors');
}

if (document.getElementById('dir-structure')) {
  var dirSelector = new DirSelector('dir-structure');
}

if (document.getElementById('settings-form')) {
  var settingsForm = new SettingsForm('settings-form');
}
