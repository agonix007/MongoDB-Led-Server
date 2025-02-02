const checkbox = document.getElementById("checkbox");
const bulb = document.getElementById("bulb");

const getLedStatus = async function () {
  try {
    const response = await fetch("/api/get_led_status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const [{ status }] = await response.json();
      console.log(status);
      updateToggleSwitch(status);
    } else {
      console.error("Failed to set LED status");
    }
  } catch (error) {
    console.error("Failed to Fetch Data: " + error);
  }
};

function updateToggleSwitch(status) {
  const checkbox = document.getElementById("checkbox");
  checkbox.checked = status;
}

getLedStatus();

const setLedStatus = async function (status) {
  // console.log(status);
  try {
    const response = await fetch("/api/set_led_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
    } else {
      console.error("Failed to set LED status");
    }
  } catch (error) {
    console.error("Failed to Fetch Data: " + error);
  }
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
