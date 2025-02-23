"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodlumeCard from '@/components/PodlumeCard'
import PodlumeDetailPlayer from '@/components/PodlumeDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'

//{ params: Promise<{ podlumeId: string }
//const PodlumeDetails = ({ params }: { params: Promise<{ podlumeId: Id<'podlume'> }>}) => {
  const PodlumeDetails = () => {
  const params = useParams();
  const podlumeId = params.podlumeId as Id<"podlume">; // Ensure it's treated as a string  
  const { user } = useUser();
  const podlume = useQuery(api.podlume.getPodlumeById, { podlumeId })

  const similarPodlume = useQuery(api.podlume.getPodlumeByVoiceType, { podlumeId });

  const isOwner = user?.id === podlume?.authorId;

  if(!similarPodlume || !podlume) return <LoaderSpinner />

  return (
    <section className="flex w-full flex-col">
      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>
          Currenty Playing
        </h1>
        <figure className='flex gap-3'>
          <Image 
            src="/icons/headphone.svg"
            width={24}
            height={42}
            alt="headphone"
          />
          <h2 className='text-16 font-bold text-white-1'>{podlume?.views}</h2>
        </figure>
      </header>
      <PodlumeDetailPlayer 
        isOwner = {isOwner}
        podlumeId = {podlume._id}
        {...podlume}
      />

      <p className='text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center'>{podlume?.podlumeDescription}</p>

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
          <p className='text-16 font-medium text-white-2'>{podlume?.voicePrompt}</p>
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Thumbnail Prompt</h1>
          <p className='text-16 font-medium text-white-2'>{podlume?.imagePrompt}</p>
        </div>
      </div>
      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar Podlume</h1>

        {similarPodlume && similarPodlume.length > 0 ? (
          <div className='podcast_grid'>        
            {similarPodlume?.map(({ _id, podlumeTitle, podlumeDescription, imageUrl}) => (
              <PodlumeCard
                key={_id}
                imgUrl={imageUrl}
                title={podlumeTitle}
                description={podlumeDescription}
                podlumeId={_id}
              />
            ))}
          </div>
        ) : (
          <>
            <EmptyState 
              title="No similar podlume found"
              buttonLink="/discover"
              buttonText="Discover more podlume"
            />
          </>
        )}
      </section>
    </section>
  )
}

export default PodlumeDetails