
function initList(){
    fetch('http://localhost:3000/receipes')
    .then(response => response.json())
    .then(receipes => {
        let table= document.getElementById('receipes')
        receipes.forEach(receipe => {
            table.innerHTML +=`<tr id="receipe` + receipe.id + `">
                    <th scope="row">` + receipe.name + `</th>
                    <td>` + receipe.nb_part + `</td>
                    <td>` + receipe.description + `</td>
                    <td><a href="` + receipe.link + `">Voir lien</a></td>
                    <td><a class="btn btn-warning" href=edit.html?id=` + receipe.id + `>Modifier</a></td>
                    <td><button type="button" class="btn btn-danger" onclick="remove(` + receipe.id + `)">Supprimer</button></td>
                </tr>
            `
        });
    })
}

function initEdit(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    fetch('http://localhost:3000/receipes/' + id)
    .then(response => response.json())
    .then(receipe => {
        console.log(receipe.ingredients)
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
    let names = document.querySelectorAll("[name='ingredientsName[]']");
    let quatities = document.querySelectorAll("[name='ingredientsQuantity[]']");
    let units = document.querySelectorAll("[name='ingredientsUnity[]']");
    let ingredients = [];
    for (let i = 0; i < names.length; i++) {
        let ingredient = { name: names[i].value, quantity: quatities[i].value, unit: units[i].value};
        ingredients.push(ingredient)
    }

    fetch('http://localhost:3000/receipes', {
        method: 'POST',
        body: JSON.stringify({
            name: document.getElementById('inputName').value,
            nb_part: document.getElementById('inputNbPart').value,
            description: document.getElementById('inputDescription').value,
            link : document.getElementById('inputLink').value,
            ingredients : ingredients,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

function update(id) {
    let names = document.querySelectorAll("[name='ingredientsName[]']");
    let quatities = document.querySelectorAll("[name='ingredientsQuantity[]']");
    let units = document.querySelectorAll("[name='ingredientsUnity[]']");
    let ingredients = [];
    for (let i = 0; i < names.length; i++) {
        let ingredient = { name: names[i].value, quantity: quatities[i].value, unit: units[i].value};
        ingredients.push(ingredient)
    }
    fetch('http://localhost:3000/receipes/' + id, {
    method: 'PUT',
    body: JSON.stringify({
        name: document.getElementById('inputName').value,
        nb_part: document.getElementById('inputNbPart').value,
        description: document.getElementById('inputDescription').value,
        link : document.getElementById('inputLink').value,
        ingredients : ingredients,
    }),
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