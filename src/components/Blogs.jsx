import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { lightenColor } from '../utility/color';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules } from '../utility/color';
const Blogs = () => {
  const URL = "https://blogify-zv8t.onrender.com/blog";
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedBody, setUpdatedBody] = useState('');
  const [updatedTitleColor, setUpdatedTitleColor] = useState('#ffffff');

  const fetchBlogs = async () => {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs: ", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      }
    } catch (error) {
      console.error("Error deleting the blog: ", error);
    }
  };




  const updateBlog = async (id) => {
    try {
      const response = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
          body: updatedBody,
          title_color: updatedTitleColor,
        }),
      });

      if (response.ok) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === id
              ? { ...blog, title: updatedTitle, body: updatedBody, title_color: updatedTitleColor }
              : blog
          )
        );
        setEditing(null);
      } else {
        console.error("Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog: ", error);
    }
  };

  const startEditing = (blog) => {
    setEditing(blog.id);
    setUpdatedTitle(blog.title);
    setUpdatedBody(blog.body);
    setUpdatedTitleColor(blog.title_color || '#ffffff');
  };

  const cancelEditing = () => {
    setEditing(null);
    setUpdatedTitle('');
    setUpdatedBody('');
  };

  useEffect(() => {
    fetchBlogs();
  }, []);


  const handleBodyChange = (content) => {
    setUpdatedBody(content);
  };
  

  return (
    <div className="flex flex-col gap-0 font-sans">
      {blogs.map((blog) => (
        <div className="mx-4 my-4" key={blog.id}>

          {blog.id === editing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                style={{ backgroundColor: updatedTitleColor }}
                className="border p-2 focus:outline-none font-medium px-2 py-2 rounded-t-md"
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
              className="py-4 px-2 min-h-56 rounded-b-md"
              theme="snow" 
              value={updatedBody}
              style={{ backgroundColor: lightenColor(updatedTitleColor, 0.15) }}
               onChange={handleBodyChange} />

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
                className="font-medium px-2 py-2 border-x border-t bor rounded-t-md"
              >
                {blog.title}
              </h3>
              <div style={{ backgroundColor: lightenColor(blog.title_color, 0.15) }}>
                <div
                  className="py-4 px-2 min-h-56 border-x border-b border-slate-300 rounded-b-md"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.body) }}
                />
              </div>
              <button
                className="px-3 mt-2 rounded-md text-blue-600"
                onClick={() => startEditing(blog)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => deleteBlog(blog.id)}
                className="pr-3 mt-2 rounded-md text-red-600"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default Blogs;

