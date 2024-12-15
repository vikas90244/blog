import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { lightenColor } from '../utility/color';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules } from '../utility/color';
import API from '../utility/api';

const Blogs = () => {
  const { user } = useContext(AuthContext);
  const URL = "https://blogify-zv8t.onrender.com/blog";

  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedBody, setUpdatedBody] = useState('');
  const [updatedTitleColor, setUpdatedTitleColor] = useState('#ffffff');

  const fetchBlogs = async () => {
    try {
      const response = await API.get(URL);
      console.log("Fetched blogs:", response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs: ", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await API.delete(`${URL}/${id}`);
      if (response.status === 204) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          "Failed to delete blog. Please try again.";
      alert(`Delete Failed: ${errorMessage}`);
    }
  };

  const updateBlog = async (id) => {
    try {
      const response = await API.put(`${URL}/${id}`, {
        title: updatedTitle,
        body: updatedBody,
        title_color: updatedTitleColor || '#e2efff'
      });
      
      if (response.status === 200) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === id ? response.data : blog
          )
        );
        setEditing(null);
      }
    } catch (error) {
      console.error("Update failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          "Failed to update blog. Please try again.";
      alert(`Update Failed: ${errorMessage}`);
    }
  };

  const startEditing = (blog) => {
    setEditing(blog.id);
    setUpdatedTitle(blog.title);
    setUpdatedBody(blog.body);
    setUpdatedTitleColor(blog.title_color || '#e2efff');
  };

  const cancelEditing = () => {
    setEditing(null);
    setUpdatedTitle('');
    setUpdatedBody('');
    setUpdatedTitleColor('#e2efff');
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  const handleBodyChange = (content) => {
    setUpdatedBody(content);
  };

  return (
    <div className="flex flex-col gap-0 font-sans">
      {blogs.map((blog) => {
        console.log("Blog creator:", blog.creator);
        console.log("Current user:", user);
        console.log("Authorization check:", user?.email === blog.creator.email);
        
        return (
          <div className="mx-4 my-4" key={blog.id}>
            {blog.id === editing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  style={{ backgroundColor: updatedTitleColor }}
                  className="border p-2 focus:outline-none mx-8 font-medium px-2 py-2 rounded-t-md"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />

                <input
                  type="color"
                  className="rounded-md cursor-pointer"
                  value={updatedTitleColor}
                  onChange={(e) => setUpdatedTitleColor(e.target.value)}
                />

                <ReactQuill 
                  modules={modules}
                  className="py-4 px-2 mx-8 min-h-56 rounded-b-md"
                  theme="snow" 
                  value={updatedBody}
                  style={{ backgroundColor: lightenColor(updatedTitleColor, 0.15) }}
                  onChange={handleBodyChange} 
                />

                <div className="flex gap-2 items-center">
                  <button
                    className="px-3 py-1 bg-green-600 text-white font-medium rounded-md"
                    onClick={() => updateBlog(blog.id)}
                  >
                    Update
                  </button>

                  <button
                    className="px-3 py-1 bg-red-500 text-white font-medium rounded-md"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  style={{ backgroundColor: blog.title_color, borderColor: blog.title_color }}
                  className="font-medium mx-8 px-2 py-2 border-x border-t bor rounded-t-md"
                >
                  {blog.title}
                </h3>
                <div>
                  <div
                    style={{ backgroundColor: lightenColor(blog.title_color, 0.15) }}
                    className="py-4 mx-8 px-2 min-h-56 border-x border-b border-slate-300 rounded-b-md"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.body) }}
                  />
                </div>
                <div className="mx-8 mt-2 flex items-center">
                  <span className="text-sm text-gray-600 mr-4">
                    Created by: {blog.creator.name}
                  </span>
                  {user && user.email === blog.creator.email && (
                    <div className="flex space-x-2">
                      <button
                        className="px-2 py-1 rounded-md text-blue-600 hover:bg-blue-100"
                        onClick={() => startEditing(blog)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => deleteBlog(blog.id)}
                        className="px-2 py-1 rounded-md text-red-600 hover:bg-red-100"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Blogs;
