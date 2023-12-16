import "../styles/reset.scss";
import "../styles/styles.scss";

const searchBar = document.getElementsByClassName('search__input')[0]
const suggestionList = document.getElementById('suggestion-list');

searchBar.addEventListener('input', function () {
    const query = searchBar.value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/cityautocomplete?query=${query}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const suggestions = JSON.parse(xhr.responseText);
            suggestions.forEach(function(suggestion) {
                const li = document.createElement('li');
                li.textContent = suggestion;
                suggestionList.appendChild(li);
            })
        }
    }
    xhr.send();
})
