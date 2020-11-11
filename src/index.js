//------------- Global Variables ------------------------------//
const wordsUrl = "http://localhost:3000/api/v1/words"
const defsUrl = "http://localhost:3000/api/v1/definitions"
const exampleUrl = "http://localhost:3000/api/v1/examples"

const wordsList = document.querySelector('.words-list')

    
// function to fetch words
const getWords = () => {
    fetch(wordsUrl)
    .then(r => r.json())
    .then(words => renderNavWords(words))
}

//iterate through the words 
const renderNavWords = (words) => {
    for(const wordObj of words){
        renderNav(wordObj)
    }
}

//Rendering words on the page 
const renderNav = (wordObj) => {
    const wordLi = document.createElement('li')
    wordLi.textContent = wordObj.term

    wordsList.append(wordLi)

    wordLi.addEventListener('click', () => {
        renderWordObj(wordObj)
    })
}

const renderWordObj = (wordObj) => {
    const cardDiv = document.querySelector('.word-card')
    const definitionsDiv = document.querySelector('.definitions')
    const examplesDiv = document.querySelector('.examples')
    definitionsDiv.innerHTML = ""
    examplesDiv.innerHTML = ""

    const exampleH3 = document.createElement('h3')
        exampleH3.textContent = "Examples"
    const definitionH3 = document.createElement('h3')
        definitionH3.textContent = "Definitions"

    examplesDiv.append(exampleH3)
    definitionsDiv.append(definitionH3)
    const wordTitle = cardDiv.querySelector('h2')
    wordTitle.textContent = wordObj.term

    wordObj.definitions.forEach(definition => {
        const defCard = document.createElement('div')
        defCard.classList.add('definition')
    
        const likeCount = definition.likes

        const likeP = document.createElement("p")
        likeP.textContent = `Likes: ${likeCount}`
        likeP.dataset.id = definition.id

        const defContentP = document.createElement('p')
        defContentP.textContent = definition.content

        const likeButton = document.createElement('button')
        likeButton.textContent = "❤️" 
        
       
        const deleteButton = document.createElement('button')
        deleteButton.textContent = "delete"

        deleteButton.addEventListener("click", () => {
            defCard.remove()
            deleteDef(definition)
        })

        const editButton = document.createElement('button')
        editButton.textContent = "edit"

        editButton.addEventListener("click", () => {
            renderEditForm(definition, defCard)
        })
        
        definitionsDiv.append(defCard)
        defCard.append(defContentP, likeP, likeButton, deleteButton, editButton)

        likeButton.addEventListener("click", () => {
            likeDef(definition)
        })
        
    })
 
    wordObj.examples.forEach(example => {
        const exampleCard = document.createElement('div')
        exampleCard.classList.add('definition')
        
        const exampleContentP = document.createElement('p')
       
        exampleContentP.textContent = example.content
        
        const deleteButton = document.createElement('button')
        deleteButton.textContent = "delete"
        
        const editButton = document.createElement('button')
        editButton.textContent = "edit"
        
        examplesDiv.append(exampleCard)
        exampleCard.append(exampleContentP, deleteButton, editButton)

        deleteButton.addEventListener("click", () => {
            exampleCard.remove()
            deleteEx(example)
        })   
    })

    cardDiv.append(examplesDiv, definitionsDiv)
    // console.log(wordObj.definitions)
}

//------- Issues with Likes -----------//
    // 1. We needed to convert the number of likes to an integer
    // 2. Needed to have a variable (currentLikes) that was the initial value 
    // 3. Needed to have a variable (newLikes) that would increase currentLikes by 1
    // 4. After making a PATCH, we need to make sure to create the second .them since a PATCH returns a response


function likeDef(def){
    const likeP = document.querySelector(`[data-id='${def.id}']`)
    // console.log(likeP)
    // likeP.textContent = `Likes ${newLikes}`
    const likeText = likeP.textContent
    const split = likeText.split(" ")[1]
    const currentLikes = parseInt(split)
    const newLikes = currentLikes + 1
    
    // const newLikes = def.likes + 1
    // console.log(newLikes)
 
    updateLikes(def, newLikes, likeP)
    
}


function updateLikes(def, newLikes, likeP){
 
    fetch(`${defsUrl}/${def.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify({likes: newLikes})
    })
    .then(resp => resp.json())
    .then(data => {
        likeP.textContent = `Likes ${data.likes}`
        // console.log(data)
    })
}

function deleteDef(def){
    fetch(`${defsUrl}/${def.id}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
}

function deleteEx(example){
    fetch(`${exampleUrl}/${example.id}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
}

function renderEditForm(def, card){
    const editForm = document.createElement("form")
    editForm.innerHTML = `
        <textarea name = "content"></textarea>
        <input type="submit"></input>
    `
    card.append(editForm)
    editForm.addEventListener("submit", (event) =>{
        event.preventDefault()
        submitDefEdit(def, event, card)
    })
}

function submitDefEdit(def, event, card){
    const p = card.querySelector('p')
 
    const content = event.target.content.value
    p.textContent = content
    const data = {
        content: content
    }
    fetch(`${defsUrl}/${def.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(resp => resp.json)

}
getWords()
