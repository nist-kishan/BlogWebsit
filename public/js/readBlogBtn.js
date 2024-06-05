let closebtn = document.querySelector('#closeBtn');
if (closebtn) {
    closebtn.addEventListener('click', () => {
        window.location.href = '/';
    });
} else {
    console.error('"closeBtn" not found.');
}

let flagIcon = document.querySelector('#imagecode');
let countryCode = document.querySelector('#outputCountry').textContent.trim();
let val = countryName[countryCode].code.trim();
let scrs = `https://flagsapi.com/${val}/flat/64.png`;
flagIcon.src = scrs;

let countriesName = document.querySelector('#outputCountry');
countriesName.innerText=countryName[countryCode].name.trim();
console.log(countryName)