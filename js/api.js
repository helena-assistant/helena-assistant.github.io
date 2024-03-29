// The Api module is designed to handle all interactions with the server

var Api = (function () {
  var route = "https://sn009i5l2l.execute-api.sa-east-1.amazonaws.com";
  var requestPayload;
  var responsePayload;

  var sessionId = null;

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,
    getSessionId: getSessionId,

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

  function getSessionId(callback) {
    var http = new XMLHttpRequest();
    http.open("GET", `${route}/dev/session`, true);
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function () {
      if (http.readyState === XMLHttpRequest.DONE) {
        let res = JSON.parse(http.response);
        sessionId = res.sessionId;
        callback();
      }
    };
    http.send();
  }

  // Send a message request to the server
  function sendRequest(message) {
    // Build request payload
    var payloadToWatson = {
      session_id: sessionId,
    };

    payloadToWatson.input = {
      message_type: "text",
      text: message,
    };

    // Built http request
    var http = new XMLHttpRequest();
    http.open("POST", `${route}/dev/dialog`, true);
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function () {
      if (
        http.readyState === XMLHttpRequest.DONE &&
        http.status === 200 &&
        http.responseText
      ) {
        Api.setResponsePayload(http.responseText);
      } else if (
        http.readyState === XMLHttpRequest.DONE &&
        http.status === 404
      ) {
        getSessionId(() => sendRequest(message));
      } else if (
        http.readyState === XMLHttpRequest.DONE &&
        http.status !== 200
      ) {
        Api.setErrorPayload({
          output: {
            generic: [
              {
                response_type: "text",
                text: "Eu estou tendo problemas em me conectar com o servidor.\n\nPor favor, recarregue a página :(",
              },
            ],
          },
        });
      }
    };

    var watsonParams = JSON.stringify(payloadToWatson);
    var params = JSON.stringify({ message, sessionId });

    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(watsonParams);
    }

    http.send(params);
  }
})();
