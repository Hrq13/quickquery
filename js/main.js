(() => {
    'use strict'

    const prgrphs = () => document.querySelectorAll('p');
    const container = document.querySelector('.container');
    const editArea = document.querySelector('.edit-area')
    const input = editArea.querySelector('#paragraph-input');
    const saveBtn = editArea.querySelector('.save-btn');
    const inputWord = document.querySelector('.inputWord');
    const queryBtn = document.querySelector('#query-btn');
    const caseInsensitive = document.querySelector('#case-insensitive');
    const newCard = document.querySelector('.new-card');

    let queryWord = '';
    let flags = () => caseInsensitive.checked ? 'i' : '';
    const regExp = () => new RegExp(queryWord, flags());
    const find = (paragraph) => paragraph.match(regExp());
    const replace = (source) => source.replace(regExp(), `<b><u>${find(source)}</u></b>`);
    const resetMarks = (ps) => ps.forEach(p => p.innerHTML = p.innerText);
    const clearEditing = () => prgrphs().forEach(p => p.classList.remove('editing'));

    let creatingCard = false;
    
    function findWord(paragraph) {
        const query = paragraph.innerHTML.match(regExp());
        if (query) {
            paragraph.innerHTML = replace(paragraph.innerHTML);
            return query
        }
        return null
    }
    
    function findParagraphs() {
        prgrphs().forEach(p => {
            if (queryWord && findWord(p)) return p.classList.add('outstand');
            p.classList.remove('outstand')
        })
    }

    inputWord.addEventListener('input', e => {
        queryWord = inputWord.value
        if (!inputWord.value) {
            prgrphs().forEach(p => p.classList.remove('outstand'))
        }
        resetMarks(prgrphs())
        findParagraphs()
    })

    let paragraph;

    caseInsensitive.addEventListener('click', () => !resetMarks(prgrphs()) && findParagraphs())

    container.addEventListener('click', e => {
        if (e.target.nodeName.toLowerCase() === 'p') {
            clearEditing()
            creatingCard = false;
            e.target.classList.add('editing')

            paragraph = e.target;
            input.value = paragraph.innerText;
            editArea.style.display = 'block';
            newCard.style.display = 'block';
            editArea.scrollIntoView({ behavior: 'smooth' })
            return
        }
    })

    saveBtn.addEventListener('click', e => {
        
        if (creatingCard && input.value) {
            const newPar = document.createElement('p');
            const newParText = document.createTextNode(input.value);
            
            newPar.appendChild(newParText)
            newCard.insertAdjacentElement('beforebegin', newPar)
            
            input.value = '';
            
            editArea.style.display = 'none';
            newCard.style.display = 'block';
            
            creatingCard = false;
            
            findParagraphs()
            return;
        }
        
        if (!input.value) {
            if (paragraph) {
                paragraph.classList.add('removing')
                paragraph.addEventListener('animationiteration', e => {
                    paragraph.remove()
                    paragraph = null;
                })
            } else {
                paragraph = null;
            }
            editArea.style.display = 'none';
            newCard.style.display = 'block';
            return
        }

        paragraph.innerHTML = input.value.replace(regExp(), `<b>${queryWord}</b>`);
        paragraph.classList.remove('editing')
        paragraph = null;
        input.value = '';
        editArea.style.display = 'none';
        findParagraphs()
    })

    newCard.addEventListener('click', e => {
        clearEditing()
        paragraph = null;
        input.value = '';
        editArea.style.display = 'block';
        newCard.style.display = 'none';
        creatingCard = true;
        editArea.scrollIntoView({ behavior: 'smooth' })
    })
})();
