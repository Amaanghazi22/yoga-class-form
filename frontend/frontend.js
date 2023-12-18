function submitForm() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const batch = document.getElementById('batch').value;

    // Basic validation
    if (!name || !age || !batch) {
      displayMessage('Invalid data. Please fill in all fields.');
      return;
    }
  
    // Age limit validation
    if (age < 18 || age > 65) {
      displayMessage('Age must be between 18 and 65.');
      return;
    }
  
    // Make a POST request to the backend
    fetch('http://127.0.0.1:3001/api/enroll', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name, age, selectedBatch: batch }),
})
      .then(response => response.json())
      .then(data => displayMessage(data.message))
      .catch(error => displayMessage(error));
  }
  
  function displayMessage(message) {
    document.getElementById('message').textContent = message;
  }
  