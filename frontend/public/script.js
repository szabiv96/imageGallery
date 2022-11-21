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
    `;


const formComponent = () => `
    <form>
        <input type="file" name="file" />
        <input type="text" name="title" />
        <input type="text" name="phname" />
        <button>Send!</button>
    </form>
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

    rootElement.insertAdjacentHTML("beforeend", formComponent());
    const formElement = document.querySelector("form");
    formElement.addEventListener("submit", (event) => {
        event.preventDefault()

        const formData = new FormData()
        //appenddel csatolunk hozzá a json-hoz dolgokat vagy mi
        formData.append("image", formElement.querySelector('input(name="file")').files[0])
        formData.append("title", formElement.querySelector('input(name="title")').value)
        formData.append("phname", formElement.querySelector('input(name="phname")').value)
    });
};

init();

//1:50:16