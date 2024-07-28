// modal codes from https://www.w3schools.com/howto/howto_css_modals.asp
var modal = document.getElementById("modal");
var btn = document.getElementById("modalButton");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const form = document.getElementById("form");
const updateForm = document.getElementById("updateForm");
const url = "http://localhost:3000/api/photoAlbum";

// Submit button
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = {
    poster: formData.get("poster"),
    name: formData.get("name"),
    year: formData.get("year"),
    genre: formData.get("genre"),
    description: formData.get("description"),
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("Item added successfully!");
    await AddToGallery();
  } catch (error) {
    console.log("Something might have gone wrong.");
  }
});

// Update button
updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(updateForm);

  let updateURL = `${url}/${formData.get("updateID")}`;

  console.log(updateURL);

  const data = {
    id: formData.get("updateID"),
    poster: formData.get("poster2"),
    name: formData.get("name2"),
    year: formData.get("year2"),
    genre: formData.get("genre2"),
    description: formData.get("description2"),
  };

  try {
    await fetch(updateURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    alert("Item updated successfully!");
    await AddToGallery();
  } catch (error) {
    alert("Error updating item. Please try again.");
  }
});

// Reset Button
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", async function (e) {
  try {
    const response = await fetch(`${url}/reset`, {
      method: "GET",
    });
    if (response.ok) {
      alert("Gallery reset successful!");
      await AddToGallery();
    } else {
      console.log("Something might have gone wrong.");
    }
  } catch (error) {
    console.error("Error during reset:", error);
    console.log("Something might have gone wrong.");
  }
});

// Dynamic gallery + create checkboxes for years
const AddToGallery = async () => {
  const temp = await fetch(url);
  const data = await temp.json();

  let table = document.getElementById("table");

  console.log(data);

  table.innerHTML = `<caption>
  <h2>Media</h2>
</caption>
<tr class="noprint">
  <th class="poster"><strong>Poster</strong></th>
  <th class="name"><strong>Name</strong></th>
  <th class="year"><strong>Year</strong></th>
  <th class="genre"><strong>Genre</strong></th>
  <th class="description"><strong>Description</strong></th>
</tr>`;

  let allYears = [];

  data.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <figure>
          <a href="${entry.poster}" target="_blank">
            <img class="poster" src="${entry.poster}" alt="${entry.name}" />
          </a>
          <figcaption><em>Fig.${table.rows.length} ${entry.name}, ID: ${entry.id}</em></figcaption>
        </figure>
      </td>
      <td class="name"><strong>${entry.name}</strong></td>
      <td class="year">${entry.year}</td>
      <td class="genre">${entry.genre}</td>
      <td class="description"></td>
    `;
    table.appendChild(row);

    let yearExists = false;
    row.classList.add(`year-${entry.year}`);
    for (i = 0; i < allYears.length; i++) {
      if (allYears[i] == entry.year) {
        yearExists = true;
      }
    }
    if (!yearExists) {
      allYears.push(entry.year);
    }

    const words = entry.description.split(" ");

    let descriptionHtml = "";
    for (let i = 0; i < words.length; i++) {
      descriptionHtml += words[i] + " ";
      if ((i + 1) % 7 === 0) {
        descriptionHtml += "<br>";
      }
    }

    row.querySelector(
      ".description"
    ).innerHTML = `<pre><em>${descriptionHtml.trim()}</em></pre>`;
  });

  allYears.sort(function (a, b) {
    return a - b;
  });
  const yearContainer = document.getElementById("yearContainer");
  yearContainer.innerHTML = ``;

  for (let i = 0; i < allYears.length; i++) {
    const yearCheckbox = document.createElement("input");
    yearCheckbox.type = "checkbox";
    yearCheckbox.classList.add("year-checkbox");
    yearCheckbox.value = allYears[i];
    yearCheckbox.id = `yearCheckbox${i}`;

    const label = document.createElement("label");
    label.htmlFor = `yearCheckbox${i}`;
    label.textContent = allYears[i];

    yearCheckbox.addEventListener("change", () => {
      uncheckAllYearCheckboxesExcept(yearCheckbox);
      filterRows();
    });

    yearContainer.appendChild(yearCheckbox);
    yearContainer.appendChild(label);

    if (window.innerWidth <= 320 && (i + 1) % 4 === 0 && i !== 0) {
      const lineBreak = document.createElement("br");
      yearContainer.appendChild(lineBreak);
    }
  }

  const showAllCheckbox = document.createElement("input");
  showAllCheckbox.type = "checkbox";
  showAllCheckbox.classList.add("year-checkbox");
  showAllCheckbox.value = "All";
  showAllCheckbox.id = "showAllCheckbox";
  showAllCheckbox.checked = true;

  const showAllLabel = document.createElement("label");
  showAllLabel.htmlFor = "showAllCheckbox";
  showAllLabel.textContent = "Show All";

  showAllCheckbox.addEventListener("change", () => {
    uncheckAllYearCheckboxesExcept(showAllCheckbox);
    filterRows();
  });

  yearContainer.appendChild(showAllCheckbox);
  yearContainer.appendChild(showAllLabel);

  function uncheckAllYearCheckboxesExcept(exceptCheckbox) {
    const yearCheckboxes = document.querySelectorAll(".year-checkbox");
    yearCheckboxes.forEach((checkbox) => {
      if (checkbox !== exceptCheckbox) {
        checkbox.checked = false;
      }
    });
  }

  function uncheckAllYearCheckboxesExcept(exceptCheckbox) {
    const yearCheckboxes = document.querySelectorAll(".year-checkbox");
    let anyCheckboxChecked = false;

    yearCheckboxes.forEach((checkbox) => {
      if (checkbox !== exceptCheckbox) {
        checkbox.checked = false;
        if (exceptCheckbox.checked) {
          anyCheckboxChecked = true;
        }
      } else {
        anyCheckboxChecked = exceptCheckbox.checked;
      }
    });

    // If all checkboxes are deselected, check the "Show All" checkbox
    if (!anyCheckboxChecked) {
      showAllCheckbox.checked = true;
    }
  }
};

// with help from: https://stackoverflow.com/questions/13330202/how-to-create-list-of-checkboxes-dynamically-with-javascript
// Filter the years + search bar
const filterRows = () => {
  const allRows = document.querySelectorAll("#table tr:not(.noprint)");
  const selectedYears = document.querySelectorAll(".year-checkbox:checked");
  const searchField = document.getElementById("searchField");
  const searchValue = searchField.value.toLowerCase().trim();

  const searchArray = searchValue.split(/[\s,]+/).map((s) => s.trim());

  allRows.forEach((row) => {
    const yearClass = row.querySelector(".year").textContent;
    const name = row.querySelector(".name").textContent.toLowerCase().trim();
    const genre = row.querySelector(".genre").textContent.toLowerCase().trim();

    const genresArray = genre.split(",").map((g) => g.trim());

    const rowArray = [...name.split(" "), ...genresArray];

    const shouldShowYear = Array.from(selectedYears).some(
      (checkbox) => checkbox.value === yearClass || checkbox.value === "All"
    );

    const shouldShowSearch =
      searchArray.length === 0 ||
      searchArray.every((item) =>
        rowArray.some((entry) => entry.includes(item))
      );

    const shouldShow = shouldShowYear && shouldShowSearch;

    row.style.display = shouldShow ? "" : "none";
  });
};

const searchField = document.getElementById("searchField");
searchField.addEventListener("input", filterRows);

filterRows();
AddToGallery();
