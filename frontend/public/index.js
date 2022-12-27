const rootElement = document.querySelector('#root');
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js';

const swiperProperties = () => {
    const swiper = new Swiper(".swiper", {
        direction: "horizontal",
        observer: true,
        observerParenst: true,
        parallax: true,

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    })
};

const bodyParts = `
    <header>
        <h1><a href="#">Wonderful Gallery</a></h1>
        <button id="uploadButt">Upload Images</button>
    </header>
    <main>
    </main>
`

const imageCard = (name, specId) => `
<div class="imageElement">    
    <div class="deletePic" id="pic-${specId}"><h3>X</h3></div>
        <div class="imageCard">
            <img src="images/${name}">
        </div>
</div
`

const swiperViewMode = `
    <div class="swiper">

        <div id="closeWindow"><h3>X</h3></div>

        <div class="swiper-wrapper">

        </div>

        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>

`

const swiperImagePiece = (name) => `
    <div class="swiper-slide">
        <img src="images/${name}">
    </div>
`

const uploadForm = `
    <div class="uploadForm">
    <div class="closeUploadWindow"><h3>X</h3></div>
    <form method="POST" action="/uploadImage" class="form" enctype="multipart/form-data">
        <div>
            <label>Upload multiple picture</label>
            <input type="file" name="avatarPic" required multiple  />
        </div>
        <div>
            <input type="submit" value="Upload" />
        </div>
    </form>
    </div>
`
//fetch
async function fetchImageList() {
    const response = await fetch('/imageList', {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status}`)
    }
    window.imageList = await response.json();
}

//loadevent 
async function loadEvent() {
    //fetch calling in
    await fetchImageList();
    
    rootElement.insertAdjacentHTML('beforeend', bodyParts);
    const mainSection = document.querySelector('main');
    const uploadButt = document.querySelector('#uploadButt');

    //upload button loading the div and sending data to server side
    uploadButt.addEventListener('click', () => {
        rootElement.insertAdjacentHTML('beforeend', uploadForm);

        const form = document.querySelector('.form');
        const closeButton = document.querySelector('.closeUploadWindow');
        const uploadFormDiv = document.querySelector('.uploadForm');

        closeButton.addEventListener('click', () => {
            uploadFormDiv.remove();
        })

        function submitUploadPicture(event) {
            const formData = new FormData(event.target);
            console.log("File Sent!");
    
            fetch('/uploadImage', {
                method: 'POST',
                body: formData,
            })
                .then((res) => res.json())
                .then((data => { console.log('Success', data) }))
                .catch('Error ', console.error())
        }
        form.addEventListener('submit', submitUploadPicture);
    })

    //generate picture cards
    imageList.forEach(image => {
        //delete file format and repleace spaces with underscore
        const newImageName = image.name.slice(0, -4);
        const finalImageName = newImageName.replaceAll(' ', '_');
        mainSection.insertAdjacentHTML('beforeend', imageCard(image.name, finalImageName));
        const currentDeletB = document.querySelector(`#pic-${finalImageName}`);

        // every image card has a delete button
        //sending delete request server side 
        currentDeletB.addEventListener('click', () => {
            fetch(`/imageList/${image.name}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                }
            }).then(async (data) => {
                if (data.status === 200) {
                    const res = await data.json();
                    console.log(res.response);
                }
            })
            console.log("image deleted: ", image.name);
            currentDeletB.parentElement.remove();
        })
    });
    //all imageCards are selected
    const imageS = document.querySelectorAll('.imageCard');

    //every imageCard of the imageCards
    imageS.forEach((image) => {
        console.log(image);

        //swiper full screen
        image.addEventListener('click', () => {
            rootElement.insertAdjacentHTML('beforeend', swiperViewMode);

            const swiperWrapper =  document.querySelector('.swiper-wrapper');
            const closeButton = document.querySelector('#closeWindow');
            const swiperDiv = document.querySelector('.swiper');

            //insert images into swiper
            imageList.forEach(image => {
                swiperWrapper.insertAdjacentHTML('beforeend', swiperImagePiece(image.name))
            });

            //close button on the corner
            closeButton.addEventListener('click', () => {
                console.log("window is closed");
                swiperDiv.remove();
            })
            swiperProperties();
        })
    });
}
window.addEventListener('load', loadEvent);