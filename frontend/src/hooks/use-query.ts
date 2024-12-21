import { useState } from "react";

type UseQueryArgs = {
  fetchFn: () => Promise<any>;
  initialData: any;
};
const useQuery = (args: UseQueryArgs) => {
  const { fetchFn, initialData } = args;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const newData = await fetchFn();
      setData(newData);
    }
    finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    handleFetch,
  };
};

export default useQuery;
