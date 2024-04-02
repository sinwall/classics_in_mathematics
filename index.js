const fs = require('fs');
const path = require('path');
const express = require('express');
const nodeHtmlParser = require('node-html-parser');

let htmlBook = fs.readFileSync('./static/on-spirals/ELH&KOC&KOM-HTML.txt', 'utf-8');
htmlBook = nodeHtmlParser.parse(htmlBook);
let dgmParams = fs.readFileSync('./static/on-spirals/diagram-parameters.csv', 'utf-8');
dgmParams = dgmParams.split(/\r?\n/g)
    .map(
        function (line) {return line.split(',');} 
    );

const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/module-three', express.static(path.join(__dirname, 'node_modules/three')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(
    '/metadata/on-spirals', 
    function (req, res) {
        let result = {
            languages: ['ELH', 'KOC', 'KOM'],
            languagesDetail: ['그리스어 원문', '우리말(고전학자)', '우리말(수학자)'],
            sections: []
        };
        let body = htmlBook.querySelector('body');
        for (let section of body.childNodes) {
            if (section.rawTagName !== 'div') {continue;}
            result.sections.push(section.getAttribute('n'));
        }
        res.send(JSON.stringify(result));
    }
);

app.get(
    /\/text\/on-spirals\/(Intro|Prop[0-9]{2})\/(ELH|KOC|KOM)/, 
    function (req, res) {
        let lang = req.originalUrl.split('/')[4];
        let divName = req.originalUrl.split('/')[3];
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

const PORT = 8608;
app.listen(PORT, function() {
    console.log(`Application running on port ${PORT}`);
});