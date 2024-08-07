---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---
<!-- markdownlint-disable MD033 -->

# Usage

You can start by selecting your DLink router's backup file `config.xml`.

<label class="btn">
Select your config.xml file
<input
  type="file"
  name="decrypt"
  class="hidden"
  data-decrypt />
</label>

<section class="hidden" data-result>
  <h2>Decrypted Successfully</h2>
  <p>
    The decrypted contents of <code>config.xml</code> file can be downloaded from here:
  </p>
  <p><a class="btn" download="config-decrypted.txt" data-link>Download decrypted config.xml</a></p>
  <section>
    <p>Attempting to extract PPPoE Credentials:</p>
    <table>
      <thead>
        <tr>
          <th>Connection Name</th>
          <th>Username</th>
          <th>Password</th>
          <th>Decoded Password</th>
        </tr>
      </thead>
      <tbody data-credentials>
        <tr data-template class="hidden">
          <td data-name></td>
          <td data-username></td>
          <td data-password></td>
          <td data-decoded></td>
        </tr>
      </tbody>
    </table>
  </section>
</section>

<section class="hidden" data-error>
<h2>Error decrypting file</h2>
<p data-error-content></p>
</section>

## Explanation

So you've moved to a new place, and want to switch to your own, gaming grade powerful router.
However THE MAN (your landlord, internet provider, parent, or maybe significant other)
has installed a DLink router that is decades old, slow and creaky.

You could just replace it and plug the cable from the fiber optic modem directly, but you don't know the password to
the PPPoE configuration and THE MAN has either forgotten or doesn't want to provide you with the goods.

Turns out, if you have physical access to the hardware, there is not much that can stop you. Once in the admin interface <http://192.168.0.1> you can just download the backup, and extract the password from there.

It appears as though it is an "encrypted" file. But its all security by obscurity. After [reading up a little bit on it in stack overflow](https://superuser.com/questions/1543100/cant-open-this-config-xml-file-which-is-from-my-router) I found out that its just a zip with 32 bytes of metadata appended to the top.

> Be careful with `RouterPassView` - the distributions I've managed to find were mostly viruses.

With some simple NodeJS code it turned out this could easily be decrypted from the command line, and that's what I used.

```js
const { readFileSync } = require("fs");
const zlib = require("zlib");

const data = readFileSync("./config.xml");
const zipped = data.subarray(32);
zlib.inflate(zipped, (err, buffer) => {
  console.log(buffer.toString());
});
```

But I assume not everyone is proficient with NodeJS so I figured I might rewrite it as an in-browser plain javascript code. I've tested this with DLink DIR 825 router, but I presume it would work with others.

If you stumble on this page and successfully decode yours, please drop me a line in Github so I know I've helped someone!

