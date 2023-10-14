import axios from "axios";
export function DeleteButton(props: any) {
  const handleDelete = async () => {
    const shouldDelete = 

    if (shouldDelete.isConfirmed) {
      try {
        if (props.origin === "products") {
          await axios.delete(`/api/products/?id=${props.prodId}`);
        } else if (props.origin === "categories") {
          await axios.delete(`/api/categories/?id=${props.prodId}`);
        }

        MySwal.fire("Deleted!", "The item has been deleted.", "success");
      } catch (error:any) {
        console.error(error.message);
        MySwal.fire("Error", "An error occurred while deleting.", "error");
      }
    }
  };

  return (
    <button onClick={handleDelete} className="btn-red">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4"
      >
        {/* Your SVG path here */}
      </svg>
      Delete
    </button>
  );
}
