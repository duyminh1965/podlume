"use client";

import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import PodlumeCard from '@/components/PodlumeCard';
import Searchbar from '@/components/Searchbar';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

const Discover = ({ searchParams }: { searchParams: { search?: string } }) => {
  const search = searchParams?.search || "";  
  
  const podlumeData = useQuery(api.podlume.getPodlumeBySearch, { search });

  return (    
    <div className='flex flex-col gap-9'>
      <Searchbar />
      <div className='flex flex-col gap-9'>
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trending Podlume" : "Search results for "}
          {search && <span className='text-white-2'>{search}</span>}
        </h1>
        {podlumeData ? (
          <>
            {podlumeData.length > 0 ?(
              <div className='podcast_grid'>        
              {podlumeData?.map(({ _id, podlumeTitle, podlumeDescription, imageUrl}) => (
                <PodlumeCard
                  key={_id}
                  imgUrl={imageUrl}
                  title={podlumeTitle}
                  description={podlumeDescription}
                  podlumeId={_id}
                />
              ))}
            </div>
            ) : <EmptyState title="No results found"/>}
          </>
        ) : <LoaderSpinner/>}
      </div>      
    </div>    
  );
};

export default Discover;