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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ExtendedColorScheme = function (_ColorScheme) {
	  _inherits(ExtendedColorScheme, _ColorScheme);

	  function ExtendedColorScheme(colorsWrapperId, modalId, mergeWrapperId, shareButtonId) {
	    _classCallCheck(this, ExtendedColorScheme);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtendedColorScheme).call(this, colorsWrapperId, modalId));

	    _this.mergeWrapper = document.getElementById(mergeWrapperId);
	    _this.shareButton = document.getElementById(shareButtonId);
	    _this.selectedColors = [];
	    _this.bindNewEvents();
	    return _this;
	  }

	  _createClass(ExtendedColorScheme, [{
	    key: 'bindNewEvents',
	    value: function bindNewEvents() {
	      this.mergeWrapper.addEventListener('click', this.mergeHandler.bind(this));
	      this.shareButton.addEventListener('click', this.downloadHTML.bind(this));
	      this.colorsWrapper.addEventListener('click', this.selectColors.bind(this));
	    }
	  }, {
	    key: 'mergeHandler',
	    value: function mergeHandler(e) {
	      var target = e.target;
	      var classList = target.classList;
	      if (classList.contains('merge-item')) {
	        var mergeVariable = target.dataset.mergeVariable;
	        this._mergeRequestHandler(mergeVariable, this.selectedColors);
	      } else {
	        console.log(e);
	      }
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
	      var _this2 = this;

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
	          _this2._hideMergedColors(colors);
	          _this2._toggleLoader();
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

	// let colorScheme = new ExtendedColorScheme('colors', 'modal', 'merge', 'share-colors');

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

/***/ }
/******/ ]);