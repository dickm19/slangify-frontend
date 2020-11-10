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

        const editButton = document.createElement('button')
        editButton.textContent = "edit"
        
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


        
    })

    cardDiv.append(examplesDiv, definitionsDiv)
    // console.log(wordObj.definitions)

}

function likeDef(def){
    const likeP = document.querySelector(`[data-id='${def.id}']`)
    // console.log(likeP)
    def.likes ++
    likeP.textContent = `Likes: ${def.likes}`
    
    updateLikes(def)
    
}


function updateLikes(def){
    fetch(`${defsUrl}/${def.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify({likes: def.likes})
    })
    .then(resp => resp.json())
}



getWords()
