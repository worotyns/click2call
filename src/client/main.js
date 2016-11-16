/**
 * Click 2 call on Telecube
 * by Mateusz Worotyński @ pushpushgo.com
 */

var Click2Call = (function (config, window, document) {

  /**
   * Helpers
   */
  function getEl(id) {
    return document.getElementById(id);
  }

  /**
   * Click2Call
   */
  var Click2Call = function () {
    this.modalTimer = null;
    this.blocked = false;
  }

  Click2Call.prototype.unlock = function unlock() {
    this.blocked = false;
    const el = getEl(config.modal.button.id);
    el.classList.toggle('c2c-disabled', false);
  }

  Click2Call.prototype.lock = function lock() {
    this.blocked = true;
    const el = getEl(config.modal.button.id);
    el.classList.toggle('c2c-disabled', true);
  }

  Click2Call.prototype.status = function setStatus(status) {
    var elements = document.getElementsByClassName('c2c-status');
    var i;
    for (i = 0; i < elements.length; i++) {
      elements[i].classList.toggle('hide', true);
    }

    var statusEl = getEl('c2c-status-' + status);
    statusEl.classList.remove('hide');
  }

  Click2Call.prototype.validate = function validate(value) {
    value = parseInt(value);
    return config.modal.input.regexp.test(value);
  }

  Click2Call.prototype.call = function call(phone, onSuccess, onFail) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", config.apiUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        onSuccess(xmlhttp.responseText);
      } else {
        onFail(xmlhttp.responseText);
      }
    }
    xmlhttp.send(JSON.stringify({ phone: phone }));
  }

  Click2Call.prototype.bindModal = function bindModal(delayed) {
    var self = this;
    if (delayed) {
      this.modalTimer = setTimeout(self.showModal.bind(self), delayed || 0);
    }
    const el = getEl(config.modal.button.id);
    el.addEventListener('click', function () {
      if (self.blocked) return;
      self.lock();
      self.status('loading');
      var inputEl = getEl(config.modal.input.id);
      var value = inputEl.value;
      if (self.validate(value)) {
        self.call(value, config.call.onSuccess.bind(self), config.call.onFail.bind(self));
      } else {
        self.status('validate');
        self.unlock();
      }
    });
  }

  Click2Call.prototype.showModal = function showModal() {
    var self = this;

    const el = getEl(config.modal.id);
    const btnEl = getEl(config.modal.button.id);
    const closeBtn = getEl('c2c-modal-close');
    el.classList.toggle(config.modal.class, false);

    closeBtn.addEventListener('click', function onModalClose() {
      self.closeModal();
    })

    el.addEventListener('keypress', function onReturn(e) {
      if (e.which === 13) {
        btnEl.dispatchEvent(new CustomEvent('click'));
      }
    })
  }

  Click2Call.prototype.closeModal = function closeModal() {
    const el = getEl(config.modal.id);
    el.classList.toggle(config.modal.class, true);
  }

  Click2Call.prototype.showButton = function showButton(delayed) {
    var self = this;
    setTimeout(function () {
      const el = getEl(config.button.id);
      if (el) { 
        el.addEventListener('click', function () {
          if (self.modalTimer) clearInterval(self.modalTimer);
          self.showModal();
        });

        el.classList.toggle(config.button.class);
      }
    }, delayed);
  }


  document.addEventListener("DOMContentLoaded", function (event) {
    const instance = new Click2Call();
    if (config.button) instance.showButton(config.button.delay || 0);
    instance.bindModal(config.modal.delay || 0);
  });

})(c2cconfig, window, document);
