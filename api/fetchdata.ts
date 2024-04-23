import { useQuery } from 'react-query';
import axios from 'axios';

const fetchStorageAreaData = async (node_id: string, url: string, port: string) => {
    console.log(node_id, url, port); // add this line

    const { data } = await axios.get(`http://${url}:${port}/api/storagearea/${node_id}/`);
    
    return data;
};

export const useStorageAreaData = (node_id: string, url: string, port: number) => {
    console.log(node_id, url, port); // add this line

    return useQuery(['storageAreaData', url, port, node_id], () => fetchStorageAreaData(node_id, url, port.toString()), {
        staleTime: 5 * 60 * 1000, // data is considered fresh for 5 minutes
        refetchInterval: 5 * 60 * 1000, // refetch data every 5 minutes
    });
};