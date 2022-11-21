console.log("hy");

//feccseled a kép mappát és aszem json filet csinál belőle vagy mi
const fetchImages = async () => {
    return fetch("/images")
    .then(data => data.json())
}

const imageComponent = (url, title, uploadDate, phName) => `
    <div class ="card">
        <h2>${title}</h2>
        <h2>${uploadDate}</h2>
        <h2>${phName}</h2>
        <img src = "public/images/${url}" />
    </div>
    `

// kikonzololja a fetchImages mappát az index.html-re
const init = async () => {
    const data = await fetchImages();
    console.log(data);

    const rootElement = document.querySelector("#root");

    data.map(image => {
        rootElement.insertAdjacentHTML(
            "beforeend",
            imageComponent(image.url, image.title, image.uploadDate, image.phName));
    });
};

init();