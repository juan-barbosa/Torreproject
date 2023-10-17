document.addEventListener("DOMContentLoaded", function () {
    // Get all the "Add to Favorites" buttons
    const addToFavoritesButtons = document.querySelectorAll(".add-to-favorites-button");

    // Get the list of favorite profiles from local storage or initialize an empty array
    const favoritesList = JSON.parse(localStorage.getItem("favoritesList")) || [];

    // Iterate through each "Add to Favorites" button
    addToFavoritesButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Check if the profile is already favorited
            const isFavorited = button.classList.contains("favorited");
            const username = button.getAttribute("data-username");
            const image_url = button.getAttribute("data-image");
            const description = button.getAttribute("data-description");
            const user = button.getAttribute("data-user");

            if (!isFavorited) {
                // Add the "favorited" class for styling
                button.classList.add("favorited");
                addFavorite(username, user, image_url, description);
                // Add the profile to the favorites list
                favoritesList.push(username);
            } else {
                // Remove the "favorited" class
                button.classList.remove("favorited");
                removeFavorite(username);
                // Remove the profile from the favorites list
                const index = favoritesList.indexOf(username);
                if (index !== -1) {
                    favoritesList.splice(index, 1);
                }
            }

            // Save the updated favorites list in local storage
            localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
        });

        // Check if the profile is in the favorites list and apply the "favorited" class
        const username = button.getAttribute("data-username");
        if (favoritesList.includes(username)) {
            button.classList.add("favorited");
        }
    });
});


// Event listener for toggling search preferences
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-buttons-container");
    const searchForm = document.getElementById("result_lim");

    toggleButton.addEventListener("click", function () {
        // Toggle the visibility of the search form
        if (searchForm.style.display === "none" || !searchForm.style.display) {
            searchForm.style.display = "block";
        } else {
            searchForm.style.display = "none";
        }
    });
});

// Event listener for rotating the preferences button
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("toggle-buttons-container");
    const button = document.getElementById("toggle-search-button");

    container.addEventListener("click", function () {
        // Toggle the "rotated" class to rotate the button 90 degrees
        button.classList.toggle("rotated");
    });
});


// Function to add a profile to favorites
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
        // Create a notification and display it for 5 seconds
        const notificationDiv = document.createElement("div");
        notificationDiv.innerText = data.message;
        notificationDiv.className = "notification"; 

        document.body.appendChild(notificationDiv);

        setTimeout(() => {
            document.body.removeChild(notificationDiv);
        }, 5000); 
    });
}

// Function to remove a profile from favorites
function removeFavorite(name) {
    fetch(`/remove_favorite/${name}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Create a notification and display it for 5 seconds
        const notificationDiv = document.createElement("div");
        notificationDiv.innerText = data.message;
        notificationDiv.className = "notification"; 

        document.body.appendChild(notificationDiv);

        setTimeout(() => {
            document.body.removeChild(notificationDiv);
        }, 5000); 
    });
}
