"use client";

import { useState, useEffect } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import {
  MapPin,
  ChevronDown,
  BadgeCheck,
  AlarmClock,
  Pencil,
} from "lucide-react";
import Layout from "../components/layout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllCircles } from "@/lib/circles";
import { useRouter } from "next/navigation";
import { Trash2, X, TriangleAlert } from "lucide-react";
import axios from "axios";
import { set } from "mongoose";
import { useMediaQuery } from "react-responsive";
import InnerPageFooter from "../components/InnerPagefooter";

function ListingCard({
  _id,
  itemName,
  itemPrice,
  itemStatus,
  image,
  category,
  currentUser,
  ownerId,
  showConfirmDelete,
  setShowConfirmDelete,
  showEdit,
  setShowEdit,
  onDelete,
  deletingItem,
  editedStatus,
  setEditedStatus,
  onEdit,
  editingItem,
  currentItemId,
  setCurrentItemId,
}) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg inline-block transition-all duration-300 overflow-hidden">
        <img src={image} alt={itemName} className="w-full h-48 object-fit" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full ">
              {category}
            </span>
            {currentUser.uid === ownerId ? (
              <>
                <div className="flex flex-row items-center gap-4">
                  <button
                    onClick={() => {
                      setShowEdit(true);
                      setCurrentItemId(_id);
                    }}
                    className=" text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmDelete(true);
                      setCurrentItemId(_id);
                    }}
                    className=" text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {itemName}
          </h3>
          <p className="text-xl font-bold text-indigo-600 mb-2">₹{itemPrice}</p>
          <div className="flex items-center text-sm text-gray-500">
            {itemStatus === "available" && (
              <>
                <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-500">Available</span>
              </>
            )}
            {itemStatus === "sold" && (
              <>
                <TriangleAlert className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-500">Sold</span>
              </>
            )}
            {itemStatus === "requested" && (
              <>
                <AlarmClock className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-yellow-500">Requested</span>
              </>
            )}
          </div>
          <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors">
            Contact Seller
          </button>
        </div>
      </div>

      {/* Confirm Delete Popup */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full relative animate-fadeIn">
            <button
              onClick={() => {
                setShowConfirmDelete(false);
                setCurrentItemId(null);
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-black cursor-pointer"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{}</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to Delete this event?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setCurrentItemId(null);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deletingItem}
                onClick={() => {
                  onDelete(currentItemId);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm cursor-pointer"
              >
                {deletingItem ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Popup */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full relative animate-fadeIn">
            <button
              onClick={() => {
                setShowEdit(false);
                setCurrentItemId(null);
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-black cursor-pointer"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{}</h2>
            <p className="text-black mb-6 text-sm text-center">
              Edit the item status here.
            </p>

            <CustomDropdown
              label={"Status"}
              name={"status"}
              options={["available", "sold", "requested"]}
              value={editedStatus}
              onChange={(e) => {
                const selectedStatus = e.target.value;
                setEditedStatus(selectedStatus);
              }}
            />
            <div className="flex justify-evenly">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setCurrentItemId(null);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deletingItem}
                onClick={() => {
                  onEdit(currentItemId);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm cursor-pointer"
              >
                {editingItem ? "editing..." : "Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden animate-pulse">
      <div className="w-full h-48  bg-gray-300" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 w-52 bg-gray-300 rounded-full" />
          <div className="h-5 w-5 bg-gray-300 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2" />
        <div className="h-5 w-1/2 bg-gray-300 rounded mb-4" />
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-gray-300 rounded-full" />
          <div className="h-4 w-16 bg-gray-300 rounded" />
        </div>
        <div className="h-10 w-full bg-gray-300 rounded-xl" />
      </div>
    </div>
  );
}

function CustomDropdown({ label, name, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target === event.currentTarget) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="mb-4 relative">
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-2 bg-white border rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md"
      >
        <span className="text-gray-700">{value || `Select ${label}`}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>
      {open && (
        <div className="absolute z-20 bg-white w-full mt-1 rounded-xl shadow-xl overflow-hidden border animate-fadeIn max-h-52 overflow-y-auto">
          {Array.isArray(options) && options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange({ target: { name, value: opt } });
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-indigo-50 text-sm cursor-pointer text-gray-700"
              >
                {opt}
              </div>
            ))
          ) : typeof options === "object" && Object.keys(options).length > 0 ? (
            Object.entries(options).map(([key, val]) => (
              <div
                key={key}
                onClick={() => {
                  onChange({ target: { name, value: key } });
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-indigo-50 text-sm cursor-pointer text-gray-700"
              >
                {key}
              </div>
            ))
          ) : (
            // Fallback for Empty Options
            <div className="px-4 py-2 text-sm text-gray-500">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Shelf() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingShelf, setLoadingShelf] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [shelves, setShelves] = useState({});
  const [userId, setUserId] = useState(null);
  const [circleNames, setCircleNames] = useState({});
  const router = useRouter();
  const [popupAlert, setPopupAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [addingItem, setAddingItem] = useState(false);
  const [deletingItem, setDeletingItem] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [editingItem, setEditingItem] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [formData, setFormData] = useState({
    imageBase64: "",
    itemName: "",
    itemPrice: "",
    category: "",
    circle: "",
    circleIdString: "",
    description: "",
    ownerId: "",
  });
  const categoriesList = [
    "Electronics",
    "Books",
    "Clothing",
    "Furniture",
    "Sports & Leisure",
    "Home & Garden",
    "Arts & Crafts",
    "Toys & Games",
    "Health & Beauty",
    "Automotive",
    "Collectibles",
    "Jewelry",
    "Pet Supplies",
    "Baby & Kids",
    "Video Games",
    "Home Appliances",
    "Office Supplies",
    "Tools & Hardware",
    "Outdoor & Garden",
    "Fashion Accessories",
    "Sports Equipment",
    "Fitness & Exercise",
    "Camping & Hiking",
    "Travel & Luggage",
    "Photography & Video",
    "Computers & Laptops",
    "Smartphones & Tablets",
    "Watches & Clocks",
    "Home Decor",
    "Kitchen & Dining",
    "Party Supplies",
    "Gift Cards",
    "Musical Instruments",
    "Board Games & Puzzles",
    "Craft Supplies",
    "Gardening Supplies",
    "Fishing & Hunting",
    "Camping Gear",
    "Cycling & Biking",
    "Others",
  ];

  const showPopupAlert = (message, type = "success") => {
    setPopupAlert({ show: true, message, type });
    setTimeout(
      () => setPopupAlert({ show: false, message: "", type: "success" }),
      5000
    );
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserId(user.uid);
        setFormData({ ...formData, ownerId: user.uid });
      } else {
        setCurrentUser(null);
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, imageBase64: reader.result });
      };
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setAddingItem(true);

    if (
      !formData.imageBase64 ||
      !formData.itemName ||
      !formData.itemPrice ||
      !formData.category ||
      !formData.circle ||
      !formData.circleIdString
    ) {
      showPopupAlert("❌ Please fill all fields.", "error");
      setAddingItem(false);
      return;
    }

    try {
      const res = await axios.post("/api/shelf", { ...formData });
      if (res.status === 200 || res.status === 201) {
        fetchShelf();
        showPopupAlert("🎉 Item Added Successfully!", "success");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      showPopupAlert("❌ Error Adding Item.", "error");
    } finally {
      setAddingItem(false);
      setShowModal(false);
      setFormData({
        imageBase64: "",
        itemName: "",
        itemPrice: "",
        category: "",
        circle: "",
        circleIdString: "",
        description: "",
        ownerId: userId,
      });
    }
  };

  const handleDeleteItem = async (id) => {
    setDeletingItem(true);
    if (!id) {
      showPopupAlert("❌ Error deleting bulletin.", "error");
      return;
    }
    try {
      const detetedBulletin = await axios.delete("/api/shelf", {
        data: { id },
      });
      if (detetedBulletin.status === 200) {
        await fetchShelf();
        showPopupAlert("🎉 Item deleted from Shelf successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showPopupAlert("❌ Error deleting Item from Shelf.", "error");
    } finally {
      setDeletingItem(false);
      setShowConfirmDelete(false);
    }
  };

  const handleEditItem = async (id) => {
    setEditingItem(true);
    if (!id) {
      showPopupAlert("❌ Error updating item.", "error");
      return;
    }
    try {
      const res = await axios.put("/api/shelf", { id, status: editedStatus });
      if (res.status === 200) {
        await fetchShelf();
        showPopupAlert("🎉 Item status updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      showPopupAlert("❌ Error updating item status.", "error");
    } finally {
      setEditingItem(false);
      setShowEdit(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.uid) return;
    setLoadingShelf(true);

    const fetchCircles = async () => {
      const allCircles = await getAllCircles();
      const usersCircles = allCircles.filter((circle) =>
        circle.members?.includes(currentUser?.uid)
      );
      const newCircleNames = {};
      usersCircles.forEach((circle) => {
        newCircleNames[circle.name] = circle.id;
      });
      setCircleNames(newCircleNames);
      setLoadingShelf(false);
    };

    fetchCircles();
  }, [currentUser]);

  const fetchShelf = async () => {
    try {
      const res = await axios.get("/api/shelf");
      if (res.status === 200) {
        const temp = res.data;
        const allowedIds = new Set(Object.values({ ...circleNames }));
        const filteredItems = temp.filter((item) =>
          allowedIds.has(item.circleIdString)
        );
        setShelves(filteredItems);
      }
    } catch (error) {
      console.error("Error fetching shelf:", error);
    } finally {
      setLoadingShelf(false);
    }
  };

  useEffect(() => {
    setLoadingShelf(true);

    fetchShelf();
  }, [circleNames]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Yana Shelf
              </h1>
              <p className="text-gray-500 text-sm">
                Buy and sell items around your circles.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm shadow-lg"
            >
              + List Item
            </button>
          </div>

          {/* Cards Grid */}
          {loadingShelf ? (
            <div className="flex flex-row flex-wrap gap-14 justify-evenly items-center w-full ">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
            </div>
          ) : shelves.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelves.map((item) => {
                return (
                  <ListingCard
                    key={item._id}
                    _id={item._id}
                    itemName={item.itemName}
                    itemPrice={item.itemPrice}
                    image={item.imageBase64}
                    category={item.category}
                    itemStatus={item.status}
                    currentUser={currentUser}
                    ownerId={item.ownerId}
                    showConfirmDelete={showConfirmDelete}
                    setShowConfirmDelete={setShowConfirmDelete}
                    showEdit={showEdit}
                    setShowEdit={setShowEdit}
                    deletingItem={deletingItem}
                    onDelete={handleDeleteItem}
                    editedStatus={editedStatus}
                    setEditedStatus={setEditedStatus}
                    onEdit={handleEditItem}
                    editingItem={editingItem}
                    currentItemId={currentItemId}
                    setCurrentItemId={setCurrentItemId}
                  />
                );
              })}
            </div>
          ) : (
            <div className="h-[50vh] text-center flex justify-center items-center">
              No Items Availabe in the Shelf Right Now!
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm transition-all">
              <form
                onSubmit={handleAddItem}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative animate-fadeIn border border-gray-200"
              >
                <button
                  className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-5 text-gray-900">
                  📦 List Your Item
                </h2>

                {/* Image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-3 w-full text-sm block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer"
                />
                {formData.preview && (
                  <img
                    src={formData.preview}
                    className="h-40 w-full object-cover rounded-xl mb-4 border"
                    alt="Preview"
                  />
                )}

                <input
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="Item name"
                  className="w-full px-4 py-2 border rounded-xl mb-3 text-sm placeholder:text-gray-400"
                />
                <input
                  name="itemPrice"
                  value={formData.itemPrice}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full px-4 py-2 border rounded-xl mb-3 text-sm placeholder:text-gray-400"
                />

                <CustomDropdown
                  label="Category"
                  name="category"
                  value={formData.category}
                  options={categoriesList}
                  onChange={handleChange}
                />

                <CustomDropdown
                  label="Circle"
                  name="circle"
                  options={circleNames}
                  value={formData.circle}
                  onChange={(e) => {
                    const selectedCircleName = e.target.value;
                    const selectedCircleId = circleNames[selectedCircleName];
                    setFormData({
                      ...formData,
                      circle: selectedCircleName,
                      circleIdString: selectedCircleId,
                    });
                  }}
                />

                <button
                  type="submit"
                  className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  {addingItem ? "Listing Item..." : "🚀 Submit Listing"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Popup Alert */}
        {popupAlert.show && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-opacity duration-300 z-50 ${
              popupAlert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popupAlert.message}
          </div>
        )}
      </Layout>
    </PrivateRoute>
  );
}

export default Shelf;
