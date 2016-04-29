class ColorScheme {
  constructor(colorsWrapperId, modalId) {
    this.colorsWrapper = document.getElementById(colorsWrapperId);
    this.modal = document.getElementById(modalId);
    this.bindEvents();
  }

  bindEvents() {
    this.colorsWrapper.addEventListener('dblclick', this.modalToggler.bind(this));
    this.modal.addEventListener('click', this.modalHandler.bind(this));
    document.addEventListener('keyup', this.escHandler.bind(this));
  }

  modalToggler(e) {
    var target = e.target;
    var title = target.title;
    var bg;
    var modalContent = this.modal.querySelector('#modal-content');
    var modalTitle = this.modal.querySelector('#modal-title');
    if (this.isColorElement(target)) {
      bg = target.style.background;
      modalContent.innerHTML = this.createLinkList(title);
      this.modal.style.display = 'block';
      this.modal.style.background = bg;
      this.modal.style.boxShadow = '0 12px 110px ' + bg;
      modalTitle.innerText = target.getElementsByTagName('b')[0].innerText;
    } else {
      console.log('what to do here?');
      // modal.style.display = 'block';
    }
  }

  modalHandler(e) {
    var target = e.target;
    var title = target.title;
    var bg;
    var modalContent = this.modal.querySelector('#modal-content');
    var modalTitle = this.modal.querySelector('#modal-title');

    if (target.id === 'close') {
      this.modal.style.display = 'none';
      this.modal.style.background = 'rgba(250,250,250,0.95)';
    } else if (target.className === 'color') {
      bg = target.style.background;
      modalContent.innerHTML = createLinkList(title);
      this.modal.style.display = 'block';
      this.modal.style.background = bg;
      this.modal.style.boxShadow = '0 12px 110px ' + bg;
      modalTitle.innerText = target.getElementsByTagName('b')[0].innerText;
    } else if (target.className === 'xray-link') {
      this.xrayHandler(target.text);
    } else {
      this.modal.style.display = 'block';
    }
  }

  isColorElement(target) {
    let className = target.className;
    return className.indexOf('color') >= 0;
  }

  createLinkList(text) {
    var textArr = text.split('\n');
    var tmp = '';
    for (var i = 0, len = textArr.length; i < len; i++) {
      tmp += '<a href="#' + textArr[i] + '" class="xray-link">' + textArr[i] + '</a><br>';
    }
    return tmp;
  }

  xrayHandler(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'xray?open=' + path, false);
    xhr.send();
    if (xhr.status != 200) {
      console.error(xhr.status, xhr.statusText);
    } else {
      console.log(xhr.responseText);
    }
  }


  escHandler(e) {
    console.log(e);
    if (e.keyCode === 27) {
      this.modal.style.display = 'none';
    }
  }
}

export default ColorScheme;
