/**
 * Requires element on page:
 *  - [data-result] - to be shown when result is complete
 *  - [data-link] - populated with the resulted decrypted text
 *  - [data-credentials] - a list with a template to copy, show and create new item for each connection
 *    - [data-template] - template element
 *      - [data-name] - name of the connection
 *      - [data-username]
 *      - [data-password] - the base64 encoded password
 *      - [data-decoded] - the password decoded
 *
 * If an error is encountered [data-error] is shown and [data-error-content] is populated.
 *
 * @this HTMLInputElement
 * @param {Event}
 */
async function decryptInput() {
  try {
    // Decrypt the file
    const file = this.files[0];
    const ds = new DecompressionStream("deflate");
    const stream = file.slice(32).stream().pipeThrough(ds);
    const decrypted = await new Response(stream).blob();
    const text = await decrypted.text();

    // Display Result Link
    const link = document.querySelector("[data-link]");
    link.href = window.URL.createObjectURL(decrypted);

    const result = document.querySelector("[data-result]");
    result.classList.remove("hidden");

    // Attempt to extract and decode PPPoE credentials
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const credentials = document.querySelector("[data-credentials]");

    for (const connection of doc.querySelectorAll("WANPPPConnection")) {
      const username = connection.querySelector("Username")?.textContent;
      const password = connection.querySelector("Password")?.textContent;
      const name = connection.querySelector("PPPoEServiceName")?.textContent;

      if (username || password) {
        /** @type {HTMLElement} */
        const item = credentials
          .querySelector("[data-template]")
          .cloneNode(true);

        item.classList.remove("hidden");
        item.querySelector("[data-name]").innerText = name;
        item.querySelector("[data-username]").innerText = username;
        item.querySelector("[data-password]").innerText = password;
        item.querySelector("[data-decoded]").innerText = atob(password);

        credentials.append(item);
      }
    }
  } catch (error) {
    const resultErrorContent = document.querySelector("[data-error-content]");
    resultErrorContent.innerText = String(error);
    const resultError = document.querySelector("[data-error]");
    resultError.classList.remove("hidden");
    throw error;
  }
}

document
  .querySelector("[data-decrypt]")
  .addEventListener("change", decryptInput);
