function convertFeaturesToImages(features) {
    return features.map((feature) => {
        return {
            photoUrl: feature.properties.photoUrl,
            // thumbUrl: getThumbnailUrl(feature.properties.fullUrl),
            thumbUrl: feature.properties.thumbUrl,
            title: feature.properties.title,
            url: feature.properties.url,
            fullUrl: feature.properties.fullUrl,
            description: feature.properties.description,
            author: feature.properties.author,
            dateTimeOriginal: feature.properties.dateTimeOriginal,
            years: feature.properties.years,
            width: feature.properties.width,
            height: feature.properties.height,
            colorized: feature.properties.colorizedPhotoUrl == null ? null : {
                photoUrl: feature.properties.colorizedPhotoUrl,
                thumbUrl: feature.properties.colorizedThumbUrl,
                // thumbUrl: getThumbnailUrl(feature.properties.fullUrl),
            },
            replicaPhotoUrl: feature.properties.replicaPhotoUrl
        }
    });
}

// function getThumbnailUrl(fullUrl) {
//     let fileName = fullUrl.replace('https://wikibilhorod.info/wiki/Файл:', '');
//     // fileName = fileName.replace('.jpg', ' (колір).jpg');
//     return `https://wikibilhorod.info/thumb.php?f=${fileName}&width=300`;
// }

export default convertFeaturesToImages;
