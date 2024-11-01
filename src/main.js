const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'activity.txt'); // Define the file path at the top

ipcMain.handle('save-activity', async (event, name, content) => {
    const entry = `${name}: ${content}\n`;
    try {
        console.log("Saving entry to activity.txt:", entry);
        await fs.promises.appendFile(filePath, entry, 'utf8');
        console.log("Entry saved successfully to activity.txt.");
        return 'Activity saved successfully!';
    } catch (error) {
        console.error('Error saving activity:', error);
        return 'Error saving activity';
    }
});
ipcMain.handle('read-all-activities', async () => {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return data; // Return the content to the renderer
    } catch (error) {
        console.error('Error reading activities:', error);
        throw new Error("Could not read activities."); // This will be caught in the renderer
    }
});


// IPC handler to delete specific activity
ipcMain.handle('delete-activity', async (event, name) => {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8'); // Use filePath defined globally
        const lines = data.split('\n');
        const filteredLines = lines.filter(line => !line.startsWith(`${name}:`) && line.trim() !== '');
        await fs.promises.writeFile(filePath, filteredLines.join('\n'), 'utf8');
        return `Activity "${name}" deleted successfully!`;
    } catch (error) {
        console.error('Error deleting activity:', error);
        return 'Error deleting activity';
    }
});

