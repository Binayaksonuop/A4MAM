const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', 'pages', 'home');
const homeHtmlPath = path.join(baseDir, 'home.component.html');
const homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');

const mIdx = homeHtml.indexOf('<!-- MISSION SECTION (FULL PREMIUM REDESIGN) -->');
const cIdx = homeHtml.indexOf('<!-- THE CHALLENGE / PROBLEM (DARK THEME) -->');

console.log('Mission Start:', mIdx);
console.log('Challenge Start:', cIdx);
