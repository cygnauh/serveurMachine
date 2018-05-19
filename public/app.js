//Selectors
//     const getSoundsForm = document.querySelector('.getSounds')
const addSoundForm = document.querySelector('.addSound')
const getSoundForm = document.querySelector('.getSound')
var soundsForm = document.querySelector('.soundsForm')
var storiesForm = document.querySelector('.storiesForm')
var stories_field = document.querySelector('.stories_field')
var sounds_field = document.querySelector('.sounds_field')

const addStory = document.querySelector('.addStory')
var sounds = []
var stories = []




getSoundForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let sound = document.querySelector('.getSoundInput').value

    return window.fetch('http://localhost:8080/sound?sound='+sound,{
        //  mode:"no-cors",
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "text/plain"
        }
    })
        .then(function(response) {

            return response.json();
        }, function(err){

        })
        .then(function(myJson) {
            if(myJson.length == 0) {
                console.log("not found")
            }else{
                console.log(myJson);
            }
            getSoundForm.reset()
        });


})


addSoundForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let name = document.querySelector('.name').value
    let url = document.querySelector('.url').value
    let type = ''
    if (document.getElementsByClassName('type')[0].checked) {
        type = document.getElementsByClassName('type')[0].value;
    }
    var data = {
        'name':name,
        'url':url,
        'type':type
    }

    //check if there is not already the same sound
    addSound(data)
    addSoundForm.reset()
    location.reload();
})

// GET EVERY SOUNDS

function displaySound(){

    return window.fetch('http://localhost:8080/sounds',{
        //  mode:"no-cors",
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "text/plain"
        },
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            sounds = Object.assign([], myJson)
            // console.log(myJson);
            // console.log(myJson.length)
            for(var i=0; i < myJson.length ; i++){
                var checkbox = document.createElement('input');
                checkbox.type='checkbox';
                checkbox.className='checkboxSound'
                checkbox.value=myJson[i].name.toString()
                var label = document.createElement('label');
                var labelContent = document.createTextNode(myJson[i].name.toUpperCase()+'  |  '+myJson[i].url)
                label.appendChild(labelContent)
                // console.log(stories)
                sounds_field.appendChild(checkbox)
                sounds_field.appendChild(label)
                sounds_field.appendChild(document.createElement('br'))
            }

            var deleteSound = document.createElement('input')
            deleteSound.type='submit'
            deleteSound.value='delete'
            sounds_field.appendChild(deleteSound)

            //
        });
}

displaySound()

// DELETE SOUNDS
soundsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var data=[]
    for(var i=0; i < sounds.length ; i++){
        var checkbox = document.getElementsByClassName('checkboxSound')[i];
        // console.log(checkbox)
        if(checkbox.checked === true){
            console.log(checkbox.value)
            data.push(checkbox.value)
            console.log(data)
        }
    }
    if(data){
        return window.fetch('http://localhost:8080/deletesounds',{
            //  mode:"no-cors",
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "text/plain"
            },
            body:JSON.stringify({'names':data})
        })
            .then(function(response) {
                // displaySound()
                location.reload();
                return response;
            })
    }
})

// getSoundsForm.addEventListener('submit', (e) => {
//     e.preventDefault()
//     return window.fetch('http://localhost:8080/sounds',{
//     //  mode:"no-cors",
//       method: "GET",
//       headers: {
//         'Accept': 'application/json',
//           "Content-Type": "text/plain"
//       },
//     })
//         .then(function(response) {
//         return response.json();
//     })
//         .then(function(myJson) {
//             console.log(myJson);
//         });
// })

//ADD STORY
addStory.addEventListener('submit', (e) => {
    e.preventDefault()

    let title = document.querySelector('.title').value
    let content = document.querySelector('.content').value

    var data = {
        'title':title,
        'content':content
    }
    return window.fetch('http://localhost:8080/createStory',{
        //  mode:"no-cors",
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "text/plain"
        },
        body:JSON.stringify(data)
    })
        .then(function(response) {
            return response.json();
        })
        .then(function() {
            location.reload();
        });
})



// GET EVERY SOUNDS

function displayStory(){

    return window.fetch('http://localhost:8080/stories',{
        //  mode:"no-cors",
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "text/plain"
        },
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            stories = Object.assign([], myJson)
            // console.log(myJson);
            // console.log(myJson.length)
            for(var i=0; i < myJson.length ; i++){
                var checkbox = document.createElement('input');
                checkbox.type='checkbox';
                checkbox.className='checkboxStory'
                checkbox.value=myJson[i].id.toString()
                var label = document.createElement('label');
                var labelContent = document.createTextNode(myJson[i].id +' | titre : ' + myJson[i].title+' | histoire : ' + myJson[i].content)
                label.appendChild(labelContent)
                // console.log(stories)
                stories_field.appendChild(checkbox)
                stories_field.appendChild(label)
                stories_field.appendChild(document.createElement('br'))
            }

            var deleteStory = document.createElement('input')
            deleteStory.type='submit'
            deleteStory.value='delete'
            stories_field.appendChild(deleteStory)

            //
        });
}

displayStory()

// DELETE STORIES
storiesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var data=[]
    for(var i=0; i < stories.length ; i++){
        var checkbox = document.getElementsByClassName('checkboxStory')[i];
        if(checkbox.checked === true){
            data.push(checkbox.value)
        }
    }
    if(data){
        return window.fetch('http://localhost:8080/deletestories',{
            //  mode:"no-cors",
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "text/plain"
            },
            body:JSON.stringify({'ids':data})
        })
            .then(function(response) {
                // displaySound()
                location.reload();
                return response;
            })
    }
})


//HELPER

function addSound (data) {
    return window.fetch('http://localhost:8080/addsound',{
        //  mode:"no-cors",
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "text/plain"
        },
        body:JSON.stringify(data)
    })
        .then(function(response) {
            console.log('Sound add')
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        });
}
