import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { renameSync, mkdirSync, existsSync } from 'fs';

const script = `
Imagine a world where every farmer, regardless of internet connection or location, has access to world-class agricultural education and real-time AI tools. Welcome to Agri-U. 

We are not just an app; we are an offline-first learning companion revolutionizing farming for the modern age.

Smallholder farmers face unpredictable weather, emerging crop diseases, and a lack of localized knowledge. Agri-U solves this by bringing gamified, bite-sized lessons directly to their pockets. 

Let's dive in. Logging in with our secure, Firebase-backed authentication, the farmer is greeted with a personalized dashboard. Here, they have access to live integrations. With a single tap, the OpenWeather API delivers hyper-local climate data. 

But that is not all. Notice a strange spot on a leaf? Our integrated AI scanner allows farmers to snap a photo and instantly identify crop health issues using advanced machine learning models.

Education is at the heart of Agri-U. Our comprehensive course library is seamlessly synced to the cloud, but available completely offline. Farmers can learn anywhere, anytime. 

Let's take a look at a course on Climate-Smart Agriculture. The content is easy to digest, and ends with an interactive Knowledge Check. Answering correctly awards a mastery badge, turning education into an engaging, rewarding daily habit.

With an integrated admin Content Management System allowing agronomists to push new courses live, and Firebase Cloud Messaging re-engaging users, Agri-U is built to scale. 

We are empowering the next generation of farmers, increasing crop yields, and securing the global food supply. Join us, and let's grow the future together.
`;

(async () => {
    try {
        if (!existsSync("agriu_audio_v3")) mkdirSync("agriu_audio_v3");

        const tts = new MsEdgeTTS();
        await tts.setMetadata("en-US-ChristopherNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
        await tts.toFile("agriu_audio_v3", script); // This creates agriu_audio_v3/audio.mp3
        renameSync("agriu_audio_v3/audio.mp3", "agriu_demo_voiceover_v3.mp3");
        console.log("Audio generated successfully at agriu_demo_voiceover_v3.mp3!");
    } catch (e) {
        console.error(e);
    }
})();
