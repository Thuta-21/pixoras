const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const searchi = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const nav = document.getElementsByClassName('navbar');

let ready = false;
let imageLoad = 0;
let totalImage = 0;
let photosArray = [];
let searchText = '';
let initailCount = true;

// Unsplash API
let count = 5;
const apiKey = 'kiZI4FyI16TdCKCDqS9YR3Z4EyclSxHNyyFZIS1DHvQ';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${searchText}`;

// search when click search
function search() {
    if (searchText !== '') {
        loader.hidden = false;
        count = 5;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${searchText}`;
        imageContainer.replaceChildren();
        getPhoto();
    }
    count = 30;
}

// get input search text
function getSearchText(event) {
    searchText = event.target.value;
}

function isInitail() {
    if(initailCount === false) {
        count = 30;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${searchText}`;
    }
}

function imageLoaded(event) {
    imageLoad++;
    if (imageLoad === totalImage) {
        ready = true;
        event.target.parentNode.querySelectorAll('.bottom-photo').forEach(i => {
            i.style.display = 'flex';
        });
    }
}

// Helper function to Set Attributes on DOM Elements
function setAttribute(elements, arrtibutes) {
    for (const key in arrtibutes) {
        elements.setAttribute(key, arrtibutes[key]);
    }
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
    imageLoad = 0;
    totalImage = photosArray.length;
    const fragment = document.createDocumentFragment();

    photosArray.forEach(photo => {
        const { aperture, exposure_time, focal_length, iso, name } = photo.exif;

        // Photo img
        const img = document.createElement("img");
        setAttribute(img, {
        src: photo.urls.regular,
        alt: photo.alt_description || "Photo",
        title: photo.alt_description || "Photo",
        });
        img.addEventListener("load", imageLoaded);

        // bottom_photo container
        const bottom_photo = document.createElement("div");
        bottom_photo.className = "bottom-photo";
        // details container
        const details = document.createElement("div");
        details.className = "details";

        // Camera info
        const divCamera = document.createElement("div");
        divCamera.innerHTML = `<i class="fa-solid fa-camera"></i> <span>${name || "Unknown"}</span>`;

        // Location info
        const divLocation = document.createElement("div");
        divLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> <span>${photo.location.name || "Unknown"}</span>`;

        // Setting info
        const divSetting = document.createElement("div");
        setAttribute(divSetting, {
        id: "popover",
        "data-bs-toggle": "popover",
        "data-bs-placement": "top",
        "data-bs-title": "Camera Setting Details",
        "data-bs-content": `Aperture - ${aperture || 'Unknown'}, Exposure - ${exposure_time || 'Unknown'}, Focal Length - ${focal_length || 'Unknown'}, ISO - ${iso || 'Unknown'}`,
        });
        divSetting.innerHTML = `<i class="fa-solid fa-sliders"></i> <span>Camera Setting</span>`;

        // Download button
        const download_a = document.createElement("a");
        setAttribute(download_a, {
        id: "download",
        href: `${photo.links.download}&force=true`,
        });
        download_a.innerHTML = `Download <i class="fa-solid fa-download"></i>`;

        // Build structure
        details.append(divCamera, divLocation, divSetting);
        bottom_photo.append(details, download_a);
        fragment.append(img, bottom_photo);
    });

  // Append all at once (fast!)
  imageContainer.appendChild(fragment);

  // Re-init popovers for new elements
  const popoverTriggerList = document.querySelectorAll("[data-bs-toggle='popover']");
  [...popoverTriggerList].map(el => new bootstrap.Popover(el));
}

// Get photos from Unsplash API
async function getPhoto() {
    initailCount === true ? loader.hidden = false: '';
    isInitail();
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        initailCount = false;
        displayPhotos();
    } catch(err) {
        console.log('Fetch error:', err);
    } finally {
        loader.hidden = true;
    }
}

// Check to see if scrolling near buttom of page, load more Photos
window.addEventListener('scroll', () => {
    if(window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhoto();
    }
});

//On Load
getPhoto();

// for searching
searchi.addEventListener('change', getSearchText);
searchBtn.addEventListener('click', search);