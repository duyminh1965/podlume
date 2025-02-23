import React, { useCallback } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { CarouselProps } from './types'
import { useRouter } from 'next/navigation'
import LoaderSpinner from './LoaderSpinner'
import Image from 'next/image'

const EmblaCarousel = ({ fansLikeDetail }: CarouselProps) => {  
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay || !("stopOnInteraction" in autoplay.options)) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? (autoplay.reset as () => void)
        : (autoplay.stop as () => void)

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slides = fansLikeDetail && fansLikeDetail?.filter((item: any) => item.totalPodlumes > 0);  
  if(!slides) return <LoaderSpinner />;
  return (
    <section className="flex w-full flex-col gap-4 overflow-hidden" ref={emblaRef}>
      < div className='flex'>
        {slides.slice(0, 5).map((item) => (
          <figure
            key={item._id}
            className="carousel_box"
            onClick={() => router.push(`/podlume/${item.podlume[0]?.podlumeId}`)}
          >
            <Image 
              src={item.imageUrl}
              alt="lume"
              fill 
              className="absolute size-full rounded-xl border-none"
            />
            <div className='glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4'>
              <h2 className='text-14 font-semibold text-white-1'>{item.podlume[0]?.podlumeTitle}</h2>
              <p className='text-12 font-normal text-white-2'>{item.name}</p>
            </div>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              selected={index===selectedIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
