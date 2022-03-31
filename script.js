const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const searchForm = document.getElementById("search-form");
const searchEl = document.getElementById("search");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let searchText = "";

// Unsplash API
let count = 5;
// Normally, don't store API Keys like this, but an exception made here because it is free, and the data is publicly available!
const apiKey = "nwlJkoVEaWKcd6E2K_pZjxp8cY_4CAMiNMMhr2UQBNU";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    count = 30;
  }
}

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements for links & photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    // Create <img> for photo
    const img = document.createElement("img");

    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.descrition,
      title: photo.description,
    });

    // Event listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);

    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });

  if (searchText) {
    window.scrollTo(0, document.body.scrollHeight);
  }
}

// Get photos from Unsplash API
async function getPhotos(searchText = "") {
  try {
    const response = await fetch(
      searchText ? `${apiUrl}&query=${searchText}` : apiUrl
    );
    photosArray = await response.json();
    displayPhotos();
  } catch (err) {
    // Catch Error Here
  }
}

// Event Listener

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 800 &&
    ready
  ) {
    ready = false;
    getPhotos(searchText);
  }
});

// Search Form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchText = searchEl.value;
  getPhotos(searchEl.value);
  searchEl.value = "";
});

// On load
// Todo: Uncomment getPhotos()
getPhotos();
