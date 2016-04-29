class DirSelector {
  constructor(dirWrapperId) {
    this.dirWrapper = document.getElementById(dirWrapperId);
    this.files = this.dirWrapper.querySelectorAll('.file');
    this.dirs = this.dirWrapper.querySelectorAll('.dir');
    this.bindEvents();
  }

  bindEvents() {
    this.dirWrapper.addEventListener('click', this.wrapperClickHandler.bind(this));
  }


  wrapperClickHandler(e) {
    var target = e.target;
    var className = target.getAttribute('class');
    if (className.indexOf('dir') >= 0) {
      e.preventDefault();
      this._dirClickHandler(target);
    } else if (className.indexOf('file') >= 0) {
      e.preventDefault();
      this._fileClickHandler(target);
    }
    console.log(target);
  }

  _fileClickHandler(target) {
    console.log(`file job ${target.href}`);
    if (target.parentNode.className.indexOf('selected') >= 0) {
      let kickFileEvent = new CustomEvent('kickFile', { detail: target.title });
      document.dispatchEvent(kickFileEvent);
    } else {
      let selectFileEvent = new CustomEvent('selectFile', { detail: target.title });
      document.dispatchEvent(selectFileEvent);
    }

    let oldSelected = target.offsetParent.querySelectorAll('.selected');
    for (var len = oldSelected.length, i = 0; i < len; i++) {
      oldSelected[i].classList.toggle('selected');
    }
    target.parentNode.classList.toggle('selected');
  }

  _dirClickHandler(target) {
    var siblings = target.nextSibling;
    siblings.classList.toggle('collapse');
  }

}

export default DirSelector;
