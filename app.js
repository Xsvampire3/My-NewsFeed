const newsContainer = document.querySelector("#newsContainer");
const saveButton = document.querySelector("#saveButton");
const loadSavedButton = document.querySelector("#loadSavedButton");
const loadNewsButton = document.querySelector("#loadNewsButton");
const categorySelect = document.querySelector("#categorySelect");
const loader = document.querySelector(".loader");

function showDiv() {
  document.querySelector('#hidden').style.display = "block";
}

const getNews = (category = "science") => {
  newsContainer.innerHTML = "";
  fetch(`https://inshorts.deta.dev/news?category=${category}`)
    .then((response) => response.json())
    .then((data) => {
       console.log("Data", data)
      data.data.forEach((newsItem) => {
        const div = document.createElement("div");
        div.classList.add("newsItem");
        div.innerHTML = `
          <p>By <strong>${newsItem.author}</strong></p>
          <h2 id="newsheading">${newsItem.title}</h2>
          <div id="box">
          <img src="${newsItem.imageUrl}" class="img"></img>
          <div id="innerbox">
          <p id="nscontent">${newsItem.content} <a href="${newsItem.readMoreUrl}" style="text-decoration:none">READ MORE</a></p>
          <p>Date:- ${newsItem.date}</p>
          <p>Time:- ${newsItem.time}</p>
          </div>
          </div>
          <button class="likeButton">Like</button>
        `;
        newsContainer.appendChild(div);
      });
      loader.style.display = "none";
    });
};

const saveNews = () => {
  const news = Array.from(document.querySelectorAll(".newsItem")).map(
    (newsItem) => {
      return {
        title: newsItem.querySelector("h2").textContent,
        content: newsItem.querySelector("#nscontent").textContent,
      };
    }
  );
  console.log("saved news", news)
  localStorage.setItem("savedNews", JSON.stringify(news));
};

const loadSavedNews = () => {
  const savedNews = JSON.parse(localStorage.getItem("savedNews"));
  console.log("saved news from storage", savedNews)
  if (!savedNews) {
    return;
  }
  savedNews.forEach((newsItem) => {
    const div = document.createElement("div");
    div.classList.add("newsItem");
    div.innerHTML = `
    <h2>${newsItem.title}</h2>
    <p>${newsItem.content}</p>
    <button class="likeButton">Like</button>
    `;
    newsContainer.appendChild(div);
  });
};

saveButton.addEventListener("click", saveNews);
loadSavedButton.addEventListener("click", loadSavedNews);
loadNewsButton.addEventListener("click", () => {
  getNews(categorySelect.value);
});

getNews();