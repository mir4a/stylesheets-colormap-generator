document.addEventListener('dblclick', toggleModal);
document.addEventListener('keyup', escHandler);
function toggleModal(e) {
  console.log(e);
  var modal = document.getElementById('modal');
  var modalContent = document.getElementById('modal-content');
  var modalTitle = document.getElementById('modal-title');
  var target = e.target;
  var title = target.title;
  var bg;
  if (target.id === 'close') {
    modal.style.display = 'none';
    modal.style.background = 'rgba(250,250,250,0.95)';
  } else if (target.className === 'color') {
    bg = target.style.background;
    modalContent.innerHTML = createLinkList(title);
    modal.style.display = 'block';
    modal.style.background = bg;
    modal.style.boxShadow = '0 12px 110px ' + bg;
    modalTitle.innerText = target.getElementsByTagName('b')[0].innerText;
  } else if (target.className === 'xray-link') {
    xrayHanlder(target.text);
  } else {
    modal.style.display = 'block';
  }
}
function escHandler(e) {
  var modal = document.getElementById('modal');
  console.log(e);
  if (e.keyCode === 27) {
    modal.style.display = 'none';
  }
}
function createLinkList(text) {
  var textArr = text.split('\\n');
  var tmp = '';
  for (var i = 0, len = textArr.length; i < len; i++) {
    tmp += '<a href="#' + textArr[i] + '" class="xray-link">' + textArr[i] + '</a><br>';
  }
  return tmp;
}
function xrayHanlder(path) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '${xrayUrl}' + path, false);
  xhr.send();
  if (xhr.status != 200) {
    console.error(xhr.status, xhr.statusText);
  } else {
    console.log(xhr.responseText);
  }
}