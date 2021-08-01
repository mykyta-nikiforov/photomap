function convertFeaturesToImages(features) {
    return features.map((feature) => {
        return {
            photoUrl: feature.properties.photoUrl,
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

export default convertFeaturesToImages;
