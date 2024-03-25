import './style.css';
import { fetchData } from './fetch.js';


// Haetaan kaikki käyttäjät ja luodaan niistä taulukko
// 1. Hae ensin nappula ja kutsu funktiota (keksi nimi)

const allButton = document.querySelector('.get_users');
allButton.addEventListener('click', getUsers);

async function getUsers() {
  console.log('Haetaa kaikki käyttäjät');
  const url = 'https://helmar.northeurope.cloudapp.azure.com/api/api/users';
  let token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
  };

  fetchData(url, options).then((data) => {
    createTable(data);
  });

}

// Updates User info
function updateUser(event) {
  event.preventDefault(); 
  
  let token = localStorage.getItem('token');
  const userData = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
    email: document.getElementById('email').value
  };

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  };

  const url = 'https://helmar.northeurope.cloudapp.azure.com/api/api/users';
  fetchData(url, options).then((data) => {
    console.log('User updated:', data);
    alert('User updated successfully!');
  }).catch((error) => {
    console.error('Error updating user:', error);
  });
}
const updateUserForm = document.getElementById('updateUserForm');
updateUserForm.addEventListener('submit', updateUser);

function createTable(data) {
  console.log(data);

  // etitään tbody elementti
  const tbody = document.querySelector('.tbody');
  tbody.innerHTML = '';

  // loopissa luodaan jokaiselle tietoriville oikeat elementit
  // elementtien sisään pistetään oikeat tiedot

  data.forEach((rivi) => {
    console.log(rivi.user_id, rivi.username, rivi.user_level);

    // Luodaan jokaiselle riville ensin TR elementti alkuun
    const tr = document.createElement('tr');

    // Luodaan soluja mihihin tiedot
    const td1 = document.createElement('td');
    td1.innerText = rivi.username;

    // Luodaan soluja mihihin tiedot
    const td2 = document.createElement('td');
    td2.innerText = rivi.user_level;


    const td3 = document.createElement('td');
    const button1 = document.createElement('button');
    button1.className = 'check';
    button1.setAttribute('data-id', rivi.user_id);
    button1.innerText = 'Info';
    td3.appendChild(button1);

    button1.addEventListener('click', getUser);

    // td4
    const td4 = document.createElement('td');
    const button2 = document.createElement('button');
    button2.className = 'del';
    button2.setAttribute('data-id', rivi.user_id);
    button2.innerText = 'Delete';
    td4.appendChild(button2);

    // 2. Lisää kuuntelija kun taulukko on tehty
    button2.addEventListener('click', deleteUser);

    // td5
    var td5 = document.createElement('td');
    td5.innerText = rivi.user_id;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tbody.appendChild(tr);
  });
}

function getUser() {
  console.log('Haet tietoa');
}
// Add entry
document.addEventListener('DOMContentLoaded', () => {
  const addEntryForm = document.getElementById('addEntryForm');

  if (addEntryForm) {
    addEntryForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      const url = 'https://helmar.northeurope.cloudapp.azure.com/api/api/entries';
      let token = localStorage.getItem('token'); // Assuming you store your token in local storage

      // Validate the token exists before trying to send the data
      if (!token) {
        alert('No token found. Please log in.');
        return; // Exit the function if no token
      }

      const entryData = {
        entry_date: document.getElementById('entry_date').value,
        mood: document.getElementById('mood').value,
        weight: parseFloat(document.getElementById('weight').value),
        sleep_hours: parseFloat(document.getElementById('sleep_hours').value),
        notes: document.getElementById('notes').value
      };

      console.log('Sending entry data:', entryData); // Debugging line

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // The token must be valid
        },
        body: JSON.stringify(entryData)
      };

      fetch(url, options)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Entry added:', data); // Response data from the server
          alert('Entry added successfully!');
          // If you have a function to update the entries list, call it here
        })
        .catch((error) => {
          console.error('Error adding entry:', error);
          alert('Failed to add entry. Please check the console for more information.');
        });
    });
  } else {
    console.error('Form not found on the page.');
  }
});

// Delete an entry
function deleteEntry(entryId) {
  if (confirm('Are you sure you want to delete this entry?')) {
    const url = `https://helmar.northeurope.cloudapp.azure.com/api/api/entries/${entryId}`;
    let token = localStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    };

    fetchData(url, options)
      .then(() => {
        // Remove the entry from the table or refresh the table
        console.log(`Entry ${entryId} deleted`);
        getEntries(); // Refresh entries
      })
      .catch(error => {
        console.error('Error deleting entry:', error);
      });
  }
}

//Add medications
// This event listener waits for the DOM to be fully loaded before executing the script.
document.addEventListener('DOMContentLoaded', () => {
  // Grabbing the form element from the DOM using its ID 'medicationForm'.
  const medicationForm = document.getElementById('medicationForm');

  // Checking if the form exists in the DOM to avoid null reference errors.
  if (medicationForm) {
    // Adding an event listener for the 'submit' event on the form.
    medicationForm.addEventListener('submit', function(event) {
      event.preventDefault(); // This prevents the form from submitting the traditional way, which would cause a page reload.

      // The URL to which the form data will be sent via fetch.
      const url = 'https://helmar.northeurope.cloudapp.azure.com/api/api/medications';
      // Retrieving the authentication token from localStorage.
      let token = localStorage.getItem('token'); 

      // If the token is not available, an alert is shown to the user and the function exits.
      if (!token) {
        alert('No token found. Please log in.');
        return; // Exiting the function here prevents the code below from executing.
      }

      // Collecting the form data and organizing it into an object.
      const medicationData = {
        name: document.getElementById('med_name').value,
        dosage: document.getElementById('dosage').value,
        frequency: document.getElementById('frequency').value,
        start_date: document.getElementById('start_date').value,
        end_date: document.getElementById('end_date').value
        // The user_id would be added here as well, retrieved from somewhere in your application context or localStorage.
      };

      // A console log for debugging purposes, to see the data that will be sent.
      console.log('Sending medication data:', medicationData);

      // The options object for the fetch call includes the HTTP method, headers, and the stringified form data.
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // The token is used here for authorization.
        },
        body: JSON.stringify(medicationData) // The medicationData object is converted to a JSON string to be sent in the request body.
      };

      // Making the fetch call with the specified URL and options.
      fetch(url, options)
        .then(response => {
          if (!response.ok) {
            // If the response status code indicates an error, an Error is thrown with the status code.
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // If the response is okay, it's parsed to JSON.
          return response.json();
        })
        .then(data => {
          // If the request was successful, log the response data.
          console.log('Medication added:', data);
          // And alert the user that the medication has been successfully added.
          alert('Medication added successfully!');
          // Additional logic to update the UI can be placed here.
        })
        .catch((error) => {
          // Any errors during fetch (including those thrown) are caught here.
          console.error('Error adding medication:', error);
          // And an alert is shown to the user.
          alert('Failed to add medication. Please check the console for more information.');
        });
    });
  } else {
    // If the medication form is not found on the page, a console error is logged.
    console.error('Medication form not found on the page.');
  }
});


// Define a function to fetch and render the medication data
function fetchAndRenderMedicationData() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage.');
    return;
  }

  fetch('https://helmar.northeurope.cloudapp.azure.com/api/api/medications', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    createMedTable(data); // Call createTable with the data
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', (event) => {
  // Fetch and render medication data when the page is loaded
  fetchAndRenderMedicationData();

});

function createMedTable(data) {
  const tbody = document.querySelector('.medications-tbody');
  tbody.innerHTML = ''; // Clear any existing content

  data.forEach((item) => {
    // Create a row template
    const row = document.createElement('tr');

    // Add table data for medication details
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.dosage}</td>
      <td>${item.frequency}</td>
      <td>${new Date(item.start_date).toLocaleDateString()}</td>
      <td>${new Date(item.end_date).toLocaleDateString()}</td>
      <td>
        <button class="edit-btn" data-id="${item.medication_id}">Edit</button>
        <button class="delete-btn" data-id="${item.medication_id}">Delete</button>
      </td>
    `;

    
    tbody.appendChild(row);
  });

  // After all rows have been added to the table, add event listeners to the buttons
  tbody.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const id = event.target.getAttribute('data-id');
      editMedication(id); // Ensure this function is defined
    });
  });

  tbody.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const id = event.target.getAttribute('data-id');
      deleteMedication(id); // Ensure this function is defined
    });
  });
}
//edit medications
function editMedication(medicationId) {
  
  const newName = prompt('Enter new medication name:');
  const newDosage = prompt('Enter new dosage:');
  const newFrequency = prompt('Enter new frequency:');
  // Assuming you're not editing dates in this simple prompt setup.
  
  if (newName && newDosage && newFrequency) {
    // Construct an object with the new medication details
    const updatedMedication = {
      medication_id: medicationId, // Make sure to send back the ID for identification on the backend
      name: newName,
      dosage: newDosage,
      frequency: newFrequency,
      // Include any other details you might have prompted for
    };

    // Fetch call to update the medication on the server
    const token = localStorage.getItem('token'); // Reuse the token from localStorage
    fetch(`https://helmar.northeurope.cloudapp.azure.com/api/api/medications/${medicationId}`, {
      method: 'PUT', // Assuming the server expects a PUT request for updates
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMedication),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update medication.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Medication updated:', data);
      fetchAndRenderMedicationData(); // Refresh the medication list
    })
    .catch(error => {
      console.error('Error updating medication:', error);
    });
  } else {
    // If the user cancels one of the prompts, you could notify them or just quietly exit
    console.log('Medication update cancelled.');
  }
}


function deleteMedication(medicationId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found. Please log in.');
    return;
  }

  if (confirm('Are you sure you want to delete this medication?')) {
    fetch(`https://helmar.northeurope.cloudapp.azure.com/api/api/medications/${medicationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }
      fetchAndRenderMedicationData(); // Refresh the data
    })
    .catch(error => {
      console.error('Error deleting medication:', error);
    });
  }
}


function getEntries() {
  const url = 'https://helmar.northeurope.cloudapp.azure.com/api/api/entries';
  let token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  };

  fetchData(url, options)
    .then(data => {
      console.log('Entries:', data);
      createEntriesTable(data); // Assuming 'data' is an array of entries
    })
    .catch(error => {
      console.error('Error fetching entries:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  getEntries();
});


function createEntriesTable(entries) {
  // Select the tbody element specifically for entries
  const tbody = document.querySelector('.entries-tbody');
  tbody.innerHTML = ''; // Clear existing table data

  // Iterate over each entry and create table rows
  entries.forEach((entry) => {
    const tr = document.createElement('tr'); // Create a new row

    // Create and fill the table cells with entry data
    const tdDate = document.createElement('td');
    tdDate.innerText = entry.entry_date;

    const tdMood = document.createElement('td');
    tdMood.innerText = entry.mood;

    const tdWeight = document.createElement('td');
    tdWeight.innerText = entry.weight;

    const tdSleepHours = document.createElement('td');
    tdSleepHours.innerText = entry.sleep_hours;

    const tdNotes = document.createElement('td');
    tdNotes.innerText = entry.notes;
    const tdEdit = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editEntry(entry.entry_id);
    tdEdit.appendChild(editButton);

    const tdDelete = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteEntry(entry.entry_id);
    tdDelete.appendChild(deleteButton);

    // Append cells to the row
    tr.appendChild(tdDate);
    tr.appendChild(tdMood);
    tr.appendChild(tdWeight);
    tr.appendChild(tdSleepHours);
    tr.appendChild(tdNotes);
    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);

    // Append the row to the tbody
    tbody.appendChild(tr);
  });
}

function editEntry(entryId) {
  const newEntryDate = prompt('Enter the new entry date (YYYY-MM-DD):', '');
  const newMood = prompt('Enter the new mood:', '');
  const newWeight = prompt('Enter the new weight:', '');
  const newSleepHours = prompt('Enter the new sleep hours:', '');
  const newNotes = prompt('Enter the new notes:', '');

  // Construct the entry object
  const updatedEntry = {
    entry_date: newEntryDate,
    mood: newMood,
    weight: parseFloat(newWeight),
    sleep_hours: parseFloat(newSleepHours),
    notes: newNotes
  };

  // Prepare the PUT request
  const url = `https://helmar.northeurope.cloudapp.azure.com/api/api/entries/${entryId}`;
  let token = localStorage.getItem('token');

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedEntry)
  };

  // Send the PUT request
  fetchData(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error updating the entry');
      }
      return response.json();
    })
    .then(updatedEntry => {
      console.log('Entry updated:', updatedEntry);
      alert('Entry updated successfully!');
      getEntries(); // Refresh the entries display
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      alert('Failed to update entry. Check console for more information.');
    });
    
}


function logoutAndRedirect() {
  // Remove the token from localStorage
  localStorage.removeItem('token');
  
  // Redirect to the starting page or login page
  window.location.href = '/index';
}

// Check if the logout link exists before adding the event listener
const logoutLink = document.querySelector('.logout a');
if (logoutLink) {
  logoutLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the link from navigating
    logoutAndRedirect();
  });
} else {
  console.error("Logout link not found. Make sure the class is correct and the DOM is fully loaded.");
}

function deleteUser(evt) {
  console.log('Deletoit tietoa');
  console.log(evt);

  // Tapa 1, haetaan arvo tutkimalla eventtiä
  const id = evt.target.attributes['data-id'].value;
  console.log(id);

  // Tapa 2 haetaan "viereinen elementti"
  const id2 = evt.target.parentElement.nextElementSibling.textContent;
  console.log('Toinen tapa: ', id2);



  const url = `https://helmar.northeurope.cloudapp.azure.com/api/api/users/${id}`;
  let token = localStorage.getItem('token');
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
  };

  const answer = confirm(`Oletko varma että haluat poistaa käyttäjän ID: ${id} `);
  if (answer) {
    fetchData(url, options).then((data) => {
      console.log(data);
      getUsers();
    });
  }
}

async function showUserName() {
  console.log('Hei täällä ollaan! Nyt pitäisi hakea käyttäjän tiedot');

  const url = 'https://helmar.northeurope.cloudapp.azure.com/api/api/auth/me';
  let token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
  };
  fetchData(url, options).then((data) => {
    console.log(data);
    document.getElementById('name').innerHTML = data.user.username;
    // muita hakuja ja tietoja sivulle, kuten email ym. mitä halutaan näyttää
  });
}

showUserName();

async function getAllUsers() {
  console.log('toimii!');

  try {
    const response = await fetch('http://helmar.northeurope.cloudapp.azure.com/api/api/users');
    console.log(response);
    const data = await response.json();
    console.log(data);

    data.forEach((element) => {
      console.log(element.username);
    });

    // tänne tiedot
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = '';

    data.forEach((element) => {
      console.log(element.username);

      // Create table row element
      var tr = document.createElement('tr');

      // td1 Username
      var td1 = document.createElement('td');
      td1.innerText = element.username;

      // td2
      var td2 = document.createElement('td');
      td2.innerText = element.user_level;

      // td3
      var td3 = document.createElement('td');
      var button1 = document.createElement('button');
      button1.className = 'check';
      button1.setAttribute('data-id', '1');
      button1.innerText = 'Info';
      td3.appendChild(button1);

      // td4
      var td4 = document.createElement('td');
      var button2 = document.createElement('button');
      button2.className = 'del';
      button2.setAttribute('data-id', '1');
      button2.innerText = 'Delete';
      td4.appendChild(button2);

      // td5
      var td5 = document.createElement('td');
      td5.innerText = element.user_id;

      // Append table data elements to the table row element
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);

      // Append the table row element to the table (assuming you have a table with the id 'myTable')
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
}
