// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".notifications.svelte-mlqs8o{width:50%;left:25%;right:25%;z-index:2;position:fixed}.notification.svelte-mlqs8o{position:relative}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}