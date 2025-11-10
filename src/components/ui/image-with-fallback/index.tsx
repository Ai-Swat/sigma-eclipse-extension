// vendor
import { useCallback, useState } from 'react'

// images
import firstImg from 'src/images/fallback_images/red-map-pointer.jpg'
import secondImg from 'src/images/fallback_images/big-pointer-on-small-earth-map-in-space.jpg'
import thirdImg from 'src/images/fallback_images/space.jpg'

// styles
import css from './styles.module.css'

interface IProps {
  imageUrl: string
  alt: string
  className?: string
}

// constants
const PLACEHOLDER_IMAGES = [firstImg, secondImg, thirdImg]

// utils
function generateRandomNumber() {
  const randomNumber = Math.random()

  const scaledNumber = Math.floor(randomNumber * 3)

  return scaledNumber
}

function ImageWithFallback({ imageUrl, alt, className }: IProps) {
  const randomNum = generateRandomNumber()
  const placeholderImg = PLACEHOLDER_IMAGES[randomNum]

  const [imgUrl, setImageUrl] = useState<string | undefined>(
    imageUrl ? imageUrl : placeholderImg
  )

  const handleImageLoadingError = useCallback(() => {
    setImageUrl(placeholderImg)
  }, [setImageUrl])

  return (
    <div className={className}>
      <img
        src={imgUrl}
        alt={alt}
        className={css.image}
        onError={handleImageLoadingError}
        draggable={false}
      />
    </div>
  )
}

export default ImageWithFallback
