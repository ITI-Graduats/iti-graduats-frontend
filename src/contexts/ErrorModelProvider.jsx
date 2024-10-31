import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
  } from "react";
  import tracksApiRequest from "../services/apiRequests/tracksApiRequest"; 
  import branchApiRequest from "../services/apiRequests/branchApiRequest";
  const ErrorModelContext = createContext();
  
  export const useErrorModel = () => useContext(ErrorModelContext);
  
  export const ErrorModelProvider = ({ children }) => {
    const [tracks, setTracks] = useState([]); 
    const [branches, setBranches] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
  
    const fetchData = useCallback(async () => {
      setIsLoading(true);
      setError(null); 
      try {
        const [tracksData, branchesData] = await Promise.all([
          tracksApiRequest.getAllTracks(), 
          branchApiRequest.getAllBranches(),
        ]);
        setTracks(tracksData); 
        setBranches(branchesData);
      } catch (err) {
        setError("Failed to fetch education data"); 
        console.error("Error fetching education data:", err);
      } finally {
        setIsLoading(false); 
      }
    }, []);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    const value = {
      tracks,
      branches,
      isLoading,
      error,
      refetchData: fetchData,
    };
  
    return (
      <ErrorModelContext.Provider value={value}>
        {children} 
      </ErrorModelContext.Provider>
    );
  };
  