const route = "https://sn009i5l2l.execute-api.sa-east-1.amazonaws.com";

const rate1 = document.getElementById("rate-1");
const rate2 = document.getElementById("rate-2");
const rate3 = document.getElementById("rate-3");
const rate4 = document.getElementById("rate-4");
const rate5 = document.getElementById("rate-5");

const rates = [rate1, rate2, rate3, rate4, rate5];

const sendRating = () => {
  const selectedRate = rates.filter((rate) => rate.checked)[0];
  const params = JSON.stringify({ rate: selectedRate.value });

  const http = new XMLHttpRequest();
  http.open("POST", `${route}/dev/rate`, true);
  http.setRequestHeader("Content-type", "application/json");
  http.onreadystatechange = function () {
    if (http.readyState === XMLHttpRequest.DONE) {
      let res = JSON.parse(http.response);
      console.log(res);
    }
  };

  http.send(params);
};
