// this is here to render all the stuff in the /docs folder because
// github pages tried to make me use jekyll.

const hljs = require('highlight.js/lib/highlight');
const hljsJs = require('highlight.js/lib/languages/javascript');
hljs.registerLanguage('javascript', hljsJs);
const markdown = require('markdown-it')({ html: true, xhtmlOut: true, highlight });
const mustache = require('mustache');
const fs = require('fs-extra');
const variables = require('./variables.json');

function highlight (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(lang, str).value;
    }
    return '';
}

const TEMPLATES = {};
const PARTIALS = {};

async function loadTemplates () {
    const location = __dirname + '/templates/';
    TEMPLATES.index = await fs.readFile(location + 'index.mustache', 'utf-8');
    TEMPLATES.page = await fs.readFile(location + 'page.mustache', 'utf-8');
}

async function loadPartials () {
    const location = __dirname + '/partials/';
    PARTIALS.contents = await fs.readFile(location + 'contents.mustache', 'utf-8');
    PARTIALS.head = await fs.readFile(location + 'head.mustache', 'utf-8');
    PARTIALS.header = await fs.readFile(location + 'header.mustache', 'utf-8');
}

function fixLinks (str) {
    return str
        .replace(/\]\(docs\/assets\//g, '](/assets/')
        .replace(/\]\(md\//g, '](/pages/')
        .replace(/\.md\)/g, '.html)');
}

async function processDoc (file, template, view = {}) {
    const raw = await fs.readFile(file, 'utf-8');
    const md = markdown.render(fixLinks(raw));
    return mustache.render(TEMPLATES[template], Object.assign({ md }, variables, view), PARTIALS);
}

async function savePages () {
    const sourceDir = __dirname + '/../md';
    const filenames = await fs.readdir(sourceDir);
    const sourceFiles = filenames.map(filename => sourceDir + '/' + filename);
    const htmls = await Promise.all(sourceFiles.map(file => processDoc(file, 'page')));
    const promises = [];

    const destinationDir = __dirname + '/../docs/pages';
    await fs.emptyDir(destinationDir);

    for (let i = 0; i < filenames.length; i++) {
        const destinationFile = destinationDir + '/' + filenames[i].split('.')[0] + '.html';
        promises.push(fs.writeFile(destinationFile, htmls[i]));
    }

    await Promise.all(promises);
}

async function saveIndex () {
    const file = __dirname + '/../readme.md';
    const html = await processDoc(file, 'index');
    await fs.writeFile(__dirname + '/../docs/index.html', html);
}

async function buildHtml () {
    await loadTemplates();
    await loadPartials();
    await savePages();
    await saveIndex();
}

buildHtml();
