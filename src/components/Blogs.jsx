import { useEffect, useContext, useState } from 'react';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { lightenColor, modules } from '../utility/color';
import { BlogContext } from '../context/BlogContext';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Import Draft.js CSS

const Blogs = () => {
  const {
    fetchBlogs,
    deleteBlog,
    updateBlog,
    startEditing,
    cancelEditing,
    blogs,
    setBlogs,
    setEditing,
    editing,
    updatedTitle,
    updatedBody,
    setUpdatedBody,
    setUpdatedTitle,
    updatedTitleColor,
    setUpdatedTitleColor,
  } = useContext(BlogContext);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorStateChange = (newState) => {
    setEditorState(newState);
  };

  useEffect(() => {
    const getBlogs = async () => {
      await fetchBlogs();
    };
    getBlogs();
  }, []);

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

              <div style={{ backgroundColor: lightenColor(updatedTitleColor, 0.15) }}>
                <Editor
                  editorState={editorState}
                  onChange={handleEditorStateChange}
                  placeholder="Write your blog content here..."
                />
              </div>

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
