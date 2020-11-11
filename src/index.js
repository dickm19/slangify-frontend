//------------- Global Variables ------------------------------//
const wordsUrl = "http://localhost:3000/api/v1/words"
const defsUrl = "http://localhost:3000/api/v1/definitions"
const exampleUrl = "http://localhost:3000/api/v1/examples"

const wordsList = document.querySelector('.words-list')
const createNewDefForm = document.querySelector('.def-form')

const definitionsDiv = document.querySelector('.definitions')
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
    
    const examplesDiv = document.querySelector('.examples')
    definitionsDiv.innerHTML = ""
    examplesDiv.innerHTML = ""

    // I did this to give the form of creating a def an id of the word
    createNewDefForm.dataset.id = wordObj.id 

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
        exampleCard.classList.add('example')
        
        const exampleContentP = document.createElement('p')
       
        exampleContentP.textContent = example.content
        
        const deleteButton = document.createElement('button')
        deleteButton.textContent = "delete"
        
        const editButton = document.createElement('button')
        editButton.textContent = "edit"

        editButton.addEventListener("click", () => {
            renderExEditForm(example, exampleCard)
        })
        
        examplesDiv.append(exampleCard)
        exampleCard.append(exampleContentP, deleteButton, editButton)

        deleteButton.addEventListener("click", () => {
            exampleCard.remove()
            deleteEx(example)
        })   
    })

    cardDiv.append(examplesDiv, definitionsDiv)
}

//------- Issues with Likes -----------//
    // 1. We needed to convert the number of likes to an integer
    // 2. Needed to have a variable (currentLikes) that was the initial value 
    // 3. Needed to have a variable (newLikes) that would increase currentLikes by 1
    // 4. After making a PATCH, we need to make sure to create the second .then since a PATCH returns a response


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
    // console.log(p)
    const form = event.target
    const content = form.content.value
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
    .then(resp => resp.json())
    form.reset()
}

// For this step I did the same thing we did for the definitions! 
// When edit is clicked more than once, the form also appears --> Will fix this 
// ^^ Maybe has to do with inner.HTML

const renderExEditForm = (example, exampleCard) => {
    const exampleEditForm = document.createElement("form")
    exampleEditForm.innerHTML = `
        <textarea name = "content"></textarea>
        <input type="submit"></input>
    `
    exampleCard.append(exampleEditForm)
    exampleEditForm.addEventListener("submit", (event) =>{
        event.preventDefault()
        submitExampleEdit(example, event, exampleCard)
    })
}

function submitExampleEdit(example, event, exampleCard){
    const exampleP = exampleCard.querySelector('p')
    const form = event.target
    const content = form.content.value
    exampleP.textContent = content
   
    const exampleData = {
        content: content
    }

    fetch(`${exampleUrl}/${example.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(exampleData)
    })
    .then(resp => resp.json())
    
    form.reset()
}

// ------------ Creating a definition -----------//
    //For the second .then after the Post request, I had to copy and paste what we did to render the definition
    // It looks repetitive, but we can always refactor!!!
    // We have full CRUD working and MVP done 🙌🏾

const submitHandler = () => {
    const createNewDefForm = document.querySelector('.def-form')
    // console.log(createNewDefForm)
    createNewDefForm.addEventListener('submit', e => {
        e.preventDefault()
        const createForm = e.target
        const createFormId = createNewDefForm.dataset.id
        const newContent = createForm.content.value
        
        const postData = {
            content: newContent,
            word_id: createFormId,
            likes: 0
        }

        fetch(defsUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(resp => resp.json())
        .then(createdDef => {
            const defCard = document.createElement('div')
                defCard.classList.add('definition')
    
            const likeCount = createdDef.likes

            const likeP = document.createElement("p")
            likeP.textContent = `Likes: ${likeCount}`
            likeP.dataset.id = createdDef.id

            const defContentP = document.createElement('p')
            defContentP.textContent = createdDef.content

            const likeButton = document.createElement('button')
            likeButton.textContent = "❤️" 
        
            const deleteButton = document.createElement('button')
            deleteButton.textContent = "delete"

            deleteButton.addEventListener("click", () => {
                defCard.remove()
                deleteDef(createdDef)
            })

            const editButton = document.createElement('button')
            editButton.textContent = "edit"

            editButton.addEventListener("click", () => {
                renderEditForm(createdDef, defCard)
            })
        
            definitionsDiv.append(defCard)
            defCard.append(defContentP, likeP, likeButton, deleteButton, editButton)

            likeButton.addEventListener("click", () => {
                likeDef(createdDef)
            }) 
        })
        createForm.reset()
    })
}

submitHandler()
getWords()
