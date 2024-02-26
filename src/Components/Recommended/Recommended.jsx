import React, { useEffect, useState, useRef } from 'react';
import "./Recommended.css";
import { API_KEY, value_converter } from '../../../Data';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const Recommended = ({ categoryId }) => {
    const [apiData, setApiData] = useState([]);
    const [pageToken, setPageToken] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const targetRef = useRef(null); // Create a ref for the target element

    const fetchData = async () => {
        const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&videoCategoryId=${categoryId}&maxResults=20&pageToken=${pageToken}&key=${API_KEY}`;

        const response = await fetch(relatedVideo_url);
        const jsonData = await response.json();

        if (jsonData.error) {
            // Handle error
            console.error(jsonData.error.message);
            return;
        }

        setApiData([...apiData, ...jsonData.items]);
        setPageToken(jsonData.nextPageToken);
        setHasMore(!!jsonData.nextPageToken);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: null, // Use viewport as root
            threshold: 0.1 // Trigger when 10% of the target is visible
        });

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };
    }, [categoryId]);

    const handleIntersection = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                fetchData();
            }
        });
    };

    return (
        <div className='recommended'>
            <InfiniteScroll
                dataLength={apiData.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more videos</p>}
                scrollThreshold={0.9}
            >
                {apiData.map((data, index) => (
                    <Link to={`/video/${data.snippet.categoryId}/${data.id}`} className='side-video-list' key={data.id}>
                        <img src={data.snippet.thumbnails.medium.url} alt="" />
                        <div className='vid-info'>
                            <h4>{data.snippet.title}</h4>
                            <p>{data.snippet.channelTitle}</p>
                            <p>{value_converter(data.statistics.viewCount)} views</p>
                        </div>
                    </Link>
                ))}
                <div ref={targetRef}></div> {/* Target element for intersection observer */}
            </InfiniteScroll>
        </div>
    )
}

export default Recommended;
