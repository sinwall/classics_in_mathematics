const fs = require('fs');
const nodeHtmlParser = require('node-html-parser');

function compose(...funcs) {
    let result = function (x) {
        for (let func of funcs) {
            x = func(x);
        }
        return x;
    }
    return result;
}

function debug(go, func) {
    let result;
    if (go) {
        result = function (x) {
            func(x);
            return x;
        }
    } else {
        result = function (x) {return x;}
    }
    return result;
}

function targetFootnotes(document) {
    let footnotes = document.querySelectorAll('div')
    footnotes = footnotes.filter(function (el) {return el.getAttribute('style') === 'mso-element:footnote';})
    return footnotes;
}

function targetMainTexts(document) {
    let mainTexts = document.querySelectorAll('table tr');
    return mainTexts;
}

function removeLineBreaks(content) {
    content = content.clone();
    content.innerHTML = content.innerHTML.replaceAll(/\n|\r/g, '');
    return content;
}

function removeImages(content) {
    content = content.clone();
    for (let el of content.getElementsByTagName('v:imagedata')) {
        el.closest("p").remove();
    }
    return content;
}

function removeEmptyParagraphs(content) {
    content = content.clone();
    for (let el of content.getElementsByTagName('p')) {
        if (el.textContent.trim() === '') {
            el.remove();
        }
    }
    return content;
}

function removeInessentialTags(content) {
    content = content.clone();
    for (let el of content.getElementsByTagName('O:P')) {
        el.remove();
    }
    return content;
}

function removeChildrenButP(content) {
    content = content.clone();
    for (let el of content.childNodes) {
        if (el.rawTagName !== 'p') {
            el.remove();
        }
    }
    return content;
}

function checkAttributeToKeep(attrs, key) {
    if (key === 'style') {
        if (attrs.style.includes('color:red')) {
            return true;
        } else if (attrs.style.includes('color:#00B050')) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function filterAttributes(element) {
    for (let key in element.attributes) {
        if (key === 'style') {
            let colorMatch = element.attributes.style.match(/color:(.+);?/)
            let fnMatch = element.attributes.style.includes('mso-footnote-id');
            if (colorMatch !== null) {
                if (colorMatch[1] == 'red') {
                    element.attributes.style = colorMatch[0];
                } else if (colorMatch[1] == '#00B050') {
                    element.attributes.style = colorMatch[0];
                } else {
                    element.removeAttribute(key);
                }
            } else if (fnMatch) {
                ;
            } else {
                element.removeAttribute(key);
            }
        } else {
            element.removeAttribute(key);
        }
    }
}

function dropAttributes(content) {
    content = content.clone();
    content.getElementsByTagName('p')
        .forEach(filterAttributes);
    content.getElementsByTagName('span')
        .forEach(filterAttributes);
    content.getElementsByTagName('a')
        .forEach(filterAttributes);
    return content;
}

function checkToUnnest(element) {
    if (Object.keys(element.attributes).length === 0) {
        return true;
    } else if (element.innerText.trim() === '') {
        return true;
    } else {
        return false;
    }
}

function unnestTags(content) {
    content = content.clone();
    let completelyReduced;
    do {
        completelyReduced = true;
        for (let el of content.getElementsByTagName('span')) {
            if (checkToUnnest(el)) {
                let clonedChildren = el.childNodes.map(function (n) {return n.clone();});
                el.replaceWith(...clonedChildren);
                completelyReduced = false;
            }
        }
        for (let el of content.getElementsByTagName('a')) {
            if (checkToUnnest(el)) {
                let clonedChildren = el.childNodes.map(function (n) {return n.clone();});
                el.replaceWith(...clonedChildren);
                completelyReduced = false;
            }
        }
    } while (!completelyReduced)
    return content;
}

function unnestIrregularTag(content) {
    // those with `!`
    content = content.clone();
    // content.innerHTML = content.innerHTML.replaceAll(/<!\[.+?\]>/gs, '');
    for (let el of content.getElementsByTagName('a')) {
        el.innerHTML = el.innerHTML.replaceAll(/<!\[.+?\]>/gs, '');
    }
    return content;
}

function refactorRedTexts(content, outputStyle='tei') {
    content = content.clone();
    let getNewReplacement;
    if (outputStyle.toLowerCase() === 'tei') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('distinct', {}, 'type="dialect"');
        }
    } else if (outputStyle.toLowerCase() === 'html') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('span', {class: 'text-dialect'});
        }
    } else {
        ;
    }

    for (let el of content.getElementsByTagName('span')) {
        if (el.attributes.style.includes('color:red')) {
            let replacement = getNewReplacement();
            el.childNodes.forEach(function (n) {replacement.appendChild(n);})
            el.replaceWith(replacement);
        }
    }
    return content;
}

function refactorTealTexts(content, outputStyle='tei') {
    content = content.clone();
    let getNewReplacement;
    if (outputStyle.toLowerCase() === 'tei') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('emph', {}, 'rend="teal"');
        }
    } else if (outputStyle.toLowerCase() === 'html') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('span', {class: 'text-modified'});
        }
    } else {
        ;
    }
    for (let el of content.getElementsByTagName('span')) {
        if (el.attributes.style.includes('color:#00B050')) {
            let replacement = getNewReplacement();
            el.childNodes.forEach(function (n) {replacement.appendChild(n);})
            el.replaceWith(replacement);
        }
    }
    return content;
}

function refactorUnderlines(content, outputStyle='tei') {
    content = content.clone();
    let getNewReplacement;
    if (outputStyle.toLowerCase() === 'tei') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('emph', {}, 'rend="underlined"');
        }
    } else if (outputStyle.toLowerCase() === 'html') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('u');
        }
    } else {
        ;
    }
    for (let el of content.getElementsByTagName('u')) {
        let replacement = getNewReplacement();
        el.childNodes.forEach(function (n) {replacement.appendChild(n);})
        el.replaceWith(replacement);
    }
    return content;
}

function refactorItalics(content, outputStyle='tei') {
    content = content.clone();
    let getNewReplacement;
    if (outputStyle.toLowerCase() === 'tei') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('emph', {}, 'rend="italic"');
        }
    } else if (outputStyle.toLowerCase() === 'html') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('i');
        }
    } else {
        ;
    }
    for (let el of content.getElementsByTagName('i')) {
        let replacement = getNewReplacement();
        el.childNodes.forEach(function (n) {replacement.appendChild(n);})
        el.replaceWith(replacement);
    }
    return content;
}

function refactorBoldfaces(content, outputStyle='tei') {
    content = content.clone();
    let getNewReplacement;
    if (outputStyle.toLowerCase() === 'tei') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('emph', {}, 'rend="boldface"');
        }
    } else if (outputStyle.toLowerCase() === 'html') {
        getNewReplacement = function () {
            return new nodeHtmlParser.HTMLElement('b');
        }
    } else {
        ;
    }
    for (let el of content.getElementsByTagName('b')) {
        let replacement = getNewReplacement();
        el.childNodes.forEach(function (n) {replacement.appendChild(n);})
        el.replaceWith(replacement);
    }
    return content;
}

function cleanFootnote(footnote) {
    footnote = footnote.clone();
    footnote.innerHTML = footnote.innerHTML.replaceAll('</a> ', '</a>');
    footnote.getElementsByTagName('a')[0].remove();
    return footnote;
}

function insertFootnotesIntoMainText(footnotes, footnoteNum, footnoteCategory, outputStyle='TEI') {
    footnotes = footnotes.map(function(n) {return n.clone();});
    function _inner(mainText) {
        mainText = mainText.clone();
        let getNewReplacement;
        if (outputStyle.toLowerCase() === 'tei') {
            getNewReplacement = function () {
                footnoteNum++;
                return new nodeHtmlParser.HTMLElement('note', {}, `n="${footnoteCategory}-${footnoteNum}" place="bottom"`);
            }
        } else if (outputStyle.toLowerCase() === 'html') {
            getNewReplacement = function () {
                footnoteNum++;
                return new nodeHtmlParser.HTMLElement('sup');
            }
        } else {
            ;
        }
        let aTags = mainText.getElementsByTagName('a');
        for (let el of aTags) {
            if (!('style' in el.attributes)) {
                continue;
            }
            let matched = el.attributes.style.match(/mso-footnote-id:\s*ftn([0-9]+)/);
            if (matched === null) { 
                continue;
            }
            let num = Number(matched[1]);
            let footnote = footnotes[num-1];
            let replacement = getNewReplacement();
            if (outputStyle.toLowerCase() === 'tei') {
                // replacement.setAttribute('n', `${num}`);
                footnote.childNodes.forEach(function (n) {replacement.appendChild(n);});
            } else if (outputStyle.toLowerCase() === 'html') {
                el.forEach(function (n) {replacement.appendChild(n);})
            } else {
                ;
            }
            el.replaceWith(replacement);
        }
        return mainText;
    }
    return _inner;
}

function addParagraphNumbers(content) {
    content = content.clone();
    for (let i=1; i<=content.childNodes.length; i++) {
        let child = content.childNodes[i-1];
        child.setAttribute('n', `${i}`);
    }
    return content;
}

function texExtractDocument(texString) {
    texString = texString.match(/\\begin{document}(.+)\\end{document}/s)[1]
    return texString;
}

function texAvoidEntityRef(texString) {
    texString = texString.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
    return texString;
}

function texRemoveLinebreaks(texString) {
    texString = texString.replaceAll('\\\\', '');
    return texString;
}

function texDivideSections(texString) {
    result = ''
    // result = '<div n="Intro-KOM"></div>';
    let num = 0;
    texString = texString.split('\\newpage')
        .forEach(function(s) {
            num++;
            let sectionName = 'Prop' + String(num).padStart(2, '0');
            s = s.trim();
            result += `<div n="${sectionName}-KOM">${s}</div>`;
        })
    // let padTo = 12;
    // while (num < padTo) {
    //     num++;
    //     let sectionName = 'Prop' + String(num).padStart(2, '0');
    //     result += `<div n="${sectionName}-KOM"></div>`
    // }
    return result;
}

function texTagFootnotes(texString) {
    let footnoteNum = 0;
    texString = texString.replaceAll(
        /\\footnote{([^{}]+)}/gs, 
        function (match, p1) {
            footnoteNum++; 
            result = `<note n="KOM-${footnoteNum}" place="bottom"><p>${p1}</p></note>`
            return result
        }
    );
    return texString;
}

let texSepToken = '\\newp'

function texTagTheorem(texString) {
    texString = texString.replaceAll(
        /\\begin{theorem}(.+?)\\end{theorem}/gs,
        function (match, p1) {
            result = '<p><emph rend="boldface">정리. </emph>\n';
            result += p1.split(texSepToken)
                .map(function(s) {return s.trim();})
                .join('</p><p>');
            result += '</p>';
            return result;
        }
    );
    return texString;
}

function texTagProof(texString) {
    texString = texString.replaceAll(
        /\\begin{proof}(.+?)\\end{proof}/gs,
        function (match, p1) {
            result = '<p><emph rend="boldface">증명. </emph>\n';
            result += p1.split(texSepToken)
                .map(function(s) {return s.trim();})
                .join('</p><p>');
            result += '</p>';
            return result;
        }
    );
    return texString;
}

let remarkCounter = 0;
function texTagRemark(texString) {
    texString = texString.replaceAll(
        /\\begin{remark}(.+?)\\end{remark}/gs,
        function (match, p1) {
            return '';
            remarkCounter++;
            result = `<note n="KOM-r${remarkCounter}"><span><emph rend="boldface">참고. </emph>\n`;
            result += p1.split(texSepToken)
                .map(function(s) {return s.trim();})
                .join('</span><span>');
            result += '</span></note>';
            return result;
        }
    );
    return texString;
}

function HTMtoTEI(htmlString, texString) {
    let htmlCont = nodeHtmlParser.parse(htmlString);
    let mainTexts = targetMainTexts(htmlCont);
    let footnotes = targetFootnotes(htmlCont);
    let outputStyle = 'TEI';
    let xml = nodeHtmlParser.parse(minimalTEITemplate);
    let xmlBody = xml.querySelector('body')
    footnotes = footnotes.map(
        compose(
            removeLineBreaks,
            removeImages,
            removeEmptyParagraphs,
            removeInessentialTags,
            removeChildrenButP,
            dropAttributes,
            unnestTags,
            unnestIrregularTag,
            refactorRedTexts,
            refactorTealTexts,
            refactorUnderlines,
            refactorItalics,
            refactorBoldfaces,
            cleanFootnote
        )
    )
    if (texString) {
        texString = compose(
            texExtractDocument,
            texAvoidEntityRef,
            texRemoveLinebreaks,
            texDivideSections,
            texTagFootnotes,
            texTagTheorem,
            texTagProof,
            texTagRemark
        )(texString)
        
    }

    let footnoteNumELH = 0;
    let footnoteNumKOC = 0;
    for (let row=1; row<mainTexts.length; row++) {
        let rowContent = mainTexts[row].querySelectorAll('td');
        let divName = rowContent[0].textContent.trim();
        let textELH = rowContent[3];
        let textKOC = rowContent[4];
        textELH = compose(
            removeLineBreaks,
            removeImages,
            removeEmptyParagraphs,
            removeInessentialTags,
            removeChildrenButP,
            dropAttributes,
            unnestTags,
            unnestIrregularTag,
            refactorRedTexts,
            refactorTealTexts,
            refactorUnderlines,
            refactorItalics,
            refactorBoldfaces,
            insertFootnotesIntoMainText(footnotes, footnoteNumELH, 'ELH'),
            addParagraphNumbers
        )(textELH);
        footnoteNumELH += textELH.getElementsByTagName('note').length;
        textKOC = compose(
            removeLineBreaks,
            removeImages,
            removeEmptyParagraphs,
            removeInessentialTags,
            removeChildrenButP,
            dropAttributes,
            unnestTags,
            unnestIrregularTag,
            refactorRedTexts,
            refactorTealTexts,
            refactorUnderlines,
            refactorItalics,
            refactorBoldfaces,
            insertFootnotesIntoMainText(footnotes, footnoteNumKOC, 'KOC'),
            addParagraphNumbers
        )(textKOC);
        footnoteNumKOC += textKOC.getElementsByTagName('note').length;
        if (textELH.childNodes.length !== textKOC.childNodes.length) {
            throw Error;
        }
        // console.log(divName, textELH.childNodes.length, textKOC.childNodes.length);
        // break;
        xmlBody.appendChild(new nodeHtmlParser.HTMLElement('div', {}, `n="${divName}" type="section"`));
        xmlBody.lastChild.appendChild(new nodeHtmlParser.HTMLElement('div', {}, `n="${divName}-ELH"`));
        textELH.childNodes.forEach(function (n) {xmlBody.lastChild.lastChild.appendChild(n);});
        xmlBody.lastChild.appendChild(new nodeHtmlParser.HTMLElement('div', {}, `n="${divName}-KOC"`));
        textKOC.childNodes.forEach(function (n) {xmlBody.lastChild.lastChild.appendChild(n);});
        if (texString) {
            let texContent = nodeHtmlParser.parse(texString);
            let noMatch = true;
            let textKOM;
            for (textKOM of texContent.childNodes) {
                if ((textKOM.rawTagName !== 'div') || (textKOM.getAttribute('n') !== `${divName}-KOM`)) {
                    continue;
                }
                xmlBody.lastChild.appendChild(textKOM.clone());
                noMatch = false;
                break;
            }
            if (noMatch) {
                textKOM = new nodeHtmlParser.HTMLElement('div', {}, `n="${divName}-KOM"`);
                xmlBody.lastChild.lastChild.childNodes.forEach(function (n) {textKOM.appendChild(new nodeHtmlParser.HTMLElement('p', {}));});
                xmlBody.lastChild.appendChild(textKOM.clone());
            }
            // console.log(divName, xmlBody.lastChild.childNodes[0].childNodes.length, textKOM.querySelectorAll('p').length);
            // if (xmlBody.lastChild.childNodes[0].childNodes.length !== textKOM.querySelectorAll('p').length) {
            //     console.log(textKOM.innerHTML)
            //     throw Error;
            // }
        }
    }
    return xml;
}

let minimalTEITemplate = `
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>On spirals</title>
      </titleStmt>
      <publicationStmt>
        <p>empty statement</p>
      </publicationStmt>
      <sourceDesc>
        <p>empty description</p>
      </sourceDesc>
    </fileDesc>
    <encodingDesc>
      <tagsDecl>
      </tagsDecl>
    </encodingDesc>
  </teiHeader>
  <text>
    <body></body>
    <back></back>
  </text>
</TEI>
`
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
    content = compose(
        extractTextOnly,
        retagDialect,
        retagEmph,
        resplitFootnotes,
    )(content);
    return content;
}

let htmlString = fs.readFileSync('.references/나선들에 관하여 모음.htm', 'utf-8')
let texString = fs.readFileSync('./.references/수학고전_20240306.tex', 'utf-8');
let xml = HTMtoTEI(htmlString, texString);
fs.writeFileSync('./static/on-spirals/ELH&KOC&KOM-TEI.xml', xml.toString());
let html = TEItoHTML(xml);
fs.writeFileSync('./static/on-spirals/ELH&KOC&KOM-HTML.txt', html.toString());
// console.log(texString)