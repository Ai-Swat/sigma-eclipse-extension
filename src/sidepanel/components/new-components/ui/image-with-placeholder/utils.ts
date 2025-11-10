// fallback images for images
import fallbackImage from 'src/images/fallback_images/Pic-Light.webp'
import fallbackImageDark from 'src/images/fallback_images/Pic-Dark.webp'

// fallback images for videos
import fallbackVideoImage from 'src/images/fallback_images/Vid-Light.webp'
import fallbackVideoImageDark from 'src/images/fallback_images/Vid-Dark.webp'

export type ResourceType = 'image' | 'video'

export function fallbackImageUrl(resourceType: ResourceType, isDark: boolean) {
  switch (resourceType) {
    case 'video':
      return isDark ? fallbackVideoImageDark : fallbackVideoImage
    case 'image':
    default:
      return isDark ? fallbackImageDark : fallbackImage
  }
}

// function testImage(url: string) {
//   // Define the promise
//   const imgPromise = new Promise(function imgPromise(resolve, reject) {
//     // Create the image
//     const imgElement = new Image()
//
//     // When image is loaded, resolve the promise
//     imgElement.addEventListener('load', function imgOnLoad() {
//       resolve(this)
//     })
//
//     // When there's an error during load, reject the promise
//     imgElement.addEventListener('error', function imgOnError() {
//       reject()
//     })
//
//     // Assign URL
//     imgElement.src = url
//   })
//
//   return imgPromise
// }
//
// export function checkImageUrl(
//   url: string | undefined,
//   resourceType: ResourceType = 'image'
// ): Promise<string> {
//   if (!url) {
//     return new Promise((resolve) => {
//       const result = fallbackImageUrl(resourceType)
//
//       resolve(result)
//     })
//   }
//
//   return testImage(url)
//     .then(
//       function fulfilled() {
//         return url
//       },
//
//       function rejected() {
//         return fallbackImageUrl(resourceType)
//       }
//     )
//     .catch(function catched() {
//       return fallbackImageUrl(resourceType)
//     })
// }
