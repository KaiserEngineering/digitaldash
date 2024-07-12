import fs from 'fs';
import path from 'path';

const sourceDirectory = 'static/images/Splash/';
const destinationDirectory = '/boot';

export async function copyImage(selectedImage: string) {
    const sourcePath = path.join(sourceDirectory, selectedImage);
    const destinationPath = path.join(destinationDirectory, "splash.png");

    try {
        fs.copyFileSync(sourcePath, destinationPath);
        return { success: true };
    } catch (error) {
        console.error('Error copying file:', error);
        return { success: false, error: error.message };
    }
}