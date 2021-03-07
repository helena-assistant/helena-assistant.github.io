// The Api module is designed to handle all interactions with the server

var Api = (function () {
  var requestPayload;
  var responsePayload;
  var messageEndpoint =
    "https://ip2g8nqfl8.execute-api.sa-east-1.amazonaws.com/dev/dialog";

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function () {
      return requestPayload;
    },
    setRequestPayload: function (newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function () {
      return responsePayload;
    },
    setResponsePayload: function (newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr).result;
    },
    setErrorPayload: function () {},
  };

  // Send a message request to the server
  function sendRequest(message) {
    // Built http request
    var http = new XMLHttpRequest();
    http.open("POST", messageEndpoint, true);
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function () {
      console.log(http.response);
      if (
        http.readyState === XMLHttpRequest.DONE &&
        http.status === 200 &&
        http.responseText
      ) {
        Api.setResponsePayload(http.responseText);
      } else if (
        http.readyState === XMLHttpRequest.DONE &&
        http.status !== 200
      ) {
        Api.setErrorPayload({
          output: {
            generic: [
              {
                response_type: "text",
                text:
                  "I'm having trouble connecting to the server, please refresh the page",
              },
            ],
          },
        });
      }
    };

    var params = JSON.stringify({ message });
    http.send(params);
  }
})();
