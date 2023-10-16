document.addEventListener("DOMContentLoaded", function () {
    const addToFavoritesButtons = document.querySelectorAll(".add-to-favorites-button");

    // Obtén la lista de perfiles en favoritos del almacenamiento local
    const favoritesList = JSON.parse(localStorage.getItem("favoritesList")) || [];

    addToFavoritesButtons.forEach(button => {
        button.addEventListener("click", function () {
            const isFavorited = button.classList.contains("favorited");
            const username = button.getAttribute("data-username");
            const image_url = button.getAttribute("data-image");
            const description = button.getAttribute("data-description");
            const user =button.getAttribute("data-user")

            if (!isFavorited) {
                button.classList.add("favorited");
                addFavorite(username, user, image_url, description);
                // Agrega el perfil a la lista de favoritos
                favoritesList.push(username);
            } else {
                button.classList.remove("favorited");
                removeFavorite(username);
                // Elimina el perfil de la lista de favoritos
                const index = favoritesList.indexOf(username);
                if (index !== -1) {
                    favoritesList.splice(index, 1);
                }
            }

            // Guarda la lista de favoritos en el almacenamiento local
            localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
        });

        // Verifica si el perfil está en la lista de favoritos y aplica el estilo apropiado
        const username = button.getAttribute("data-username");
        if (favoritesList.includes(username)) {
            button.classList.add("favorited");
        }
    });
});


function addFavorite(name, user, image_url, description) {
    fetch(`/add_favorite/${name}`, {
        method: 'POST',
        body: JSON.stringify({ user, image_url, description }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const notificationDiv = document.createElement("div");
        notificationDiv.innerText = data.message;
        notificationDiv.className = "notification"; 

        document.body.appendChild(notificationDiv);

        setTimeout(() => {
            document.body.removeChild(notificationDiv);
        }, 5000); 
    });
}

function removeFavorite(name) {
    fetch(`/remove_favorite/${name}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const notificationDiv = document.createElement("div");
        notificationDiv.innerText = data.message;
        notificationDiv.className = "notification"; 

        document.body.appendChild(notificationDiv);

        setTimeout(() => {
            document.body.removeChild(notificationDiv);
        }, 5000); 
    });
}
