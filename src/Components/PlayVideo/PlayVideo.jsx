import React, { useEffect, useState } from 'react'
import "./PlayVideo.css"
import video1 from "../../assets/video.mp4"
import like from "../../assets/like.png"
import dislike from "../../assets/dislike.png"
import share from "../../assets/share.png"
import save from "../../assets/save.png"
import jack from "../../assets/jack.png"
import notification from "../../assets/notification.png"
import user_profile from "../../assets/user_profile.jpg"
import { API_KEY, value_converter } from '../../../Data'
import moment from 'moment'
import { useParams } from 'react-router-dom'


function PlayVideo() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { videoId } = useParams();
    const [apiData, setApiData] = useState(null)
    const [channelData, setChannelData] = useState(null)
    const [commenetData, setCommentData] = useState([])
    const handleClick = () => {
        setIsSubscribed(!isSubscribed);
    };

    const fetchVideoData = async () => {
        const videoDetails_url = ` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY} `
        await fetch(videoDetails_url)
            .then(response => response.json())
            .then(data => setApiData(data.items[0]))
    }

    const fetchOtherData = async () => {
        const channelData_url = ` https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY} `
        await fetch(channelData_url)
            .then(response => response.json())
            .then(data => setChannelData(data.items[0]))

        const comment_url = ` https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResult=10&videoId=${videoId}&key=${API_KEY}`
        await fetch(comment_url)
            .then(response => response.json())
            .then(data => setCommentData(data.items))
    }

    useEffect(() => {
        fetchVideoData();
    }, [videoId])

    useEffect(() => {
        fetchOtherData()
    }, [apiData])



    return (
        <div className='play-video'>
            <iframe src={`https://www.youtube.com/embed/${videoId}?`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            <div className="play-video-info">
                <p>{apiData ? value_converter(apiData.statistics.viewCount) : "16k"} views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
                <div>
                    <span><img src={like} alt="" />{apiData ? value_converter(apiData.statistics.likeCount) : ""}</span>
                    <span><img src={dislike} alt="" /> </span>
                    <span><img src={share} alt="" /> share </span>
                    <span><img src={save} alt="" /> save </span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : ""} Subscriber</span>
                </div>

                <button className={isSubscribed ? 'subscribed' : 'pub'}
                    onClick={handleClick}> {isSubscribed ? (
                        <>
                            Subscribed
                            <img src={notification} alt="" />

                        </>

                    ) : 'Subscribe'}</button>
            </div>

            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
                <p>Subscribed GreatStack to watch More Tutorials on Web Development</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>

                {commenetData.map((comment, index) => (
                    <div className="comment" key={index}>
                        <img src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                        <div>
                            <h3>{comment.snippet.topLevelComment.authorDisplayName} <span></span></h3>
                            <p>{comment.snippet.topLevelComment.snippet.textDisplay} </p>
                            <div className="comment-action">
                                <img src={like} alt="" />
                                <span>{value_converter(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default PlayVideo