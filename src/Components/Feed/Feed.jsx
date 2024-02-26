import React, { useEffect, useState, useCallback } from 'react';
import "./Feed.css";
import { API_KEY, value_converter } from '../../../Data';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

const Feed = ({ category }) => {
    const [data, setData] = useState([]);
    const [pageToken, setPageToken] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const fetchData = useCallback(() => {
        // Construct the URL with the search query parameter
        const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=5&pageToken=${pageToken}&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

        fetch(videoList_url)
            .then(response => response.json())
            .then(jsonData => {
                setData(prevData => [...prevData, ...jsonData.items]);
                setPageToken(jsonData.nextPageToken);
                setHasMore(!!jsonData.nextPageToken);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [category, pageToken]);



    useEffect(() => {
        setData([]); // Clear previous data when category changes
        setPageToken(''); // Reset page token when category changes
    }, [category]);

    useEffect(() => {
        fetchData(); // Fetch data when component mounts and category changes
    }, [category]);

    return (
        <div className='feed'>
            <InfiniteScroll
                className='infiniteScrollVideo'
                dataLength={data.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more videos</p>}
                scrollThreshold={0.9}
            >
                {data.map((video) => (
                    <Link to={`video/${video.snippet.categoryId}/${video.id}`} className='card' key={video.id}>
                        <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
                        <h2>{video.snippet.title}</h2>
                        <h3>{video.snippet.channelTitle}</h3>
                        <p>{value_converter(video.statistics.viewCount)} views • {moment(video.snippet.publishedAt).fromNow()}</p>
                    </Link>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default Feed;
