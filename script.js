document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'kDJTS02g48e3dfUyX0FhxzKz5Vy8u2lvfQbels0C'; 
    const wrapper = document.getElementById('wrapper');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const viewPictureButton = document.getElementById('view-picture');
    const favoritesList = document.getElementById('favorites-list');
    const hdModal = document.getElementById('hd-modal');
    const hdImg = document.getElementById('hd-img');
    const hdClose = document.querySelector('.hd-close');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryContent = document.getElementById('gallery-content');
    const galleryClose = document.querySelector('.gallery-close');
    const openGalleryButton = document.getElementById('open-gallery');

    function fetchAPOD(date) {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
            .then(response => response.json())
            .then(data => {
                displayModal(data);
            })
            .catch(error => console.error('Error fetching APOD:', error));
    }

    viewPictureButton.addEventListener('click', () => {
        const date = document.getElementById('apod-date').value;
        fetchAPOD(date);
    });

    function closeModalFunction() {
        modal.classList.remove('show');
        wrapper.classList.remove('hide');
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModalFunction();
        } else if (event.target == hdModal) {
            hdModal.style.display = 'none';
        } else if (event.target == galleryModal) {
            galleryModal.style.display = 'none';
        }
    }

    hdClose.onclick = function() {
        hdModal.style.display = 'none';
    }

    galleryClose.onclick = function() {
        galleryModal.style.display = 'none';
    }

    function displayModal(data) {
        modalBody.innerHTML = `
        
            <div class="title-date">
                <span class="close">&#11164;</span>
                <h1>${data.title}</h1>
                <p>${data.date}</p>
            </div>
            
            <div class="content-grid">
                <div class="image-fav">
                    <svg class="fav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-url="${data.url}" data-title="${data.title}" data-date="${data.date}">
                        <path d="m21.5 9.757-5.278 4.354 1.649 7.389L12 17.278 6.129 21.5l1.649-7.389L2.5 9.757l6.333-.924L12 2.5l3.167 6.333z"/>
                    </svg>
                    <img class="astronomy-picture" src="${data.url}" alt="${data.title}" data-hd-url="${data.hdurl || data.url}">
                </div>
                <div class="explanation-content">
                    <p class="img-credit">Image Credit & Copyright: ${data.copyright || 'Unknown'}</p>
                    <p>${data.explanation}</p>
                </div>
            </div>
        `;
        modal.classList.add('show');
        wrapper.classList.add('hide');

        const closeModal = document.querySelector('.title-date .close');
        closeModal.onclick = function() {
            closeModalFunction();
        }

        const favIcon = document.querySelector('.fav-icon');
        favIcon.addEventListener('click', (event) => {
            favIcon.classList.toggle('clicked'); // Toggle the clicked class to change color
            saveFavorite(favIcon.dataset.url, favIcon.dataset.title, favIcon.dataset.date);
        });

        const astronomyPicture = document.querySelector('.astronomy-picture');
        astronomyPicture.addEventListener('click', () => {
            hdImg.src = astronomyPicture.dataset.hdUrl;
            hdModal.style.display = 'block';
        });
    }

    function saveFavorite(url, title, date) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.url === url)) {
            favorites.push({ url, title, date });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        }
    }

    function deleteFavorite(url) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(fav => fav.url !== url);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayGallery();
    }

    function displayFavorites() {
        favoritesList.innerHTML = '';
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.forEach(favorite => {
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.innerHTML = `
                <img src="${favorite.url}" alt="${favorite.title}">
                <span class="delete-icon" data-url="${favorite.url}">&times;</span>
            `;
            favoritesList.appendChild(favoriteItem);

            favoriteItem.querySelector('.delete-icon').addEventListener('click', () => {
                deleteFavorite(favorite.url);
            });
        });
    }

    function displayGallery() {
        galleryContent.innerHTML = '';
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.forEach(favorite => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('favorite-item');

            const img = document.createElement('img');
            img.src = favorite.url;
            img.alt = favorite.title;
            img.dataset.url = favorite.url;
            img.addEventListener('click', () => {
                hdImg.src = img.dataset.url;
                hdModal.style.display = 'block';
            });

            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.dataset.url = favorite.url;
            deleteIcon.innerHTML = '&times;';
            deleteIcon.addEventListener('click', () => {
                deleteFavorite(favorite.url);
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteIcon);
            galleryContent.appendChild(imgContainer);
        });
        galleryModal.style.display = 'block';
    }

    openGalleryButton.addEventListener('click', displayGallery);

    displayFavorites();
});
