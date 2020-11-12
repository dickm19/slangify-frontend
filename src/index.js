//------------- Global Variables ------------------------------//
document.addEventListener("DOMContentLoaded", () => {
    const wordsUrl = "http://localhost:3000/api/v1/words"
    const defsUrl = "http://localhost:3000/api/v1/definitions"
    const exampleUrl = "http://localhost:3000/api/v1/examples"
    const header = document.querySelector("header")
    
    header.addEventListener("click", () => {
        location.reload()
    })
    const wordForm = document.querySelector(".word-form")
    wordForm.addEventListener("submit", createNewWord)
    
    // testing to see if the branch is updated
    
    const wordsList = document.querySelector('.words-list')
    //const createNewDefForm = document.querySelector('.def-form')
    
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
        const deleteWordButton = document.createElement("button")
        deleteWordButton.classList.add("delete-button")
        deleteWordButton.textContent = "X"
        wordLi.append(deleteWordButton)
     
        wordsList.append(wordLi)
    
        wordLi.addEventListener('click', (e) => {
            if (e.target.matches(".delete-button")){     
                deleteWord(wordObj)
                wordLi.remove()
            }else{
                renderWordObj(wordObj)
            }
            
        })
    }
    
    const renderWordObj = (wordObj) => {
        const cardDiv = document.querySelector('.word-card')
        wordForm.remove()
        const examplesDiv = document.querySelector('.examples')
        definitionsDiv.innerHTML = ""
        examplesDiv.innerHTML = ""
    
      
        if (document.body.contains(document.querySelector(".def-form"))){
            console.log("it exists")
         }else {
             const defForm = document.createElement("form")
     
             defForm.dataset.id = wordObj.id
             defForm.classList.add("def-form")
             defForm.innerHTML = `
               <label for="content">Add Definition</label><br>
               <input type="textfield" id="content" name="content" placeholder="definition" value><br>
               <input type="submit" value="Submit">
         
             `
             cardDiv.append(defForm)
    
             defForm.addEventListener("submit", (event) => {
                 e.preventDefault()
                defFormSubmit(event, wordObj)
             })
         }
         if (document.body.contains(document.querySelector(".ex-form"))){
            console.log("it exists")
         }else {
             const exForm = document.createElement("form")
     
             exForm.dataset.id = wordObj.id
             exForm.classList.add("ex-form")
             exForm.innerHTML = `
               <label for="content">Add Example</label><br>
               <input type="textfield" id="content" name="content" placeholder="example" value><br>
               <input type="submit" value="Submit">
         
             `
             cardDiv.append(exForm)
    
             exForm.addEventListener("submit", (event) => {
                 event.preventDefault()
                exFormSubmit(event, wordObj)
             })
         }
    
    
    
        // I did this to give the form of creating a def an id of the word
        //createNewDefForm.dataset.id = wordObj.id 
    
        const exampleH3 = document.createElement('h3')
            exampleH3.textContent = "Examples"
        const definitionH3 = document.createElement('h3')
            definitionH3.textContent = "Definitions"
    
        examplesDiv.append(exampleH3)
        definitionsDiv.append(definitionH3)
        const wordTitle = cardDiv.querySelector('h2')
        wordTitle.textContent = wordObj.term
    
        //console.log(typeof(document.querySelector("def-form")))
        
        
    
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
        if (card.contains(card.querySelector(".def-edit-form"))){
            console.log("it exists")
        }else{
            const editForm = document.createElement("form")
            editForm.classList.add("def-edit-form")
            editForm.innerHTML = `
                <textarea name = "content" placeholder = "definition"></textarea>
                <input type="submit"></input>
            `
            card.append(editForm)
            editForm.addEventListener("submit", (event) =>{
            event.preventDefault()
            submitDefEdit(def, event, card)
            editForm.remove()
        })
        }
        
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
    
        if (exampleCard.contains(exampleCard.querySelector(".edit-form"))){
            console.log("it exists")
        } else{
            const exampleEditForm = document.createElement("form")
            exampleEditForm.classList.add("edit-form")
            exampleEditForm.innerHTML = `
                <textarea name = "content" placeholder="definition"></textarea>
                <input type="submit"></input>
            `
            exampleCard.append(exampleEditForm)
            exampleEditForm.addEventListener("submit", (event) =>{
                event.preventDefault()
                submitExampleEdit(example, event, exampleCard)
                exampleEditForm.remove()
            })
        }
        
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
    
    function defFormSubmit(event, word) {
        // const createNewDefForm = document.querySelector('.def-form')
        // console.log(createNewDefForm)
        // createNewDefForm.addEventListener('submit', e => {
            // e.preventDefault()
            // const createForm = event.target
            const formId = word.id
            const newContent = event.target.content.value
            
            const postData = {
                content: newContent,
                word_id: formId,
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
             event.target.reset()
    }
    
    function createNewWord(event){
        event.preventDefault()
        const word = event.target.word.value
        fetch(wordsUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({term: word})
        })
        .then(resp => resp.json())
        .then(function(word){
            createDef(event, word)
            renderNav(word)
            
        })
        
    }
    
    function createDef(event, word){
      
        fetch(defsUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                content: event.target.content.value,
                likes: 0,
                word_id: word.id
            })
        })
        .then(resp => resp.json())
        event.target.reset()
        location.reload()
    }
    
    function deleteWord(word){
        fetch(`${wordsUrl}/${word.id}`, {
            method: "DELETE"
        })
        .then(resp => resp.json())
    
    }
    
    function exFormSubmit(event, word){
    
        const formId = word.id
        const newContent = event.target.content.value
        //console.log(newContent)
                
        const postData = {
            content: newContent,
            word_id: formId
         }
        
        fetch(exampleUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(resp => resp.json())
        .then(createdEx => {
            const examplesDiv = document.querySelector('.examples')
    
            const exampleCard = document.createElement('div')
            exampleCard.classList.add('example')
            
            const exampleContentP = document.createElement('p')
           
            exampleContentP.textContent = createdEx.content
            
            const deleteButton = document.createElement('button')
            deleteButton.textContent = "delete"
            
            const editButton = document.createElement('button')
            editButton.textContent = "edit"
    
            editButton.addEventListener("click", () => {
                renderExEditForm(createdEx, exampleCard)
            })
            
            examplesDiv.append(exampleCard)
            exampleCard.append(exampleContentP, deleteButton, editButton)
    
            deleteButton.addEventListener("click", () => {
                exampleCard.remove()
                deleteEx(createdEx)
            })  
        })
        event.target.reset()
    }
    
    //submitHandler()
    getWords()
    
})
//testing!!