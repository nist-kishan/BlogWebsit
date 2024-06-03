let dropdown = document.querySelectorAll('#country')

for (let select of dropdown) {
  for (curcode in countryName) {
    let newOption = document.createElement('option')
    newOption.innerText = countryName[curcode].name;
    newOption.value = curcode;
    if (curcode === "IND")
      newOption.selected = true;
    select.append(newOption)
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
    try{
  let currCode = element.value;
  let countryCode = countryName[currCode].code;
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}catch(e){
    let img = element.parentElement.querySelector("img");
    img.src='../images/unknownFlag.jpeg'
}
};

let blogCategoryElements = document.querySelectorAll('#categories');
for (let select of blogCategoryElements) {
    for (let category of blogCategories) {
        let newOption = document.createElement('option');
        newOption.innerText = category;
        newOption.value = category;
        select.append(newOption);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    let fileUpload = document.querySelector('#imageUpload');
    let fileInfo = document.querySelector('#file-info');
    let image = document.querySelector('#setImage');

    fileUpload.addEventListener('change', function () {
        if (fileUpload.files.length > 0) {
            let file = fileUpload.files[0];
            fileUpload.textContent = "Update"

            let reader = new FileReader();
            reader.onload = function (e) {

                image.src = e.target.result;
            };

            reader.readAsDataURL(file);

            fileInfo.textContent = `Selected file: ${file.name}`;
        } else {
            console.log('No file selected');
            fileInfo.textContent = 'No file selected';
            image.src = '/uploads/male.jpg';
        }
    });
});
