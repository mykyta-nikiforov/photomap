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
            dateTimeOriginal: feature.properties.dateTimeOriginal,
            years: feature.properties.years,
            width: feature.properties.width,
            height: feature.properties.height,
            colorized: feature.properties.colorizedPhotoUrl == null ? null : {
                photoUrl: feature.properties.colorizedPhotoUrl,
                thumbUrl: feature.properties.colorizedThumbUrl,
            },
            replicaPhotoUrl: feature.properties.replicaPhotoUrl
        }
    });
}

export default convertFeaturesToImages;
