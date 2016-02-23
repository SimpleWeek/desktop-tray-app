const ipcRenderer = window.require('electron').ipcRenderer;

export function showNotification(title, body, icon) {
  var nativeNotification = new Notification(title, {
    body,
    icon: icon || false
  });
  nativeNotification.onclick = function () {
    ipcRenderer.send('reopen-window');
  };
}
