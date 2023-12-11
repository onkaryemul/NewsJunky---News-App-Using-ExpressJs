// script.js

// Function to fetch the API key from the server
const fetchApiKey = async () => {
    try {
        const response = await fetch('/api-key');
        const data = await response.json();
        return data.apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
        return null;
    }
};


let articlesPerPage;
let totalPages;

let query = "all" || document.getElementById('query');;
let pageno = 1 || document.getElementById('pageno');;

if (window.location.search) {
    query = window.location.search.split("?")[1]?.split("&")[0]?.split("=")[1] || "";
    pageno = parseInt(window.location.search.split("?")[1]?.split("&")[1]?.split("=")[1]) || 1;
}

console.log(query, pageno);

// Function to fetch news using the obtained API key
const fetchNews = async (query, pageno) => {
    const apiKey = await fetchApiKey();

    if (!apiKey) {
        console.error('API key not available.');
        return;
    }

    try {
        let response = await fetch(`/api?q=${query}&apiKey=${apiKey}&pageSize=12&page=${pageno}`);
        let data = await response.json();

        console.log(data);

        let queryText = document.getElementById('queryText');
        queryText.innerHTML = query.replace("+", " ");
        let queryResults = document.getElementById('queryResults');
        queryResults.innerHTML = response.totalResults;

        totalPages = Math.ceil(response.totalResults / articlesPerPage);

        let pre = document.getElementById('pre');
        let next = document.getElementById('next');

        if (pre && next) {
            pre.href = `/?q=${query}&pageno=${pageno - 1}`;
            next.href = `/?q=${query}&pageno=${pageno + 1}`;
        }

        let str = '';

        for (let item of data.articles) {
            // Provide a default image URL (news.jpg) if item.urlToImage is falsy
            const imageUrl = item.urlToImage || 'news.jpg';

            let date = new Date(item.publishedAt).toLocaleDateString();

            if (item.title && item.description && item.source.name) {
                str = str +
                   `<div class="card my-4 mx-2" style="width: 18rem;">
                       <img src="${imageUrl}" class="card-img-top" alt="...">
                       <div class="card-body">
                          <h5 class="card-title">${item.title}</h5>
                          <p class="fw-bolder mt-3 mb-0">Published: ${date}</p>
                          <p class="fw-bolder mt-0 mb-2">Source: ${item.source.name}</p>
                          <p class="card-text">${item.description}</p>
                          <a target="_blank" href="${item.url}" class="btn btn-primary">Read More</a>
                       </div>
                    </div>`;
            }
        }

        let content = document.getElementById('content');
        content.innerHTML = str;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


fetchNews(query || "all", pageno);
