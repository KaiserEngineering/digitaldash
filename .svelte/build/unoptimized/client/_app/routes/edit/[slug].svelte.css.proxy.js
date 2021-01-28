// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".alertContainer.svelte-19k1p7q{padding:5px;margin:5px;border-radius:0.5em;border:grey;border-width:1px;border-style:solid}.delete.svelte-19k1p7q{background-color:rgb(220, 176, 176)}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}