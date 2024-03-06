const fs = require('fs');
const nodeHtmlParser = require('node-html-parser')

function toBeReduced(element) {
    return !(
        (('style' in element.attributes) && (element.attributes.style.includes('color:red')))
        // || (element.classList.contains('MsoFootnoteReference'))
    );
}

function cleanColumn(column, footnoteShift=0) {
    // remove image
    for (let el of column.getElementsByTagName('v:imagedata')) {
        el.closest("p").remove();
    }

    // reduce unnecessarily nested elements
    let completelyReduced;
    do {
        completelyReduced = true;
        for (let el of column.getElementsByTagName('O:P')) {
            el.remove();
        }
        for (let el of column.getElementsByTagName('span')) {
            if (toBeReduced(el)) {
                let clonedChildren = el.childNodes.map(function (n) {return n.clone();});
                el.replaceWith(...clonedChildren);
                completelyReduced = false;
            }
        }
    } while (!completelyReduced)

    // simplify p elements
    for (let el of column.getElementsByTagName('p')) {
        if (!el.textContent) {
            el.remove();
        }
        for (let key in el.attributes) {
            el.removeAttribute(key);
        }
    }

    // footnotes
    let footnoteNum = 0;
    for (let el of column.getElementsByTagName('a')) {
        if (el.hasAttribute('href') && el.getAttribute('href').startsWith('#_ftn')) {
            let href = el.getAttribute('href');
            if (href.startsWith('#_ftnref')) {
                footnoteNum = Number(href.replace('#_ftnref', ''));
            } else {
                footnoteNum = Number(href.replace('#_ftn', ''));
            }
            el.removeAttribute('style');
            el.removeAttribute('name');
            el.removeAttribute('title');
            el.removeAttribute('href');
            el.set_content(`<sup>[${footnoteNum+footnoteShift}]</sup>`);
        } else {
            let clonedChildren = el.childNodes.map(function (n) {return n.clone();});
            el.replaceWith(...clonedChildren);
        }
    }
    return {
        paragraphs: column.getElementsByTagName('p').map(
            function(el) {
                return el.innerHTML.trim()
                    .replaceAll(/\r\n/g, '')
                    .replaceAll(/\n/g, '');
            }
        ),
        footnoteNum: footnoteNum,
    };
}

function searchFootnotes(paragraph) {
    let regEx = /<sup>\[(\d+)\]<\/sup>/g
    let execRes;
    let numbers = [];
    while ((execRes = regEx.exec(paragraph)) !== null) {
        numbers.push(Number(execRes[1]));
    }
    return numbers;
}

function structTexFile(text) {
    let result = {
        theorems: [],
        proofs: [],
        footnotes: [],
        remarks: []
    };
    let sepToken = '\\newp';

    text = text.replace("\\\\", "")
        .replaceAll(
            /\\footnote{([^{}]+)}/gs, 
            function (match, p1, offset, string, groups) {
                footnoteIndex++; 
                result.footnotes.push(`<sup>[${footnoteIndex}]</sup>${p1}`);
                return `<sup>[${footnoteIndex}]</sup>`;
            }
        );
    let theorem = text.match(/\\begin{theorem}(.+?)\\end{theorem}/s)[1].trim();
    result.theorems.push(...theorem.split(sepToken));

    let proof = text.match(/\\begin{proof}(.+?)\\end{proof}/s)[1].trim();
    result.proofs.push(...proof.split(sepToken));

    let remark = text.match(/\\begin{remark}(.+?)\\end{remark}/s);
    if ((remark !== null) && (remark[1].trim() !== '')) {
        result.remarks.push(remark[1].trim());
    }
    return result;
}

function convertTexStruct(texStruct) {
    let result = {
        paragraphs: [],
        footnotes: texStruct.footnotes
    };
    for (let i=0; i<texStruct.theorems.length; i++) {
        let p = texStruct.theorems[i];
        if (i == 0) {
            p = `<b>정리.</b> ${p}`;
        } else if (i == texStruct.theorems.length-1) {
            p += '\n\n';
        }
        result.paragraphs.push(p);
    }
    for (let i=0; i<texStruct.proofs.length; i++) {
        let p = texStruct.proofs[i];
        if (i == 0) {
            p = `<b>증명.</b> ${p}`;
        } else if (i == texStruct.proofs.length-1) {
            p += '\n\n';
        }
        result.paragraphs.push(p);
    }
    for (let i=0; i<texStruct.remarks.length; i++) {
        let p = texStruct.remarks[i];
        if (i==0) {
            p = `<sup>*</sup> ${p}`;
        }
        result.footnotes.push(p);
    }
    return result;
}

let texFileName = './.references/수학고전_20240306.tex';
let htmFileNames = fs.readdirSync('.references/')
    .filter(function (name) {return name.endsWith('.htm');})
    .map(function (name) {return '.references\\' + name;})
    ;
let texts = {
    ELH: {
        paragraphs: [],
        footnotes: [],
    },
    KOC: {
        paragraphs: [],
        footnotes: [],
    },
}
let propositionsAll = [];
let numELHFootnotes = 0;
let numKOCFootnotes = 0;
for (let htmFileName of htmFileNames) {
    let html = fs.readFileSync(htmFileName, 'utf8');
    let document = nodeHtmlParser.parse(html);
    let columns = document.querySelectorAll('table td');
    let footnotes = document.querySelectorAll('div')
    footnotes = footnotes.filter(function (el) {return el.getAttribute('style') === 'mso-element:footnote';})
    
    let propositions = [];
    let proposition; 
    let footnoteMap = {};
    
    // ELH
    let cleaned = cleanColumn(columns[0], numELHFootnotes);
    // texts.ELH.paragraphs = texts.ELH.paragraphs.concat(cleaned.paragraphs);
    for (let i=0; i<cleaned.paragraphs.length; i++) {
        let paragraph = cleaned.paragraphs[i];
        if (paragraph.match(/ʹ\.$/u)) {
            propositions.push({
                ELH: {
                    paragraphs: [],
                    footnotes: [],
                },
                KOC: {
                    paragraphs: [],
                    footnotes: [],
                },
                KOM: {
                    paragraphs: [],
                    footnotes: [],
                }
            });
            proposition = propositions[propositions.length-1];
        } else {
            for (let fnNum of searchFootnotes(paragraph)) {
                footnoteMap[fnNum-numELHFootnotes] = ['ELH', propositions.length-1, fnNum];
            }
        }
        proposition.ELH.paragraphs.push(paragraph)
    }
    let numNewFootnotes = cleaned.footnoteNum;
    numELHFootnotes += cleaned.footnoteNum;

    // KOC
    let propositionNum;
    cleaned = cleanColumn(columns[1], numKOCFootnotes - numNewFootnotes);
    // texts.KOC.paragraphs = texts.KOC.paragraphs.concat(cleaned.paragraphs);
    for (let i=0; i<cleaned.paragraphs.length; i++) {
        let paragraph = cleaned.paragraphs[i];
        if (paragraph.match(/^(\d)\.$/)) {
            propositionNum = Number(paragraph.match(/^(\d)\.$/)[1]);
            proposition = propositions[propositionNum-1-propositionsAll.length];
        } else {
            for (let fnNum of searchFootnotes(paragraph)) {
                footnoteMap[fnNum-numKOCFootnotes+numNewFootnotes] = ['KOC', propositionNum-1-propositionsAll.length, fnNum];
            }
        }
        proposition.KOC.paragraphs.push(paragraph);
    }
    numKOCFootnotes += cleaned.footnoteNum - numNewFootnotes;

    // footnotes
    cleaned = footnotes.map(function(el) {return cleanColumn(el);})
    for (let i=0; i<footnotes.length; i++) {
        let [lang, ppNum, fnNum] = footnoteMap[i+1];
        propositions[ppNum][lang].footnotes.push(
            ...cleaned[i].paragraphs.map(function (p) {return p.replace(`[${i+1}]`, `[${fnNum}]`);})
        )
    }

    propositionsAll = propositionsAll.concat(propositions)
}

// KOM
let tex = fs.readFileSync(texFileName, 'utf8');
let footnoteIndex = 0;
tex = tex.match(/\\begin{document}(.+)\\end{document}/s)[1]
    .split('\\newpage')
    .map(structTexFile)
    .map(convertTexStruct)
    ;

for (let i=0; i<propositionsAll.length; i++) {
    tex[i].paragraphs.unshift(`${i+1}.`)
    Object.assign(propositionsAll[i].KOM, tex[i]);
}


fs.writeFileSync('static/on_spirals/propositions.json', JSON.stringify(propositionsAll), 'utf8')
