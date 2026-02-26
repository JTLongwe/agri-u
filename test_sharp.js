import sharp from 'sharp';

async function testPage() {
    try {
        await sharp('C:/Users/joann/.gemini/antigravity/brain/1fd39707-b405-4f66-92a2-7bef23f05ca1/agriu_mo4_api_demo_v2_1771996963516.webp', { page: 500 })
            .toFile('frame_500.jpg');
        console.log('Saved frame 500');
    } catch (e) { console.error(e); }
}
testPage();
