class SettingsForm {
  constructor(settingsFormId) {
    this.settingsForm = document.getElementById(settingsFormId);
    this.schemePath = this.settingsForm.querySelector('[name="scheme-path"]');
    this.skipFiles = this.settingsForm.querySelector('[name="skip-files"]');
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('selectFile', this.selectFileHandler.bind(this));
    document.addEventListener('kickFile', this.kickFileHandler.bind(this));
  }

  selectFileHandler(e) {
    console.log(e);
    this.schemePath.value = e.detail;
  }

  kickFileHandler(e) {
    console.log(e);
    this.schemePath.value = null;
  }

}

export default SettingsForm;
