const formEl = document.getElementById("color-picker");
const schemeContainerEl = document.getElementById("scheme-container");

formEl.addEventListener("submit", getFormData);
schemeContainerEl.addEventListener("click", copyText);

const defaultColor = "F55A5A";
const defaultSchemeType = "monochrome";

function getFormData(e) {
  e.preventDefault();
  const form = new FormData(formEl);
  const color = form.get("color").slice(1);
  const schemeType = form.get("scheme-type").toLowerCase();

  fetchSchema(color, schemeType);
}

function fetchSchema(color, schemeType) {
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${color}&mode=${schemeType}&count=5`
  )
    .then((res) => res.json())
    .then((data) => {
      const schemeColors = data.colors;
      const hexColorArray = schemeColors.map((color) => color.hex.value);
      createHtml(hexColorArray);
    });
}

function createHtml(data) {
  const html = data
    .map((color) => {
      return `
        <div>
            <div data-color="${color}" class="scheme" style="background: ${color};"></div>
            <span data-color="${color}">${color}</span>
        </div>
        `;
    })
    .join("");
  renderHtml(html, schemeContainerEl);
}

function renderHtml(html, container) {
  container.innerHTML = html;
}

fetchSchema(defaultColor, defaultSchemeType);

// Copy text to clipboard
function copyText(e) {
  const color = e.target.getAttribute("data-color");

  navigator.clipboard.writeText(color);
  showTooltip(color);
}

function showTooltip(text) {
  const tooltip = document.getElementById("tooltip");

  tooltip.style.transform = "translateX(0%)";
  tooltip.innerHTML = `Color ${text} Copied!`;
  closeTooltip(tooltip);
}

function closeTooltip() {
  setTimeout(function () {
    tooltip.style.transform = "translateX(-100%)";
  }, 1500);
}
