const fs = require('fs');
const path = require('path');
const express = require('express');
const nodeHtmlParser = require('node-html-parser');

function reloadDgmParams() {
    let dgmParams = fs.readFileSync('./static/on-spirals/diagram-parameters.csv', 'utf-8');
    dgmParams = dgmParams.split(/\r?\n/g)
        .map(
            function (line) {return line.split(',');} 
        );
    return dgmParams
}
function extractTextOnly(content) {
    return content.querySelector('text');
}

function retagDialect(content) {
    content = content.clone();
    for (let el of content.getElementsByTagName('distinct')) {
        if (!(el.getAttribute('type') === 'dialect')) {
            continue;
        }
        let replacement = new nodeHtmlParser.HTMLElement('span', {class: 'text-dialect'});
        el.childNodes.forEach(function(n) {replacement.appendChild(n);});
        el.replaceWith(replacement);
    }
    return content;
}

function retagEmph(content) {
    content = content.clone();
    for (let el of content.getElementsByTagName('emph')) {
        if (!('rend' in el.attributes)) {continue;}
        let rend = el.getAttribute('rend');
        let replacement;
        if (rend === 'teal') {
            replacement = new nodeHtmlParser.HTMLElement('span', {class: 'text-teal'});
        }
        else {
            if (rend === 'underlined') {
                replacement = new nodeHtmlParser.HTMLElement('u', {});
            } else if (rend === 'boldface') {
                replacement = new nodeHtmlParser.HTMLElement('b', {});
            } else if (rend === 'italic') {
                replacement = new nodeHtmlParser.HTMLElement('i', {});
            } 
        }
        el.childNodes.forEach(function(n) {replacement.appendChild(n);});
        el.replaceWith(replacement);
    }
    return content;
}

function resplitFootnotes(content) {
    content = content.clone();
    let body = content.querySelector('body');
    let back = content.querySelector('back');
    back.appendChild(new nodeHtmlParser.HTMLElement('div', {id: 'footnotes-ELH'}, ));
    back.appendChild(new nodeHtmlParser.HTMLElement('div', {id: 'footnotes-KOC'}, ));
    back.appendChild(new nodeHtmlParser.HTMLElement('div', {id: 'footnotes-KOM'}, ));
    for (let el of body.getElementsByTagName('note')) {
        let lang = el.getAttribute('n').split('-')[0];
        let num = el.getAttribute('n').split('-')[1];
        let footnoteNum = (
            `<a id="footnote-${lang}-${num}" href="#footnoteptr-${lang}-${num}"><sup>[${num}] </sup></a>`
        );
        let footnotePtr = nodeHtmlParser.parse(
            `<a id="footnoteptr-${lang}-${num}" href="#footnote-${lang}-${num}"><sup>[${num}] </sup></a>`
        );
        back.querySelector(`#footnotes-${lang}`)
            .appendChild(new nodeHtmlParser.HTMLElement('div', {}));
        el.childNodes.forEach(function (n) {back.querySelector(`#footnotes-${lang}`).lastChild.appendChild(n);});
        back.querySelector(`#footnotes-${lang}`).lastChild.firstChild.innerHTML = (
            footnoteNum + back.querySelector(`#footnotes-${lang}`).lastChild.firstChild.innerHTML
        );
        el.replaceWith(footnotePtr);
    }
    return content;
}

function TEItoHTML(content) {
    content = extractTextOnly(content);
    content = retagDialect(content);
    content = retagEmph(content);
    content = resplitFootnotes(content);
    return content;
}


// main.js

let biblia = fs.readFileSync('static/biblia.csv', 'utf-8');
biblia = biblia.split('\r\n')
    .map((line) => (line.split(',')))
    .slice(1);
bibliaDict = {};
for (let line of biblia) {
    let author = line[0];
    let authorAlias = line[1];
    let bookTitle = line[2];
    let bookTitleAlias = line[3];
    bibliaDict[bookTitle] = {
        author, authorAlias, bookTitle, bookTitleAlias
    };
}


// let htmlBook = fs.readFileSync('./static/on-spirals/ELH&KOC&KOM-TEI.xml', 'utf-8');
// htmlBook = nodeHtmlParser.parse(htmlBook);
// htmlBook = TEItoHTML(htmlBook);
let dgmParams = reloadDgmParams();

const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/module-three', express.static(path.join(__dirname, 'node_modules/three')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(
    /\/metadata\/(.+)/, 
    function (req, res) {
        let bookTitle = req.originalUrl.split('/')[2]
        let result = {
            languages: ['ELH', 'KOC', 'KOM'],
            languagesDetail: ['그리스어 원문', '우리말(고전학자)', '우리말(수학자)'],
            sections: []
        };
        for (let key in bibliaDict[bookTitle]) {
            result[key] = bibliaDict[bookTitle][key];
        }
        // Object.assign(result, bibliaDict[bookTitle]);
        if (bookTitle == 'elements') {result.languages.pop(); result.languagesDetail.pop();}

        let htmlBook = fs.readFileSync(`./static/${bookTitle}/text.xml`, 'utf-8');
        htmlBook = nodeHtmlParser.parse(htmlBook);
        htmlBook = TEItoHTML(htmlBook);

        let body = htmlBook.querySelector('body');
        for (let section of body.childNodes) {
            if (section.rawTagName !== 'div') {continue;}
            result.sections.push(section.getAttribute('n'));
        }
        res.send(JSON.stringify(result));
    }
);

app.get(
    /\/text\/(.+)\/(.+)\/(ELH|KOC|KOM)/, 
    function (req, res) {
        let lang = req.originalUrl.split('/')[4];
        let divName = req.originalUrl.split('/')[3];
        let bookTitle = req.originalUrl.split('/')[2];

        let htmlBook = fs.readFileSync(`./static/${bookTitle}/text.xml`, 'utf-8');
        htmlBook = nodeHtmlParser.parse(htmlBook);
        htmlBook = TEItoHTML(htmlBook);

        let body = htmlBook.querySelector('body');
        let back = htmlBook.querySelector('back');
        let fns = new nodeHtmlParser.HTMLElement('div', {});
        for (let el of body.getElementsByTagName('div')) {
            if (el.getAttribute('n') !== divName) {continue;}
            for (let el2 of el.getElementsByTagName('div')) {
                if (el2.getAttribute('n') !== `${divName}-${lang}`) {continue;}
                el2.querySelectorAll('a')
                    .map(function(n) {return n.getAttribute('href');})
                    .forEach(function(id) {fns.appendChild(back.querySelector(id).parentNode.parentNode.clone())});
                res.send({
                    text: el2.toString(),
                    footnote: fns.toString()
                });
            }
        }
    }
);

app.get(
    /\/diagram-parameters\/on-spirals\/(Intro|Prop[0-9]{2})/,
    function (req, res) {
        let divName = req.originalUrl.split('/')[3];
        let lineStart;
        let result = [];
        for (lineStart=0; lineStart<dgmParams.length; lineStart++) {
            if (!dgmParams[lineStart][0].startsWith('@')) {continue;}
            if (dgmParams[lineStart][1] !== divName) {continue;}
            let lineEnd;
            for (lineEnd=lineStart+1; lineEnd<dgmParams.length; lineEnd++) {
                if (dgmParams[lineEnd][0].startsWith('@')) {break;}
                result.push( dgmParams[lineEnd].join(',') );
            }
            result = result.join('\n');
            res.send(result);
        }
        ;
    }
)

app.get(
    '/debug/reload/diagram-parameters',
    function (req, res) {
        dgmParams = reloadDgmParams();
        res.send('Diagram parameters are reloaded.')
    }
)

const PORT = 8608;
app.listen(PORT, function() {
    console.log(`Application running on port ${PORT}`);
});