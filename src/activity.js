const path = require('path');
const fs = require('fs');

// Create Activity (using Electron IPC if available)
document.getElementById('btnCreate').addEventListener('click', () => {
  const name = document.getElementById('fileName').value.trim();
  const content = document.getElementById('fileContents').value.trim();
  
  if (name && content) {
      try {
        const pathName = path.join(__dirname, 'TXT');
        if (!fs.existsSync(pathName)) {
            fs.mkdirSync(pathName, { recursive: true });
        }

        let fileName = name;
        if (!fileName.endsWith('.txt')) {
            fileName += '.txt';
        }
        
        const filePath = path.join(pathName, fileName);
        fs.writeFileSync(filePath, content);

        // Retrieve the current array of file names from local storage
        let fileNames = JSON.parse(localStorage.getItem('fileNames')) || [];
        // Add the new file name to the array
        fileNames.push(fileName);
        // Store the updated array back in local storage
        localStorage.setItem('fileNames', JSON.stringify(fileNames));

        alert('File created successfully!');
      } catch (error) {
          console.error('Error creating file:', error);
          alert('Error creating file.');
      }
  } else {
      alert('Please provide both name and content.');
  }
});


// Read All Activities
document.getElementById('btnRead').addEventListener('click', () => {
    const displayArea = document.getElementById('displayArea');
    displayArea.innerHTML = ''; 

    
    const fileNames = JSON.parse(localStorage.getItem('fileNames')) || [];

    if (fileNames.length > 0) {
        fileNames.forEach(fileName => {
            const filePath = path.join(__dirname, 'TXT', fileName);

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                displayArea.innerHTML += `<p><strong>${fileName}:</strong> ${content}</p>`;
            } catch (error) {
                console.error('Error reading file:', error);
                displayArea.innerHTML += `<p>Error reading file: ${fileName}</p>`;
            }
        });
    } else {
        displayArea.innerHTML = '<p>No files found in the TXT directory.</p>';
    }
});

// Update Activity
document.getElementById('btnUpdate').addEventListener('click', () => {
    const name = document.getElementById('fileName').value.trim();
    const contentElement = document.getElementById('fileContents');
    const content = contentElement.value.trim();

    if (name) {
        let fileName = name;
        if (!fileName.endsWith('.txt')) {
            fileName += '.txt';
        }

        const filePath = path.join(__dirname, 'TXT', fileName);

        if (fs.existsSync(filePath)) {
            if (content) {
                try {
                    fs.writeFileSync(filePath, content);
                    alert("Activity updated successfully!");
                } catch (error) {
                    console.error("Error updating activity:", error);
                    alert("Error updating activity.");
                }
            } else {
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    contentElement.value = fileContent;
                    alert("Edit the content and click 'Update' again to save.");
                } catch (error) {
                    console.error("Error reading activity:", error);
                    alert("Error reading activity.");
                }
            }
        } else {
            alert("Activity not found.");
        }
    } else {
        alert("Please enter the name of the activity to update.");
    }
});

// Delete Activity
document.getElementById('btnDelete').addEventListener('click', () => {
    const name = document.getElementById('fileName').value.trim();

    if (name) {
        let fileName = name;
        if (!fileName.endsWith('.txt')) {
            fileName += '.txt';
        }

        const filePath = path.join(__dirname, 'TXT', fileName);

        if (fs.existsSync(filePath)) {
            try {
                // Delete the file
                fs.unlinkSync(filePath);

                // Update the array of file names in local storage
                let fileNames = JSON.parse(localStorage.getItem('fileNames')) || [];
                fileNames = fileNames.filter(f => f !== fileName);
                localStorage.setItem('fileNames', JSON.stringify(fileNames));

                alert("Activity deleted successfully!");
            } catch (error) {
                console.error("Error deleting activity:", error);
                alert("Error deleting activity.");
            }
        } else {
            alert("Activity not found.");
        }
    } else {
        alert("Please enter the name of the activity to delete.");
    }
});


