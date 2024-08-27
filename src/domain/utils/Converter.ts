import fs from 'fs';

export class Converter {

    public convertToPNG(imageBase64: string) {
        let base64Image = imageBase64.split(';base64,').pop();

        if (base64Image == undefined) return
    
        fs.writeFileSync('image.png', base64Image, {encoding: 'base64'})
    }
}