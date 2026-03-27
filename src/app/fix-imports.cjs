const fs = require('fs');
const path = require('path');

const appDir = path.join('C:', 'Users', 'atoba', 'Downloads', 'Rightech', 'src', 'app');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(appDir);

const fileMap = new Map();
for (const f of allFiles) {
  let basename = path.basename(f); // e.g. "Auth.tsx"
  // remove extension
  basename = basename.replace(/\.tsx?$/, '');
  
  if (!fileMap.has(basename)) {
    fileMap.set(basename, f);
  }
}

// Regex to match: from '...' or import('...') or import '...'
const importRegex = /(from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g;

for (const f of allFiles) {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  content = content.replace(importRegex, (match, prefix, importPath) => {
    // Only care about relative imports
    if (!importPath.startsWith('.')) return match;
    
    // Basename of the imported file
    let importedBasename = path.basename(importPath); 
    
    // Special case for UI components if they are indexed
    // e.g. ../../components/ui/button -> button
    
    if (fileMap.has(importedBasename)) {
      const targetPath = fileMap.get(importedBasename);
      
      const currentDir = path.dirname(f);
      let newRelative = path.relative(currentDir, targetPath);
      
      newRelative = newRelative.replace(/\\/g, '/');
      if (!newRelative.startsWith('.')) {
        newRelative = './' + newRelative;
      }
      
      // Remove the .ts/.tsx extension
      newRelative = newRelative.replace(/\.tsx?$/, '');
      
      changed = true;
      return `${prefix}'${newRelative}'`;
    }
    
    return match;
  });

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Updated imports in ${path.basename(f)}`);
  }
}
console.log('Imports fixed.');
