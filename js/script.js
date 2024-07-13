const checkbox = document.getElementById("checkbox");
const bulb = document.getElementById("bulb");

const setLedStatus = async function (status) {
  console.log(status);
};

checkbox.addEventListener("change", function () {
  if (this.checked) {
    console.log("Switch is ON");
    bulb.src = `./images/lightbulb.svg`;
    setLedStatus(true);
  } else {
    console.log("Switch is OFF");
    bulb.src = `./images/lightbulb-off.svg`;
    setLedStatus(false);
  }
});
