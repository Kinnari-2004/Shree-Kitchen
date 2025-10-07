import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", category: "", price: "", image: null });

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching food list");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      image: null
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (id) => {
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("price", formData.price);
      if (formData.image) form.append("image", formData.image);

      const res = await axios.put(`${url}/api/food/update`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data) toast.success("Food updated!");
      setEditingId(null);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const removeFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food?")) return;
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) toast.success(response.data.message);
      else toast.error("Error removing food");
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Error removing food");
    }
  };

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className='list-table-format'>
            {editingId === item._id ? (
              <>
                <input type="file" name="image" onChange={handleChange} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
                <input type="text" name="category" value={formData.category} onChange={handleChange} />
                <input type="number" name="price" value={formData.price} onChange={handleChange} />
                <div>
                  <span onClick={() => handleUpdate(item._id)} className="cursor">✔</span>
                  <span onClick={() => setEditingId(null)} className="cursor">✖</span>
                </div>
              </>
            ) : (
              <>
                <img src={`${url}/images/${item.image}`} alt="" />
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <div className='cursors'>
                  <span onClick={() => handleEdit(item)} className="cursor">✎</span>
                  <span onClick={() => removeFood(item._id)} className="cursor">X</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
