const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the start of the form wrap
const startIdx = content.indexOf('<div id="wertermittlung-form-wrap"');
if (startIdx === -1) {
  console.log("Could not find start");
  process.exit(1);
}

// Find the end of success-transition-wrap
const successStr = '<div id="success-transition-wrap"';
let successIdx = content.indexOf(successStr);
if (successIdx === -1) {
    console.log("Could not find success wrap");
    process.exit(1);
}

// We need to find the closing div of success-transition-wrap.
// We know it ends before "</div>\n        </section>\n        <!-- 3-Step Process -->"
const endSectionStr = '</section>\n        <!-- 3-Step Process -->';
let endIdx = content.indexOf(endSectionStr, successIdx);
if (endIdx === -1) {
    console.log("Could not find end");
    process.exit(1);
}

// We should replace from startIdx up to endIdx (excluding the </div> before </section> if possible, but actually we can just replace the whole section content).
// Let's find the closing </div> of the container inside the section.
// Looking at the original HTML:
// <section class="bg-surface-dim pt-md pb-xl md:py-xl" id="wertermittlung">
//    <div class="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop text-center">
//        ...
//        <div id="wertermittlung-form-wrap" ...> ... </div>
//        <div id="success-transition-wrap" ...> ... </div>
//    </div>
// </section>

// So we want to replace from startIdx to the end of success-transition-wrap.
// Let's just use a regex or string replacement.
const stringToReplace = content.substring(startIdx, endIdx);

// We need to keep the </div> that closes the max-w-[1280px] div!
// Wait, endIdx points to </section>. Before that is </div>.
// We will replace `stringToReplace` with `<div id="react-wizard-root" class="w-full"></div>\n                </div>\n        `

content = content.substring(0, startIdx) + 
          '<div id="react-wizard-root" class="w-full text-left"></div>\n                </div>\n        ' + 
          content.substring(endIdx);

// Inject JS script at the end
content = content.replace('</body>', '        <!-- React Wizard Script -->\n        <script type="module" src="/wizard.js"></script>\n</body>');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Replaced successfully!");
