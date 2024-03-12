import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import {withSwal} from 'react-sweetalert2';

function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(event) {
    event.preventDefault();
    const data = {name, parentCategory}
    if (editedCategory) {
      data._id = editedCategory._id
    await axios.put('/api/categories', data)
    setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);

    }
    setName("");
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
  }).then(async result => {
if (result.isConfirmed) {
  const {_id} = category;
  await axios.delete('/api/categories?_id='+_id)
  fetchCategories();
}
  })
  }
  function addProperty(){
    setProperties(prev => {
      return[...prev, {name:'', values:''}]
    })
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create new Category"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <div className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"Category name"}
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(event) => setParentCategory(event.target.value)}
        >
          <option value=''>No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button onClick={addProperty} type="button" className="btn-default text-sm">Add new Property</button>
          {properties.length > 0 && properties.map(property => (
            <div className="flex gap-1">
              <input type="text" placeholder="property name(example: color)" />
              <input type="text" placeholder="values, comma separated" />
            </div>
          ))}
        </div>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-primary mr-1"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteCategory(category)} className="btn-primary">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
export default withSwal(({swal}, ref) => (
  <Categories swal={swal}/>
) );