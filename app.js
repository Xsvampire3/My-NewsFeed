const newsContainer = document.querySelector("#newsContainer");
const saveButton = document.querySelector("#saveButton");
const loadSavedButton = document.querySelector("#loadSavedButton");
const loadNewsButton = document.querySelector("#loadNewsButton");
const categorySelect = document.querySelector("#categorySelect");
const loader = document.querySelector(".loader");

function showDiv() {
  document.querySelector('#hidden').style.display = "block";
}

const savedNews = JSON.parse(localStorage.getItem("savedNews")) || [];

const handleSavedNews = (savedItem) => { 
  savedNews.push(savedItem);
  console.log(savedNews);
  alert("News saved");
};


const removeSavedNewsItem = (newsItem) => {
  const index = savedNews.indexOf(newsItem);
  if (index !== -1) {
    savedNews.splice(index, 1);
    localStorage.setItem("savedNews", JSON.stringify(savedNews));
    loadSavedNews();
    console.log("News removed");
  }
};


const getNews = (category = "science") => {
  newsContainer.innerHTML = "";
  loader.style.display = "block";

  fetch(`https://api.currentsapi.services/v1/latest-news?apiKey=eJ47OiYS3zC815vMB9z19Di6uJ_EaL119FoMrS0geMROMtIR&category=${category}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data", data);
      data.news.forEach((newsItem) => {
        const div = document.createElement("div");
        div.classList.add("newsItem");
        div.innerHTML = `
          <p>By <strong>${newsItem.author}</strong></p>
          <h2 id="newsheading">${newsItem.title}</h2>
          <div id="box">
            <img src="${newsItem.image}" class="img"></img>
            <div id="innerbox">
              <p id="nscontent">${newsItem.description} <a href="${newsItem.url}" style="text-decoration:none">READ MORE</a></p>
              <p>Date: ${newsItem.published.slice(0, 10)}</p>
              <p>Time: ${newsItem.published.slice(11, 16)}</p>
            </div>
          </div>
        `;
        const button = document.createElement("button");
        button.style.color = 'white';
        button.style.backgroundColor = 'grey';
        button.style.border = 'none';
        button.style.marginTop = '10px';
        button.style.cursor = 'pointer';
        button.style.padding = '5px';
        button.innerHTML = "Save";
        button.onclick = function () {
          handleSavedNews(newsItem);
        };
        div.appendChild(button);
        newsContainer.appendChild(div);
      });
      loader.style.display = "none";
    })
    .catch((error) => {
      console.error('Error:', error);
      loader.style.display = "none";
    });
};

const saveNews = () => {
  const news = Array.from(document.querySelectorAll(".newsItem")).map(
    (newsItem) => {
      const title = newsItem.querySelector("h2").textContent;
      const description = newsItem.querySelector("#nscontent").textContent;
      const author = newsItem.querySelector("p strong").textContent;
      const image = newsItem.querySelector("img").getAttribute("src");
      const url = newsItem.querySelector("a").getAttribute("href");
      const published = newsItem.querySelector("p:nth-child(3)").textContent.slice(6);
      const time = newsItem.querySelector("p:nth-child(4)").textContent.slice(6);
      
      return {
        title,
        description,
        author,
        image,
        url,
        published,
        time,
      };
    }
  );
  console.log("Saved news", news);
  localStorage.setItem("savedNews", JSON.stringify(news));
};

const loadSavedNews = () => {
  console.log("Saved News", savedNews);
  newsContainer.innerHTML = "";
  //if (!savedNews) {
   // return;
  //}
  savedNews.forEach((newsItem) => {
    const div = document.createElement("div");
    div.classList.add("newsItem");
    div.innerHTML = `
      <p>By <strong>${newsItem.author}</strong></p>
      <h2 id="newsheading">${newsItem.title}</h2>
      <div id="box">
        <img src="${newsItem.image}" class="img"></img>
        <div id="innerbox">
          <p id="nscontent">${newsItem.description} <a href="${newsItem.url}" style="text-decoration:none">READ MORE</a></p>
          <p>Date: ${newsItem.published.slice(0, 10)}</p>
          <p>Time: ${newsItem.published.slice(11, 16)}</p>
        </div>
      </div>
    `;

    const removeButton = document.createElement("button");
    removeButton.style.color = 'white';
    removeButton.style.backgroundColor = 'grey';
    removeButton.style.border = 'none';
    removeButton.style.marginTop = '10px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.padding = '5px';
    removeButton.innerHTML = "Remove";
    removeButton.onclick = function () {
      removeSavedNewsItem(newsItem);
    };

    div.appendChild(removeButton);
    newsContainer.appendChild(div);
  });
};

loadSavedButton.addEventListener("click", loadSavedNews);
loadNewsButton.addEventListener("click", () => {
  getNews(categorySelect.value);
});

getNews();
