const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\atoba\\Downloads\\Rightech\\src\\app\\modules\\dealer\\pages\\DealerManagement.tsx', 'utf8');

let tags = [];
const regex = /<(\/?[a-zA-Z\.]+)[^>]*>/g;
let match;

while ((match = regex.exec(content)) !== null) {
  let tag = match[1];
  if (tag.endsWith('/')) continue; // Self-closing
  if (tag.startsWith('/')) {
    let closing = tag.substring(1);
    let opening = tags.pop();
    if (opening !== closing) {
      console.log(`Unbalanced tag: opened ${opening}, but closed ${closing} at around line ${content.substring(0, match.index).split('\n').length}`);
      // Break or continue? Usually break to find the first error.
    }
  } else {
    tags.push(tag);
  }
}

if (tags.length > 0) {
  console.log(`Unclosed tags: ${tags.join(', ')}`);
} else {
  console.log('All tags are balanced!');
}
