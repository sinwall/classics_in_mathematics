class DiagramNavigator {
    constructor (id, parentNode, geometer) {
        this.id = id;
        this.parentNode = parentNode;
        this.geometer = geometer;

        this.outerDiv = document.createElement('div');
        this.outerDiv.innerHTML = 'Select construction step';
        let that = this;
        this.buttonPrev = document.createElement('button');
        this.buttonPrev.innerHTML = '◁';
        this.buttonPrev.onclick = function () {
            if (Number(that.selector.value) === 0) {return;}
            that.selector.value = Number(that.selector.value) - 1;
            that.selector.onchange();
        };
        this.selector = document.createElement('select');
        this.selector.onchange = function (event) {
            let val = this.value;
            that.setDisabled(true);
            for (let i=geometer.step; i<this.value; i++) {
                geometer.stepForward();
            }
            for (let i=geometer.step; i>this.value; i--) {
                geometer.stepBack();
            }
            that.setDisabled(false);
        };
        this.buttonNext = document.createElement('button');
        this.buttonNext.innerHTML = '▷';
        this.buttonNext.onclick = function () {
            if (Number(that.selector.value) === that.selector.options.length-1) {return;}
            that.selector.value = Number(that.selector.value) + 1;
            that.selector.onchange();
        };

        this.checkOriginal = document.createElement('input');
        this.checkOriginal.setAttribute('type', 'checkbox');
        this.checkOriginal.onchange = function () {
            that.setDisabled(true);
            geometer.toggleOriginal();
            if (that.checkOriginal.checked) {
                this.disabled = false;
            } else {
                that.setDisabled(false);
            }
        }
        this.checkOriginal.style.visibility = 'hidden';
        this.setStepsItems();

        this.outerDiv.appendChild(this.buttonPrev);
        this.outerDiv.appendChild(this.selector);
        this.outerDiv.appendChild(this.buttonNext);
        this.outerDiv.appendChild(this.checkOriginal);
        // this.outerDiv.appendChild(document.createTextNode('original'));
        this.parentNode.appendChild(this.outerDiv);
    }

    setDisabled(val) {
        this.buttonPrev.disabled = val;
        this.selector.disabled = val;
        this.buttonNext.disabled = val;
        this.checkOriginal.disabled = val;
    }

    setStepsItems() {
        this.selector.innerHTML = '';
        let geometer = this.geometer;
        for (let i=geometer.stepMin; i<=geometer.stepMax; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            this.selector.appendChild(option);
        };
        this.selector.value = 0;
        if (this.checkOriginal.checked) {
            geometer.toggleOriginal();
        }
    }
}

class SectionNavigator {
    constructor (id, parentNode, sectionOnChange, sections=null) {
        this.id = id;
        this.parentNode = parentNode;
        this.sections = sections;

        this.outerSpan = document.createElement('span');

        let that = this;

        this.buttonPrev = document.createElement('button');
        this.buttonPrev.innerHTML = '◁';
        this.buttonPrev.onclick = function () {
            if (Number(that.selector.value) === 0) {return;}
            that.selector.value = Number(that.selector.value) - 1;
            that.selector.onchange();
        };
        this.selector = document.createElement('select');
        if (sections !== null) {this.setSectionsItems(sections);}
        this.selector.onchange = function (event) {
            let val = this.value;
            that.setDisabled(true);
            sectionOnChange(val, function() {that.setDisabled(false)});
        };
        this.buttonNext = document.createElement('button');
        this.buttonNext.innerHTML = '▷';
        this.buttonNext.onclick = function () {
            if (Number(that.selector.value) === that.selector.options.length-1) {return;}
            that.selector.value = Number(that.selector.value) + 1;
            that.selector.onchange();
        };

        this.outerSpan.appendChild(this.buttonPrev);
        this.outerSpan.appendChild(this.selector);
        this.outerSpan.appendChild(this.buttonNext);
        this.parentNode.appendChild(this.outerSpan);
    }

    setDisabled(val) {
        this.buttonPrev.disabled = val;
        this.selector.disabled = val;
        this.buttonNext.disabled = val;
    }

    setSection(idx) {
        this.selector.value = idx;
        this.selector.onchange();
    }

    setSectionsItems(items) {
        this.selector.innerHTML = '';
        for (let i=0; i<items.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = items[i];
            option.value = i;
            this.selector.appendChild(option);
        }
    }
}

class TextColumn {
    static innerBodies = [];
    static semanticGroups = {};
    constructor (id, name, parentNode, languages=null) {
        this.id = id;
        this.name = name;
        this.parentNode = parentNode;
        
        let columnWidth = '400px';

        this.outerDiv = document.createElement('div');
        this.outerDiv.setAttribute('id', `${this.id}`)
        this.outerDiv.classList.add('col', 'boxed');
        this.outerDiv.style.setProperty('height', '100%')
        this.outerDiv.style.setProperty('width', columnWidth);

        this.innerTitle = document.createElement('div');
        this.innerTitle.setAttribute('id', `${this.id}-title`);
        this.innerTitle.classList.add('row', 'boxed');
        this.innerTitle.innerText = name;

        this.langSelect = document.createElement('select');
        this.langSelect.setAttribute('id', `${this.id}-languageSelector`);
        this.innerTitle.appendChild(this.langSelect);

        this.innerBody = document.createElement('div');
        this.innerBody.setAttribute('id', `${this.id}-body`);
        this.innerBody.classList.add('row', 'boxed', 'text-col-body');
        this.innerBody.style.setProperty('white-space', 'break-spaces');
        TextColumn.innerBodies.push(this.innerBody);
        let that = this;
        this.innerBody.onscroll = function () {
            for (let el of TextColumn.innerBodies) {
                el.scrollTop = that.innerBody.scrollTop;
            }
        };

        this.dgmWrapper = document.createElement('div');
        this.dgmWrapper.style.setProperty('display', 'none');
        this.dgmWrapper.style.setProperty('position', 'relative');
        this.dgmWrapper.style.setProperty('height', columnWidth);
        this.dgmWrapper.style.setProperty('width', columnWidth);

        this.innerFoot = document.createElement('div');
        this.innerFoot.setAttribute('id', `${this.id}-foot`);
        this.innerFoot.classList.add('row', 'boxed', 'text-col-foot');
        this.innerFoot.style.setProperty('white-space', 'break-spaces');

        this.outerDiv.appendChild(this.innerTitle);
        this.outerDiv.appendChild(this.innerBody);
        this.outerDiv.appendChild(this.innerFoot);
        this.outerDiv.appendChild(this.dgmWrapper);

        this.parentNode.appendChild(this.outerDiv);
    }

    activateSementicGroups() {
        let semanticGroups = TextColumn.semanticGroups;
        let semanticSpanElements = this.innerBody.querySelectorAll('span');
        for (let elt of semanticSpanElements) {
            if (!('type' in elt.attributes) || !(elt.getAttribute('type').startsWith('sem_'))) {continue;}
            let type = elt.getAttribute('type');
            if (!(type in semanticGroups)) {semanticGroups[type] = [];}
            semanticGroups[type].push( elt );
        }
        for (let type in semanticGroups) {
            let group = semanticGroups[type];
            let mouseover = function () {
                for (let elt of group) {
                    elt.classList.add('semantic-group-hover');
                }
            };
            let mouseout = function () {
                for (let elt of group) {
                    elt.classList.remove('semantic-group-hover');
                }
            };
            for (let elt of group) {
                elt.addEventListener('mouseover', mouseover);
                elt.addEventListener('mouseout', mouseout);
            }
        }
    }

    applySectionContents(responses) {
        let texts = {};
        let footnotes = {};
        let that = this;
        let responseJSON = JSON.parse(responses);
        // let languages = this.languages;
        for (let language in responseJSON) {
        // for (let i=0; i<languages.length; i++) {
        //     let language = languages[i];
            texts[language] = [];
            footnotes[language] = [];

            // let responseJSON = JSON.parse(responses[i]);
            let node = document.createElement('div');
            node.innerHTML = responseJSON[language].text;
            node.querySelectorAll('p')
                .forEach(function (pElt) {texts[language].push(that.refactorIds(pElt.innerHTML));});
            node.innerHTML = responseJSON[language].footnote;
            node.querySelectorAll('p')
                .forEach(function (pElt) {footnotes[language].push(that.refactorIds(pElt.innerHTML));});
            node.remove();
        }
        this.setBodyContent(texts);
        this.setFootContent(footnotes);
        this.langSelect.onchange();
        this.activateSementicGroups();
    }

    arrangeMultilayerHeights() {
        for (let outer of this.innerBody.children) {
            for (let inner of outer.children) {
                if (Number(outer.style.height.replace('px','')) < inner.offsetHeight) {
                    outer.style.height = `${inner.offsetHeight}px`;
                }
            }
        }
    }

    clearBodyFoot() {
        TextColumn.semanticGroups = {};
        this.innerBody.innerHTML = 'Loading...';
        this.innerFoot.innerHTML = 'Loading...';
        // this.dgmWrapper.innerHTML = 'Loading...';
    }
    
    makeWhite() {
        for (let el of this.innerBody.querySelectorAll('.language-selected')) {
            el.classList.remove('language-selected');
            el.classList.add('language-unselected');
        }
    }

    refactorIds(htmlString) {
        let suffix = this.id;
        htmlString = htmlString.replaceAll(
            /id="footnote(ptr)?-[A-Z]{3}-\d/g, 
            function (match) {return `${match}(${suffix})`;}
        )
        htmlString = htmlString.replaceAll(
            /href="#footnote(ptr)?-[A-Z]{3}-\d/g, 
            function (match) {return `${match}(${suffix})`;}
        )
        return htmlString
    }

    setLanguage(val) {
        for (let option of this.langSelect.options) {
            if (option.value == val) {
                option.selected = true;
                break;
            }
        }
    }

    setLanguagesItems(languages, items) {
        this.languages = languages;
        for (let i=0; i<items.length; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.setAttribute('name', languages[i]);
            option.innerHTML = items[i];
            // option.setAttribute('id', `${this.langSelect.id}-option-${i}`);
            this.langSelect.appendChild(option);
        }
        let option = document.createElement('option');
        option.value = items.length;
        option.setAttribute('name', 'DGM');
        option.innerHTML = '다이어그램';
        this.langSelect.appendChild(option);

        let that = this;
        this.langSelect.onchange = function () {
            let i = that.langSelect.value;
            that.outerDiv
                .querySelectorAll('.language-layer')
                .forEach(el => {
                    if (el.classList.contains(languages[i])) {return;}
                    el.classList.remove('language-selected')
                    el.classList.add('language-unselected', 'unselectable')
                });
            if (i < that.langSelect.length-1) {
                that.outerDiv
                    .querySelectorAll(`.${languages[i]}`)
                    .forEach(el => {
                        el.classList.add('language-selected');
                        el.classList.remove('language-unselected', 'unselectable');
                    });
                that.innerBody.style.removeProperty('display');
                that.innerFoot.style.removeProperty('display');
                // that.innerBody.style.setProperty('display', 'block');
                // that.innerFoot.style.setProperty('display', 'block');
                that.dgmWrapper.style.setProperty('display', 'none');
                that.arrangeMultilayerHeights();
            } else {
                that.innerBody.style.setProperty('display', 'none');
                that.innerFoot.style.setProperty('display', 'none');
                that.dgmWrapper.style.setProperty('display', 'block');
            }
            // #TODO: make this self-contained
        }
    }

    setBodyContent(dividedText) {
        this.innerBody.innerHTML = '';
        let languages = this.languages
        let numParagraph = dividedText.ELH.length;
        for (let i=0; i<numParagraph; i++) {
            let outer = document.createElement('div');
            outer.classList.add('multilayer', 'boxed');
            this.innerBody.appendChild(outer);
            for (let j=0; j<languages.length; j++) {
                let inner = document.createElement('div');
                inner.classList.add(languages[j], 'language-layer', 'language-unselected');

                inner.innerHTML = dividedText[languages[j]][i];
                outer.appendChild(inner);
            }
        }
        this.arrangeMultilayerHeights();
    }

    setFootContent(dividedText) {
        this.innerFoot.innerHTML = '';
        let languages = this.languages;
        let outer = document.createElement('div');
        outer.classList.add('boxed');
        this.innerFoot.append(outer);
        for (let j=0; j<languages.length; j++) {
            let inner = document.createElement('div');
            inner.classList.add(languages[j], 'language-layer', 'language-unselected');
            dividedText[languages[j]].forEach(function(s) {inner.innerHTML += `<div>${s}</div>`;});
            outer.appendChild(inner);
        }
    }
}

class Spinner {
    constructor (id, parentNode, message) {
        this.id = id;
        this.parentNode = parentNode
        this.message = message;

        this.outerSpan = document.createElement('span');
        this.outerSpan.setAttribute('id', id);
        this.outerSpan.style.setProperty('visibility', 'visible');
        this.outerSpan.innerHTML = message;
        parentNode.appendChild(this.outerSpan)
    }

    setVisibility(val) {
        let visibility;
        if (val) {visibility = 'visible';}
        else {visibility = 'hidden';}
        this.outerSpan.style.setProperty('visibility', visibility);
    }
}
export {DiagramNavigator, SectionNavigator, TextColumn, Spinner};