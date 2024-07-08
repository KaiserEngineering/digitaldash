import fs from 'fs';
import { copyImage } from '$lib/Splash';
import { UpdateConfig } from "$lib/server/Config";
import type { PageServerLoad, Actions } from './$types';

const directoryPath = 'static/images/Splash';

export const load: PageServerLoad = async () => {
    try {
        const files = fs.readdirSync(directoryPath);
        const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
        return { imageFiles };
    } catch (error) {
        console.error('Error reading directory:', error);
        return { imageFiles: [] };
    }
};

export const actions: Actions = {
  setSplash: async (event) => {
    const attempt = await event.request.formData();
    const new_splash = attempt.get('selectedImage');
    const result = await copyImage(new_splash);
	
	const config = event.locals.configuration;
    config.splash = new_splash;
    UpdateConfig(JSON.stringify(config, null, 2));
    return {
      msg: "Config updated",
      theme: "alert-success",
      config: config,
    };
  }
};