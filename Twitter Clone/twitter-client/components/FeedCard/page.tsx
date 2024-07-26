import React from "react";
import Image from 'next/image'
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa6";
import { IoHeartOutline } from "react-icons/io5";
import { GoBookmark, GoUpload } from "react-icons/go";

const FeedCard: React.FC = () => {
    return(
        <div className="border border-t border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1">
                    <Image src={'https://avatars.githubusercontent.com/u/161676355?v=4'}
                    alt="user-image" height={50} width={50} className="outline outline-white rounded-full" />
                </div>
                <div className="col-span-11 text-white">
                    <div className="flex gap-2">
                        <h5 className="font-bold">Paulami Banerjee</h5>
                        <h5>@paulami</h5>
                    </div>
                    {/* <pre> */}
                        <p>The one universal experience is that we’re alive, but not forever. 
                            The time we have on this floating rock has been bottled in memorable 
                            quotes by the greatest thinkers of human history. Their takes on 
                            life range from inspirational to funny life quotes that cover the 
                            whole spectrum of human emotion
                        </p>
                    {/* </pre> */}
                    <div className="flex justify-between mt-5 text-xl text-gray-500 items-center">
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            <FaRetweet />
                        </div>
                        <div>
                            <IoHeartOutline />
                        </div>
                        <div>
                            <GoBookmark />
                        </div>
                        <div>
                            <GoUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedCard;