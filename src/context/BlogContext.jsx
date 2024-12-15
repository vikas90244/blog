import { createContext, useState } from "react";

const BlogContext = createContext();

const BlogProvider = ({children}) => {
  
  const contextData={};

  return (
   <BlogContext.Provider value={contextData}>
    {children}
   </BlogContext.Provider>
  )
}

export{ BlogProvider, BlogContext}