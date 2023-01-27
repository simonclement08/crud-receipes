
function setReceipeJson(){
    let names = document.querySelectorAll("[name='ingredientsName[]']");
    let quatities = document.querySelectorAll("[name='ingredientsQuantity[]']");
    let units = document.querySelectorAll("[name='ingredientsUnity[]']");
    let ingredients = [];
    for (let i = 0; i < names.length; i++) {
        let ingredient = { name: names[i].value, quantity: quatities[i].value, unit: units[i].value};
        ingredients.push(ingredient)
    }

    return JSON.stringify({
        name: document.getElementById('inputName').value,
        nb_part: document.getElementById('inputNbPart').value,
        description: document.getElementById('inputDescription').value,
        link : document.getElementById('inputLink').value,
        ingredients : ingredients,
    })
}

function initList(){
    fetch('http://localhost:3000/receipes')
    .then(response => response.json())
    .then(receipes => {
        let div= document.getElementById('receipes')
        receipes.forEach(receipe => {
            div.innerHTML +=`<div id="receipe` + receipe.id + `" class="col-10 col-sm-4 col-md-4 col-lg-3 col-xl-2 receipe m-2">
                <img src="` + receipe.link + `" class="img_receipe" alt="Image recette">
                <div class="content_receipe">
                    <h3>` + receipe.name + `</h3>
                    <p>` + receipe.nb_part + ` <img class="nb_part" src="https://cdn-icons-png.flaticon.com/512/5874/5874704.png" alt="Logo nombre personne"></p>
                    <p>` + receipe.description + `</p>
                </div>
                <div class="action_receipe">
                    <a href=edit.html?id=` + receipe.id + `>
                        <img src="https://cdn-icons-png.flaticon.com/512/781/781054.png" alt="Modifier" class="img_action">
                    </a>
                    <a type="button" onclick="remove(` + receipe.id + `)">
                        <img src="https://cdn.pixabay.com/photo/2014/04/02/10/44/cross-mark-304374_960_720.png" alt="Modifier" class="img_action">
                    </a>
                </div>
            </div>`
        });
    })
}

function initEdit(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    fetch('http://localhost:3000/receipes/' + id)
    .then(response => response.json())
    .then(receipe => {
        document.getElementById('submit').onclick = function(){update(receipe.id)};
        document.getElementById('inputName').value = receipe.name
        document.getElementById('inputNbPart').value = receipe.nb_part
        document.getElementById('inputDescription').value = receipe.description
        document.getElementById('inputLink').value = receipe.link
        for (let i = 0; i < receipe.ingredients.length; i++) {
            addIngredient(receipe.ingredients[i].name, receipe.ingredients[i].quantity, receipe.ingredients[i].unit)
        }
        let btn = document.getElementsByClassName("btnSupp");
        btn[0].parentElement.innerHTML =  `<div class="col-6" id="lstIngredientsBtn">
            <button class="btn btn-secondary" onclick="addIngredient()">+</button>
        </div>` ;
    })
}

function add(){
    fetch('http://localhost:3000/receipes', {
        method: 'POST',
        body: setReceipeJson(),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function update(id) {
    fetch('http://localhost:3000/receipes/' + id, {
    method: 'PUT',
    body: setReceipeJson(),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function remove(id){
    fetch('http://localhost:3000/receipes/' + id, {
        method: 'DELETE',
    }).then(function(){
        const element = document.getElementById('receipe' + id);
        element.remove();
    });
}

let btns = document.querySelectorAll(".btnSupp");
btns.forEach(btn => {
    btn.addEventListener('click', (e) => suppIngredient(e.target));
});

function addIngredient(name = "", quantity = 0, unit = "") {
    let div = document.getElementById('lstIngredients');
    div.innerHTML += `<div class="row">
        <div class="col-3">
            <div class="form-group">
                <label for="inputLink">Nom</label>
                <input required type="text" class="form-control" name="ingredientsName[]" value="` + name + `">
            </div>
        </div>
        <div class="col-2">
            <div class="form-group">
                <label for="inputLink">Quantité</label>
                <input required type="number" class="form-control" name="ingredientsQuantity[]" value="` + quantity + `">
            </div>
        </div>
        <div class="col-1">
            <div class="form-group">
                <label for="inputLink">Unité</label>
                <input required type="text" class="form-control" name="ingredientsUnity[]" value="` + unit + `">
            </div>
        </div>
        <div class="col-6" style="position: relative; top: 20px;">
            <button type="button" class="btn btn-danger btnSupp">-</button>
        </div>
    </div>`

    btns = document.querySelectorAll(".btnSupp");
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => suppIngredient(e.target));
    });
}

function suppIngredient(element) {
    element.parentElement.parentElement.remove()
}