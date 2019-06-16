const removeMessage   = element => { element.parentNode.removeChild(element); }
const alertMessageDiv = data => {
  let alertDiv = document.createElement('div');
  alertDiv.classList.add("form-group", "alert", "alert-" + data.result );
  alertDiv.setAttribute("onclick", "removeMessage(this)");
  alertDiv.innerHTML = `
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">×</span>
    </button>
    <span>` + data.message + `</span>`
  return alertDiv;
}

const cleanName = element => element.name.replace("subscribe_form[","").replace("]", "");

const formToJSON = elements => [].reduce.call(elements, (data, element) => {
  if (element.name && element.value) data[cleanName(element)] = element.value;
  console.log(data);
  return data;
}, {});

const submitForm = form => {
  let request = new XMLHttpRequest();
  request.open('POST', form.action + '.json', true);
  request.setRequestHeader("Content-Type", "application/json");
  request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        let data = JSON.parse(request.responseText);
        form.prepend(alertMessageDiv(data));
      }
  };
  let data = {subscribe_form: formToJSON(form.elements)};
  data = JSON.stringify(data);
  request.send(data);
}

const handleFormSubmit = event => {
  event.preventDefault();
  const form = event.target;
  submitForm(form);
  form.reset();
};

const subscribeAjaxInitialize = () => {
  const form = document.getElementsByClassName('register-form')[0];
  form.addEventListener('submit', handleFormSubmit);
}

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  subscribeAjaxInitialize();
} else {
  document.addEventListener("DOMContentLoaded", subscribeAjaxInitialize);
}

