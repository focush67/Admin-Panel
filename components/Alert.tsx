import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function DeleteButton(props: any) {
  const handleDelete = async () => {
    const result = await MySwal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        if (props.origin === "products") {
          await axios.delete(`/api/products/?id=${props.prodId}`);
        } else if (props.origin === "categories") {
          await axios.delete(`/api/categories/?id=${props.prodId}`);
        }

        MySwal.fire("Deleted!", "The item has been deleted.", "success");
      } catch (error) {
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
