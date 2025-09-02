import { createCanvas, loadImage } from "canvas";
export async function createPokemonSilhouette(imageUrl) {
    try {
        console.log(`Creating silhouette for: ${imageUrl}`);
        // Load the original image
        const image = await loadImage(imageUrl);
        console.log(`Image loaded: ${image.width}x${image.height}`);
        // Create canvas with same dimensions
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        // Draw the original image
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let pixelsModified = 0;
        // Convert non-transparent pixels to black
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha > 0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                pixelsModified++;
            }
        }
        console.log(`Modified ${pixelsModified} pixels to create silhouette`);
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        // Return as PNG buffer
        return canvas.toBuffer("image/png");
    }
    catch (error) {
        console.error("💥 Error creating silhouette:", error);
        throw new Error(`Failed to create silhouette: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
// Helper function to get a random Pokemon ID
export function getRandomPokemonId() {
    return Math.floor(Math.random() * 1010) + 1;
}
//# sourceMappingURL=imageProcessor.js.map