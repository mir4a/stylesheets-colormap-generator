/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ColorScheme2 = __webpack_require__(1);

	var _ColorScheme3 = _interopRequireDefault(_ColorScheme2);

	var _DirSelector = __webpack_require__(2);

	var _DirSelector2 = _interopRequireDefault(_DirSelector);

	var _SettingsForm = __webpack_require__(3);

	var _SettingsForm2 = _interopRequireDefault(_SettingsForm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ExtendedColorScheme = function (_ColorScheme) {
	  _inherits(ExtendedColorScheme, _ColorScheme);

	  function ExtendedColorScheme(colorsWrapperId, modalId, mergeWrapperId, shareButtonId) {
	    _classCallCheck(this, ExtendedColorScheme);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtendedColorScheme).call(this, colorsWrapperId, modalId));

	    _this.mergeWrapper = document.getElementById(mergeWrapperId);
	    _this.mergeItems = _this.mergeWrapper.querySelectorAll('.merge-item');
	    _this.shareButton = document.getElementById(shareButtonId);
	    _this.colorsOverlay = _this.colorsWrapper.querySelector('.colors-overlay');
	    _this.selectedColors = [];
	    _this.bindNewEvents();
	    return _this;
	  }

	  _createClass(ExtendedColorScheme, [{
	    key: 'bindNewEvents',
	    value: function bindNewEvents() {
	      var _this2 = this;

	      [].concat(_toConsumableArray(this.mergeItems)).forEach(function (item) {
	        item.addEventListener('click', _this2.mergeHandler.bind(_this2));
	        item.addEventListener('mouseenter', _this2.setOverlayColor.bind(_this2));
	        item.addEventListener('mouseleave', _this2.resetOverlayColor.bind(_this2));
	      });
	      this.shareButton.addEventListener('click', this.downloadHTML.bind(this));
	      this.colorsWrapper.addEventListener('click', this.selectColors.bind(this));
	    }
	  }, {
	    key: 'resetOverlayColor',
	    value: function resetOverlayColor(e) {
	      this.colorsOverlay.style.background = 'none';
	      this.colorsOverlay.style.display = 'none';
	    }
	  }, {
	    key: 'setOverlayColor',
	    value: function setOverlayColor(e) {
	      var target = e.target;
	      var mergeColor = target.dataset.mergeColor;
	      this.colorsOverlay.style.background = mergeColor;
	      this.colorsOverlay.style.setProperty('display', 'block', 'important');
	    }
	  }, {
	    key: 'mergeHandler',
	    value: function mergeHandler(e) {
	      var target = e.currentTarget;
	      var mergeVariable = target.dataset.mergeVariable;
	      this._mergeRequestHandler(mergeVariable, this.selectedColors);
	      return target;
	    }
	  }, {
	    key: 'downloadHTML',
	    value: function downloadHTML(e) {
	      var xhr = new XMLHttpRequest();
	      xhr.responseType = 'blob';
	      xhr.onload = function () {
	        var a = document.createElement('a');
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
	  }, {
	    key: 'selectColors',
	    value: function selectColors(e) {
	      var target = e.target;
	      var classList = target.classList;
	      var color = target.dataset.color;
	      if (classList.toggle('selected')) {
	        this.selectedColors.push(color);
	      } else {
	        var index = this.selectedColors.indexOf(color);
	        this.selectedColors.splice(index, 1);
	      }
	      return this._toggleMergePanel();
	    }
	  }, {
	    key: '_toggleMergePanel',
	    value: function _toggleMergePanel() {
	      var selected = this.selectedColors.length > 0;
	      this.mergeWrapper.style.visibility = selected ? 'visible' : 'hidden';
	      return selected;
	    }
	  }, {
	    key: '_mergeRequestHandler',
	    value: function _mergeRequestHandler(mergeTo, colors) {
	      var _this3 = this;

	      var xhr = new XMLHttpRequest();
	      var colorsParam = colors.join(';');
	      var params = 'mergeTo=' + encodeURIComponent(mergeTo) + '&colors=' + encodeURIComponent(colorsParam);
	      xhr.open('GET', '/merge?' + params, true);
	      xhr.send();
	      this._toggleLoader();

	      xhr.onreadystatechange = function () {
	        if (xhr.readyState != 4) return;

	        if (xhr.status != 200) {
	          alert(xhr.status + ': ' + xhr.statusText);
	        } else {
	          _this3._hideMergedColors(colors);
	          _this3._toggleLoader();
	        }
	      };
	    }
	  }, {
	    key: '_hideMergedColors',
	    value: function _hideMergedColors(colors) {
	      if (!colors) return;
	      for (var i in colors) {
	        var colorEl = this.colorsWrapper.querySelector('[data-color="' + colors[i] + '"]');
	        colorEl.style.display = 'none';
	      }
	      this.selectedColors = [];
	    }
	  }, {
	    key: '_toggleLoader',
	    value: function _toggleLoader() {
	      var body = document.getElementsByTagName('body')[0];
	      body.classList.toggle('loading');
	    }
	  }]);

	  return ExtendedColorScheme;
	}(_ColorScheme3.default);

	if (document.getElementById('colors')) {
	  var colorScheme = new ExtendedColorScheme('colors', 'modal', 'merge', 'share-colors');
	}

	if (document.getElementById('dir-structure')) {
	  var dirSelector = new _DirSelector2.default('dir-structure');
	}

	if (document.getElementById('settings-form')) {
	  var settingsForm = new _SettingsForm2.default('settings-form');
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ColorScheme = function () {
	  function ColorScheme(colorsWrapperId, modalId) {
	    _classCallCheck(this, ColorScheme);

	    this.colorsWrapper = document.getElementById(colorsWrapperId);
	    this.modal = document.getElementById(modalId);
	    this.bindEvents();
	  }

	  _createClass(ColorScheme, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      this.colorsWrapper.addEventListener('dblclick', this.modalToggler.bind(this));
	      this.modal.addEventListener('click', this.modalHandler.bind(this));
	      document.addEventListener('keyup', this.escHandler.bind(this));
	    }
	  }, {
	    key: 'modalToggler',
	    value: function modalToggler(e) {
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
	  }, {
	    key: 'modalHandler',
	    value: function modalHandler(e) {
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
	  }, {
	    key: 'isColorElement',
	    value: function isColorElement(target) {
	      var className = target.className;
	      return className.indexOf('color') >= 0;
	    }
	  }, {
	    key: 'createLinkList',
	    value: function createLinkList(text) {
	      var textArr = text.split('\n');
	      var tmp = '';
	      for (var i = 0, len = textArr.length; i < len; i++) {
	        tmp += '<a href="#' + textArr[i] + '" class="xray-link">' + textArr[i] + '</a><br>';
	      }
	      return tmp;
	    }
	  }, {
	    key: 'xrayHandler',
	    value: function xrayHandler(path) {
	      var xhr = new XMLHttpRequest();
	      xhr.open('GET', 'xray?open=' + path, false);
	      xhr.send();
	      if (xhr.status != 200) {
	        console.error(xhr.status, xhr.statusText);
	      } else {
	        console.log(xhr.responseText);
	      }
	    }
	  }, {
	    key: 'escHandler',
	    value: function escHandler(e) {
	      console.log(e);
	      if (e.keyCode === 27) {
	        this.modal.style.display = 'none';
	      }
	    }
	  }]);

	  return ColorScheme;
	}();

	exports.default = ColorScheme;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DirSelector = function () {
	  function DirSelector(dirWrapperId) {
	    _classCallCheck(this, DirSelector);

	    this.dirWrapper = document.getElementById(dirWrapperId);
	    this.files = this.dirWrapper.querySelectorAll('.file');
	    this.dirs = this.dirWrapper.querySelectorAll('.dir');
	    this.bindEvents();
	  }

	  _createClass(DirSelector, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      this.dirWrapper.addEventListener('click', this.wrapperClickHandler.bind(this));
	    }
	  }, {
	    key: 'wrapperClickHandler',
	    value: function wrapperClickHandler(e) {
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
	  }, {
	    key: '_fileClickHandler',
	    value: function _fileClickHandler(target) {
	      console.log('file job ' + target.href);
	      if (target.parentNode.className.indexOf('selected') >= 0) {
	        var kickFileEvent = new CustomEvent('kickFile', { detail: target.title });
	        document.dispatchEvent(kickFileEvent);
	      } else {
	        var selectFileEvent = new CustomEvent('selectFile', { detail: target.title });
	        document.dispatchEvent(selectFileEvent);
	      }

	      var oldSelected = target.offsetParent.querySelectorAll('.selected');
	      for (var len = oldSelected.length, i = 0; i < len; i++) {
	        oldSelected[i].classList.toggle('selected');
	      }
	      target.parentNode.classList.toggle('selected');
	    }
	  }, {
	    key: '_dirClickHandler',
	    value: function _dirClickHandler(target) {
	      var siblings = target.nextSibling;
	      siblings.classList.toggle('collapse');
	    }
	  }]);

	  return DirSelector;
	}();

	exports.default = DirSelector;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SettingsForm = function () {
	  function SettingsForm(settingsFormId) {
	    _classCallCheck(this, SettingsForm);

	    this.settingsForm = document.getElementById(settingsFormId);
	    this.schemePath = this.settingsForm.querySelector('[name="scheme-path"]');
	    this.skipFiles = this.settingsForm.querySelector('[name="skip-files"]');
	    this.bindEvents();
	  }

	  _createClass(SettingsForm, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      document.addEventListener('selectFile', this.selectFileHandler.bind(this));
	      document.addEventListener('kickFile', this.kickFileHandler.bind(this));
	    }
	  }, {
	    key: 'selectFileHandler',
	    value: function selectFileHandler(e) {
	      console.log(e);
	      this.schemePath.value = e.detail;
	    }
	  }, {
	    key: 'kickFileHandler',
	    value: function kickFileHandler(e) {
	      console.log(e);
	      this.schemePath.value = null;
	    }
	  }]);

	  return SettingsForm;
	}();

	exports.default = SettingsForm;

/***/ }
/******/ ]);