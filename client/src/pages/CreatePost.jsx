import React from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form action="" className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title requires "
            required
            id="title"
            className="flex-1 outline-none border-2 border-teal-100 border-dotted p-3   "
          />
          <select name="" id="" className="p-1 rounded-lg">
            <option value="uncategorized" className="">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React.js</option>
            <option value="next">Next.js</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-between border-4 border-teal-100 border-dotted p-3">
          <input type="file" accept="image/*" className=" sm:w-auto" />
          <button
            type="button"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md text-sm  sm:w-auto"
          >
            Upload Button
          </button>
        </div>
        <ReactQuill theme="snow" placeholder="write somthing..." className="h-72 mb-12" required/>
        <button className="w-full text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md mt-2">Publish </button>
      </form>
    </div>
  );
}

export default CreatePost;
