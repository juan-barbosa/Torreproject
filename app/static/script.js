document.addEventListener("DOMContentLoaded", function () {
    const addToFavoritesButtons = document.querySelectorAll(".add-to-favorites-button");

    // Get a favorites list from local storage
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
                // Add the profile to favorites list
                favoritesList.push(username);
            } else {
                button.classList.remove("favorited");
                removeFavorite(username);
                // Remove the profile from favorites list
                const index = favoritesList.indexOf(username);
                if (index !== -1) {
                    favoritesList.splice(index, 1);
                }
            }

            // Save the favorites list in the local storage
            localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
        });

        // Check if the profile is the favorites list and apply the respective design
        const username = button.getAttribute("data-username");
        if (favoritesList.includes(username)) {
            button.classList.add("favorited");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-buttons-container");
    const searchForm = document.getElementById("result_lim");

    toggleButton.addEventListener("click", function () {
        // Alternate "preferences" visibility
        if (searchForm.style.display === "none" || !searchForm.style.display) {
            searchForm.style.display = "block";
        } else {
            searchForm.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("toggle-buttons-container");
    const button = document.getElementById("toggle-search-button");

    container.addEventListener("click", function () {
        button.classList.toggle("rotated");
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

