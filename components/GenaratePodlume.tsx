import React, { useState } from 'react';
import { GeneratePodlumeProps } from './types';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast"

import { useUploadFiles } from '@xixixao/uploadstuff/react';

const useGeneratePodlume = ({
    setAudio, voiceType, voicePrompt, setAudioStorageId 
}: GeneratePodlumeProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast()

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload }  = useUploadFiles(generateUploadUrl);

    const getPodlumeAudio = useAction(api.openai.generateAudioAction);

    const getAudioUrl = useMutation(api.podlume.getUrl);

    const generatePodlume = async () => {
        setIsGenerating(true);
        setAudio('');

        if(!voicePrompt) {
            toast({
                title: "Please provide a voiceType to generate a podlume",                
              })
            return setIsGenerating(false);
        }

        try {
            const response = await getPodlumeAudio({
                voice: voiceType,
                input: voicePrompt
            })

            const blob = new Blob([response], { type: 'audio/mpeg' });
            const fileName = `podlume-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, { type: 'audio/mpeg' });

            const uploaded = await startUpload([file]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const storageId = (uploaded[0].response as any ).storageId;

            setAudioStorageId(storageId);

            const audioUrl = await getAudioUrl({ storageId });
            setAudio(audioUrl!);
            setIsGenerating(false);
            toast({
                title: "Podlume generated successfully",
              })
        } catch (error) {
            console.log('Error generating podlume', error)
            toast({
                title: "Error creating a podlume",
                variant:'destructive',
              })
            setIsGenerating(false);
        }
    }

    return { isGenerating, generatePodlume }
}

const GenaratePodlume = (props: GeneratePodlumeProps ) => {    
    const{ isGenerating, generatePodlume }  = useGeneratePodlume(props);

  return (
    <div>
        <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
                Ai Prompt to generate Podlume
            </Label>
            <Textarea
                className="input-class font-light focus-visible:ring-orange-1 text-white-1"
                placeholder='Provide text to generate audio'
                rows={5}
                value={props.voicePrompt}
                onChange={(e) => props.setVoicePrompt(e.target.value)}
            />
        </div>
        <div className="mt-5 w-full max-w-[200px]">
            <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodlume}>
              {isGenerating ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2"/>                      
                </>
              ) : (
                "Generate"
              )}
            </Button>
        </div>
        {props.audio && (
            <audio 
                controls
                src={props.audio}
                autoPlay
                className="mt-5"
                onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
            />
        )}
    </div>
  )
}

export default GenaratePodlume