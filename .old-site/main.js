/**
 * @this HTMLInputElement
 * @param {Event}
 */
async function decryptInput() {
  const file = this.files[0];

  const ds = new DecompressionStream("deflate");
  const stream = file.slice(32).stream().pipeThrough(ds);
  const decrypted = await new Response(stream).blob();
  const text = await decrypted.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  for (const a of doc.querySelectorAll("WANPPPConnection")) {
    console.log(a.querySelector("Username").textContent);
    console.log(a.querySelector("Password").textContent);
  }

  const result = document.getElementById("decrypt-result");
  result.href = window.URL.createObjectURL(decrypted);
  result.removeAttribute("disabled");
}

document
  .querySelector("#decrypt-input")
  .addEventListener("change", decryptInput);
