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
            dateTimeOriginal: feature.properties.dateTimeOriginal
        }
    });
}

// function getThumbnailUrl(fullUrl) {
//     let fileName = fullUrl.replace('https://wikibilhorod.info/wiki/%D0%A4%D0%B0%D0%B9%D0%BB:', '');
//     return `https://wikibilhorod.info/thumb.php?f=${fileName}&width=300`;
// }

export default convertFeaturesToImages;
