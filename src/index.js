const baseUri = "http://localhost:3000"
let allPokemon = []

// GET request => all pokes
const getPokemon = function() {
  const endpoint = "/pokemon"
  return fetch(`${baseUri}${endpoint}`, {method: "GET"})
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw response
      }
    })
}

const findPokemon = function(id) {
  return allPokemon.find(function(pokemon) {
    return pokemon.id == id
  })
}
const buildPokeDivs = function(pokemonArray) {
  return pokemonArray.map(function(pokemon) {
    return `
      <div class="pokemon-container">
        <div style="width:230px;margin:10px;background:#fecd2f;color:#2d72fc" class="pokemon-frame">
          <h1 class="center-text">${pokemon.name}</h1>
          <div class="center-text" data-action="show-modal" data-id=${pokemon.id}>View Details</div>
          <div style="width:239px;margin:auto">
            <div style="width:96px;margin:auto">
              <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites.front}">
            </div>
          </div>
        </div>
      </div>`
  }).join(" ")
}

document.addEventListener('DOMContentLoaded', function(event) {
  const popup = document.querySelector('#poke-popup')
  const closePopup = popup.querySelector('.close-button')
  const popupContent = popup.querySelector('.modal-body')

  // popup closer
  closePopup.addEventListener('click', function(event) {
    popup.classList.toggle('show-modal')
  })

  // load the pokemon list
  const pokemonContainer = document.getElementById('pokemon-container')
  getPokemon()
    .then(json => {
      allPokemon = json
      pokemonContainer.innerHTML = buildPokeDivs(allPokemon)
    })
  
  // add search filter (partial matching)
  const pokemonSearchInput = document.getElementById('pokemon-search-input')
  pokemonSearchInput.addEventListener('input', function(event) {
    const input = event.target.value
    const filteredPokemon = allPokemon.filter(function(pokemon) {
      return pokemon.name.includes(input)
    })
    pokemonContainer.innerHTML = buildPokeDivs(filteredPokemon)
  })

  // add click handler for individual pokemons to flip the sprite
  pokemonContainer.addEventListener('click', function(event) {
    const eventTarget = event.target
    // image flipper
    if (eventTarget.dataset.action === 'flip') {
      const pokemon = findPokemon(event.target.dataset.id)
      eventTarget.src = (eventTarget.src === pokemon.sprites.front) ? pokemon.sprites.back : pokemon.sprites.front
    // detail viewer
    } else if (eventTarget.dataset.action === 'show-modal') {
      const pokemon = findPokemon(event.target.dataset.id)
      popupContent.innerHTML = `
        <h1>Info for ${pokemon.name}</h1>
        <p>
          <strong>Height: </strong>${pokemon.height}<br>
          <strong>Weight: </strong>${pokemon.weight}<br>
          <strong>Abilities: </strong>${pokemon.abilities.join(", ")}<br>
          <strong>Moves: </strong>${pokemon.moves.join(", ")}<br>
          <strong>Types: </strong>${pokemon.types.join(", ")}
        </p>`
      popup.classList.toggle('show-modal')
    } else {
      event.stopPropagation()
    }
  })


})
