let createBlog = document.querySelector('#createBtn');
if (createBlog) {
    createBlog.addEventListener('click', () => {
        window.location.href = '/createBlog';
    });
} else {
    console.error('"createBtn" not found.');
}

let searchBlog = document.querySelector('#searchBtn');
if (searchBlog) {
    searchBlog.addEventListener('click', () => {
        window.location.href = '/search';
    });
} else {
    console.error('"searchBtn" not found.');
}
