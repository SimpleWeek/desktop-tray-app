import { ipcRenderer } from 'electron';

export function showNotification(title, body, icon) {
  var nativeNotification = new Notification(title, {
    body,
    icon: icon || false
  });
  nativeNotification.onclick = function () {
    ipcRenderer.send('reopen-window');
  };
}
