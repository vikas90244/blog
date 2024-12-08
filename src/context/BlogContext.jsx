import { createContext, useState } from "react";


const BlogContext = createContext();

const BlogProvider = ({children}) => {
  
    const URL="https://blogify-zv8t.onrender.com/blog"
    const [blogs, setBlogs]=useState([]);
    const [editing, setEditing] = useState(null); 
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedBody, setUpdatedBody] = useState('');
    const [updatedTitleColor, setUpdatedTitleColor] = useState("#ffffff");


    //  const createBlog = async()=> {
    //    try {
    //     const response = fetch(`URL`, {
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         }
    //     })
    //    } catch (error) {
    //     console.error("could not create new Blog", error)
    //    }
    //  }
     const fetchBlogs =  async()=> {
        try {
          const response = await fetch(URL);
          const data = await response.json()
          setBlogs(data);
       
        } catch (error) {
          console.error("Error fetching blogs: ", error);
        }
      }
      
      const deleteBlog= async(id)=>{
        try {
          const response = await fetch(`${URL}/${id}`, {
            method:'DELETE'
          });
          if(response.ok) {
            
            setBlogs((prevBlogs)=>prevBlogs.filter((blog)=>blog.id !==id));
          }
        } catch (error) {
          console.error("error Deleting the blog: ", error)
        }
      }
    
      const updateBlog = async(id)=>{
        try {
          
          const response = await fetch(`${URL}/${id}`, {
            method:'PUT',
            headers:{
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
              title: updatedTitle,
              body:updatedBody,
              title_color: updatedTitleColor
            })  
          })
    
          if(response.ok) {
            setBlogs(
              (prevBlogs)=> prevBlogs.map((blog)=>
              blog.id===id ?{...blog, title:updatedTitle, body:updatedBody, title_color:updatedTitleColor}:blog)
            );
            
            setEditing(null);
          }
          else {
            console.error("failed to update blog. ");
          }
          
    
    
        } catch (error) {
           console.error("Error updating blog: ", error);
        }
      }
    
    
      const startEditing =(blog) => {
       
        setEditing(blog.id);
        setUpdatedTitle(blog.title);
        setUpdatedBody(blog.body);
        setUpdatedTitleColor(blog.title_color || '#ffffff');
      }
     
      const cancelEditing = () => {
        setEditing(null);
        setUpdatedTitle('');
        setUpdatedBody('');
      };
      
    
     const contextData={fetchBlogs, startEditing, cancelEditing, updateBlog, deleteBlog, blogs, setBlogs, editing, setEditing, updatedBody, updatedTitle, setUpdatedBody, setUpdatedTitle, updatedTitleColor, setUpdatedTitleColor};

    
  return (
   <BlogContext.Provider value={contextData}>
    {children}
   </BlogContext.Provider>
  )
}

export{ BlogProvider, BlogContext}