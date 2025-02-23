"use client";
import PodlumeCard from '@/components/PodlumeCard'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {  
  const trendingPodlumes = useQuery(api.podlume.getTrendingPodlume) ;
  
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podlume</h1>
        <div className='podcast_grid'>        
          {trendingPodlumes?.map(({ _id, podlumeTitle, podlumeDescription, imageUrl}) => (
            <PodlumeCard
              key={_id}
              imgUrl={imageUrl}
              title={podlumeTitle}
              description={podlumeDescription}
              podlumeId={_id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home