import Swal from "sweetalert2";

function sweetAlertSuccess(message: string) {
  return Swal.fire({
    title: message,
    icon: "success",
    iconColor: "#f97316",
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      confirmButton:
        "bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded-md",
    },
  });
}

function sweetAlertError(message: string) {
  return Swal.fire({
    title: message,
    icon: "error",
    draggable: true,
  });
}

export { sweetAlertSuccess, sweetAlertError };
