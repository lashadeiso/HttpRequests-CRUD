const apiBaseUrl = "http://localhost:8000/Humans";

class Human {
  constructor(firsName, lastName, eMail, img) {
    this.firsName = firsName;
    this.lastName = lastName;
    this.eMail = eMail;
    this.img = img;
  }
}

function getTableRow(item) {
  return `
            <tr>
            <td>
            <img class="human-img" src="${item.img}" alt="human-img">
            </td>
            <td>${item.firsName}</td>
            <td>${item.lastName}</td>
            <td>${item.eMail}</td>
            <td>
            <button type='button' onclick='updateUserItem(${item.id})' class='btn btn-warning col-md-12 d-block'>Update</button> 
            </td>
            <td>
            <button class="btn btn-warning" id="remove-btn" onClick="deleteDataOnServer(${item.id})">Delete</button>
            </td>
        </tr>
  `;
}

//--------------------------------------------------------------------Http-POST
function createDataOnServer(humanCreate) {
  const httpClient = new XMLHttpRequest();
  httpClient.open("POST", apiBaseUrl);
  httpClient.setRequestHeader("content-type", "application/json");
  httpClient.send(JSON.stringify(humanCreate));
}

let humansArr = [];
function getDataToCreateHuman() {
  const firstNameInpValue = document.querySelector("#firstName").value;
  const lastNameInpValue = document.querySelector("#lastName").value;
  const eMailInpValue = document.querySelector("#eMail").value;
  const imgInpValue = document.querySelector("#img");
  let reader = new FileReader();
  reader.readAsDataURL(imgInpValue.files[0]);
  reader.onload = function () {
    humanItem = new Human(
      firstNameInpValue,
      lastNameInpValue,
      eMailInpValue,
      reader.result
    );
    humansArr.push(humanItem);
    createDataOnServer(humanItem);
  };
}

const subBtn = document.querySelector("#form");
const imgInpValue = document.querySelector("#img");
subBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  getDataToCreateHuman();
});
//-------------------------------------------------------------------Http-GET
function renderDataTable(data) {
  const tbody = document.querySelector(".table-data-area");
  tbody.innerHTML = "";
  data.forEach((item) => {
    tbody.innerHTML += getTableRow(item);
  });
}

function getDataFromApi() {
  const httpClient = new XMLHttpRequest();
  httpClient.open("GET", apiBaseUrl);
  httpClient.onloadend = function () {
    const jsontext = httpClient.responseText;
    const data = JSON.parse(jsontext);
    renderDataTable(data);
  };
  httpClient.send();
}
//გავუშვათ აქვე GET ფუნქცია რადგანნ ყოველი რექვესთის დროს ფეიჯი თავიდან იტვირთება
//და შესაბამისად ყოვე ჩატვირთვაზე რო წამოიღოს  data
getDataFromApi();

//---------------------------------------------------------------------Http-DELETE
const allRemoveBtn = document.querySelectorAll("#remove-btn");
function deleteDataOnServer(itemId) {
  const api = `${apiBaseUrl}/${itemId}`;
  const httpClient = new XMLHttpRequest();
  httpClient.open("DELETE", api);
  httpClient.onloadend = function () {
    console.log(JSON.parse(httpClient.responseText));
  };
  httpClient.send();
}

//--------------------------------------------------------------------Http-PUT

let updateItemId;
const modalOpenBtn = document.querySelector("#modalOpen");
function updateUserItem(itemId) {
  //updateItemId ში ვაყოლებ აიდის რომლის update ბათონზეც დაეკლიკება
  updateItemId = itemId;

  //Modal ის გამოძახება
  modalOpenBtn.click();
}
//-----------------
function updateDataOnServer(updateItem) {
  const httpClient = new XMLHttpRequest();
  httpClient.open("PUT", `${apiBaseUrl}/${updateItemId}`);
  httpClient.setRequestHeader("content-type", "application/json");
  httpClient.send(JSON.stringify(updateItem));
}

function getDataToUpdateHuman() {
  const updateFirstName = document.querySelector("#updateFirstName").value;
  const updateLastName = document.querySelector("#updateLastName").value;
  const updateEmail = document.querySelector("#updateEmail").value;
  const updateImage = document.querySelector("#updateImage");
  const reader = new FileReader();
  reader.readAsDataURL(updateImage.files[0]);
  reader.onload = function () {
    updateHumanItem = new Human(
      updateFirstName,
      updateLastName,
      updateEmail,
      reader.result
    );
    updateDataOnServer(updateHumanItem);
  };
}
